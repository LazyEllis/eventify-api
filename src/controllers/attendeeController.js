const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const sendgrid = require("@sendgrid/mail");
const { BadRequestError, NotFoundError } = require("../utils/errors");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const getEventAttendees = asyncHandler(async (req, res) => {
  const eventId = req.event.id; // Use event from middleware

  // Get attendees with pagination
  const attendees = await prisma.eventAttendee.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  res.json(attendees);
});

const inviteAttendees = asyncHandler(async (req, res) => {
  const event = req.event;
  const { emails, message } = req.body;

  // Format date for email template
  const eventDate = new Date(event.startDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });

  // Send invitations
  const invitePromises = emails.map(async (email) => {
    try {
      // Create invitation record
      await prisma.eventInvitation.create({
        data: {
          email,
          eventId: event.id,
          status: "PENDING",
          message,
        },
      });

      console.log(event);
      console.log(req.user);

      // Send email with all template variables
      await sendgrid.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        templateId: process.env.SENDGRID_INVITE_TEMPLATE,
        dynamicTemplateData: {
          inviterName: `${event.organizer.firstName} ${event.organizer.lastName}`,
          eventName: event.title,
          eventDate: eventDate,
          isVirtual: event.isVirtual,
          eventLocation: event.location || "",
          eventDescription: event.description,
          message: message || "",
          inviteLink: `${process.env.FRONTEND_URL}/events/${event.id}`,
        },
      });

      return { email, status: "sent" };
    } catch (error) {
      console.error(`Failed to send invitation to ${email}:`, error);
      return { email, status: "failed", error: error.message };
    }
  });

  const results = await Promise.all(invitePromises);
  res.status(200).json({ results });
});

// ...existing code...

const recordManualAttendance = asyncHandler(async (req, res) => {
  const { ticketId } = req.body;
  const eventId = req.event.id;

  // Find the ticket
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
      eventId, // Ensure the ticket is for this event
    },
    include: {
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
    throw new NotFoundError("Ticket not found or not valid for this event");
  }

  // Check if the ticket is valid
  if (ticket.status !== "VALID") {
    throw new BadRequestError(
      `Ticket is already ${ticket.status.toLowerCase()}`,
    );
  }

  const now = new Date();

  // Mark ticket as used and record attendance
  const result = await prisma.$transaction(async (prisma) => {
    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "USED" },
    });

    // Record attendance
    const attendee = await prisma.eventAttendee.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: ticket.userId,
        },
      },
      update: {
        attended: true,
        attendedAt: now,
      },
      create: {
        eventId,
        userId: ticket.userId,
        attended: true,
        attendedAt: now,
      },
    });

    return {
      ticket: updatedTicket,
      attendee,
    };
  });

  res.json({
    success: true,
    message: "Attendance recorded successfully",
    data: {
      ticket: result.ticket,
      attendee: result.attendee,
      user: ticket.user,
    },
  });
});

const getAttendeeConnections = asyncHandler(async (req, res) => {
  // Get all events user has attended or is attending
  const connections = await prisma.eventAttendee.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          startDate: true,
          attendees: {
            where: {
              NOT: {
                userId: req.user.id,
              },
            },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Format connections by event
  const formattedConnections = connections.map((connection) => ({
    event: {
      id: connection.event.id,
      title: connection.event.title,
      date: connection.event.startDate,
    },
    attendees: connection.event.attendees.map((attendee) => ({
      id: attendee.user.id,
      firstName: attendee.user.firstName,
      lastName: attendee.user.lastName,
      email: attendee.user.email,
    })),
  }));

  res.json(formattedConnections);
});

module.exports = {
  getEventAttendees,
  inviteAttendees,
  recordManualAttendance,
  getAttendeeConnections,
};
