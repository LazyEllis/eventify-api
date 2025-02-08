const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

const createTicketType = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const ticketType = await prisma.ticketType.create({
    data: {
      ...req.body,
      eventId: req.params.id,
    },
  });

  res.status(201).json(ticketType);
});

const getTicketTypes = asyncHandler(async (req, res) => {
  const ticketTypes = await prisma.ticketType.findMany({
    where: {
      eventId: req.params.id,
    },
  });

  res.json(ticketTypes);
});

const purchaseTicket = asyncHandler(async (req, res) => {
  const { eventId, ticketTypeId, quantity } = req.body;

  // Check ticket availability
  const ticketType = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
    include: { event: true },
  });

  if (!ticketType) {
    return res.status(404).json({ message: "Ticket type not found" });
  }

  if (ticketType.quantity < quantity) {
    return res.status(400).json({ message: "Not enough tickets available" });
  }

  // Get user details for payment
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { email: true, firstName: true, lastName: true },
  });

  // Create Paystack transaction
  const amountInKobo = Math.round(ticketType.price * quantity * 100);

  try {
    const transaction = await paystack.transaction.initialize({
      email: user.email,
      amount: amountInKobo,
      currency: "NGN",
      callback_url: `${process.env.FRONTEND_URL}/tickets/verify`,
      metadata: {
        eventId,
        ticketTypeId,
        userId: req.user.id,
        quantity,
        custom_fields: [
          {
            display_name: "Event Name",
            variable_name: "event_name",
            value: ticketType.event.title,
          },
          {
            display_name: "Ticket Type",
            variable_name: "ticket_type",
            value: ticketType.name,
          },
        ],
      },
    });

    // Create tickets in pending state
    const tickets = await prisma.$transaction(async (prisma) => {
      // Update ticket type quantity
      await prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // Create tickets
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = await prisma.ticket.create({
          data: {
            userId: req.user.id,
            eventId,
            ticketTypeId,
            status: "PENDING", // Add PENDING to TicketStatus enum
            paymentReference: transaction.data.reference, // Add this field to Ticket model
          },
        });
        tickets.push(ticket);
      }

      return tickets;
    });

    res.status(201).json({
      tickets,
      authorizationUrl: transaction.data.authorization_url,
      reference: transaction.data.reference,
    });
  } catch (error) {
    console.error("Paystack Error:", error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await paystack.transaction.verify(reference);

    if (response.data.status === "success") {
      // Update tickets status
      await prisma.ticket.updateMany({
        where: { paymentReference: reference },
        data: { status: "VALID" },
      });

      res.json({ message: "Payment verified successfully" });
    } else {
      // Revert ticket quantity and mark tickets as cancelled
      const tickets = await prisma.ticket.findMany({
        where: { paymentReference: reference },
      });

      await prisma.$transaction(async (prisma) => {
        // Restore ticket type quantity
        for (const ticket of tickets) {
          await prisma.ticketType.update({
            where: { id: ticket.ticketTypeId },
            data: {
              quantity: {
                increment: 1,
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
    res.status(500).json({ message: "Payment verification failed" });
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
      event: true,
      ticketType: true,
    },
  });

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (ticket.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json(ticket);
});

module.exports = {
  createTicketType,
  getTicketTypes,
  purchaseTicket,
  verifyPayment,
  getUserTickets,
  getTicketDetails,
};
