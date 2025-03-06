const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors");

const purchaseTicket = asyncHandler(async (req, res) => {
  const { eventId, tickets } = req.body;

  // Get all ticket types and validate them
  const ticketTypes = await prisma.ticketType.findMany({
    where: {
      id: { in: tickets.map((ticket) => ticket.ticketTypeId) },
      eventId: eventId,
    },
    include: { event: true },
  });

  if (ticketTypes.length !== tickets.length) {
    throw new BadRequestError("One or more ticket types not found");
  }

  const now = new Date();

  // Validate tickets and calculate total amount
  let totalAmountInKobo = 0;
  for (const requestedTicket of tickets) {
    const ticketType = ticketTypes.find(
      (tt) => tt.id === requestedTicket.ticketTypeId,
    );

    // Check sale period
    if (now < ticketType.saleStartDate || now > ticketType.saleEndDate) {
      throw new BadRequestError(
        `Tickets of type ${ticketType.name} are not currently on sale`,
      );
    }

    // Check max per user limit
    const existingTickets = await prisma.ticket.count({
      where: {
        ticketTypeId: ticketType.id,
        userId: req.user.id,
        status: "VALID",
      },
    });

    if (existingTickets + requestedTicket.quantity > ticketType.maxPerUser) {
      throw new BadRequestError(
        `Maximum ${ticketType.maxPerUser} tickets allowed per user for ${ticketType.name}`,
      );
    }

    // Check availability
    if (ticketType.quantity < requestedTicket.quantity) {
      throw new BadRequestError(
        `Not enough tickets available for ${ticketType.name}`,
      );
    }

    totalAmountInKobo += Math.round(
      ticketType.price * requestedTicket.quantity * 100,
    );
  }

  // Get user details for payment
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { email: true, firstName: true, lastName: true },
  });

  try {
    // Create Paystack transaction
    const transaction = await paystack.transaction.initialize({
      email: user.email,
      amount: totalAmountInKobo,
      currency: "NGN",
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
      metadata: {
        eventId,
        userId: req.user.id,
        tickets: tickets,
        custom_fields: [
          {
            display_name: "Event Name",
            variable_name: "event_name",
            value: ticketTypes[0].event.title,
          },
        ],
      },
    });

    // Create tickets in pending state
    const createdTickets = await prisma.$transaction(async (prisma) => {
      const allTickets = [];

      for (const requestedTicket of tickets) {
        // Update ticket type quantity
        await prisma.ticketType.update({
          where: { id: requestedTicket.ticketTypeId },
          data: {
            quantity: {
              decrement: requestedTicket.quantity,
            },
          },
        });

        // Create tickets for this type
        for (let i = 0; i < requestedTicket.quantity; i++) {
          const ticket = await prisma.ticket.create({
            data: {
              userId: req.user.id,
              eventId,
              ticketTypeId: requestedTicket.ticketTypeId,
              status: "PENDING",
              paymentReference: transaction.data.reference,
            },
          });
          allTickets.push(ticket);
        }
      }

      return allTickets;
    });

    res.status(201).json({
      tickets: createdTickets,
      authorizationUrl: transaction.data.authorization_url,
      reference: transaction.data.reference,
    });
  } catch (error) {
    console.error("Paystack Error:", error);
    throw new BadRequestError("Payment initialization failed");
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const reference = req.paymentReference;

  try {
    // First verify the transaction exists
    const transaction = await paystack.transaction.verify({ reference });

    if (!transaction || !transaction.data) {
      throw new BadRequestError("Invalid payment reference");
    }

    if (transaction.data.status === "success") {
      // Update tickets status
      await prisma.ticket.updateMany({
        where: { paymentReference: reference },
        data: { status: "VALID" },
      });

      res.json({ message: "Payment verified successfully" });
    } else {
      // Revert ticket quantities and mark tickets as cancelled
      const tickets = await prisma.ticket.findMany({
        where: { paymentReference: reference },
        select: {
          id: true,
          ticketTypeId: true,
        },
      });

      await prisma.$transaction(async (prisma) => {
        // Group tickets by ticket type for efficient updates
        const ticketCounts = tickets.reduce((acc, ticket) => {
          acc[ticket.ticketTypeId] = (acc[ticket.ticketTypeId] || 0) + 1;
          return acc;
        }, {});

        // Restore ticket type quantities
        for (const [ticketTypeId, count] of Object.entries(ticketCounts)) {
          await prisma.ticketType.update({
            where: { id: ticketTypeId },
            data: {
              quantity: {
                increment: count,
              },
            },
          });
        }

        // Mark tickets as cancelled
        await prisma.ticket.updateMany({
          where: { paymentReference: reference },
          data: { status: "CANCELLED" },
        });
      });

      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Paystack Verification Error:", error);

    // Return a more specific error message
    throw new BadRequestError(
      "Payment verification failed. Please check the reference number or try again later.",
    );
  }
});

const getUserTickets = asyncHandler(async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      event: {
        select: {
          title: true,
          startDate: true,
          endDate: true,
          location: true,
          isVirtual: true,
          virtualLink: true,
        },
      },
      ticketType: {
        select: {
          name: true,
          price: true,
        },
      },
    },
  });

  res.json(tickets);
});

const getTicketDetails = asyncHandler(async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: {
      event: {
        include: {
          organizer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      ticketType: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }

  if (ticket.userId !== req.user.id && req.user.role !== "ADMIN") {
    throw new ForbiddenError("Not authorized to view ticket details");
  }

  res.json(ticket);
});

module.exports = {
  purchaseTicket,
  verifyPayment,
  getUserTickets,
  getTicketDetails,
};
