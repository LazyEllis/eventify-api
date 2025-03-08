const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const sendgrid = require("@sendgrid/mail");
const { NotFoundError, BadRequestError } = require("../utils/errors");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const getEventAttendees = asyncHandler(async (req, res) => {
  const eventId = req.event.id;

  const attendees = await prisma.ticketAssignee.findMany({
    where: {
      eventId,
    },
    include: {
      ticket: {
        include: {
          ticketType: {
            select: {
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [
      { attendedAt: "desc" },
      { lastName: "asc" },
      { firstName: "asc" },
    ],
  });

  res.json(attendees);
});

const checkInAttendee = asyncHandler(async (req, res) => {
  const eventId = req.event.id;
  const { assigneeId } = req.params;

  // Find attendee
  const attendee = await prisma.ticketAssignee.findFirst({
    where: {
      id: assigneeId,
      eventId,
    },
    include: {
      ticket: true,
    },
  });

  if (!attendee) {
    throw new NotFoundError("Attendee not found for this event");
  }

  if (attendee.attendedAt) {
    throw new BadRequestError("Attendee already checked in");
  }

  // Check in attendee and mark ticket as used
  const updatedAttendee = await prisma.$transaction(async (tx) => {
    // Update attendee
    const updated = await tx.ticketAssignee.update({
      where: { id: assigneeId },
      data: {
        attendedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Mark ticket as used
    await tx.ticket.update({
      where: { id: attendee.ticketId },
      data: {
        status: "USED",
      },
    });

    return updated;
  });

  res.json(updatedAttendee);
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

module.exports = {
  getEventAttendees,
  checkInAttendee,
  inviteAttendees,
};
