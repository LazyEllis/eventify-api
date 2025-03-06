const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");

const getEventAnalytics = asyncHandler(async (req, res) => {
  const eventId = req.event.id; // Use event from middleware

  // Get analytics data
  const [ticketsSold, attendees, revenue] = await Promise.all([
    // Total tickets sold
    prisma.ticket.count({
      where: {
        eventId,
        status: "VALID",
      },
    }),
    // Total attendees checked in
    prisma.eventAttendee.count({
      where: {
        eventId,
        attended: true,
      },
    }),
    // Total revenue
    prisma.ticket.findMany({
      where: {
        eventId,
        status: "VALID",
      },
      include: {
        ticketType: {
          select: {
            price: true,
          },
        },
      },
    }),
  ]);

  // Calculate total revenue
  const totalRevenue = revenue.reduce(
    (sum, ticket) => sum + ticket.ticketType.price,
    0,
  );

  res.json({
    ticketsSold,
    attendees,
    revenue: totalRevenue,
    attendanceRate: ticketsSold > 0 ? (attendees / ticketsSold) * 100 : 0,
  });
});

const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate
    ? new Date(startDate)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
  const end = endDate ? new Date(endDate) : new Date();

  const sales = await prisma.ticket.groupBy({
    by: ["purchaseDate"],
    where: {
      status: "VALID",
      purchaseDate: {
        gte: start,
        lte: end,
      },
      event: {
        organizerId: req.user.id,
      },
    },
    _count: {
      id: true,
    },
    _sum: {
      ticketType: {
        select: {
          price: true,
        },
      },
    },
  });

  res.json({
    sales: sales.map((day) => ({
      date: day.purchaseDate,
      count: day._count.id,
      revenue: day._sum.ticketType?.price || 0,
    })),
    totalSales: sales.reduce((sum, day) => sum + day._count.id, 0),
    totalRevenue: sales.reduce(
      (sum, day) => sum + (day._sum.ticketType?.price || 0),
      0,
    ),
  });
});

const getAttendanceAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate
    ? new Date(startDate)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: start,
        lte: end,
      },
      organizerId: req.user.id,
    },
    include: {
      _count: {
        select: {
          tickets: {
            where: {
              status: "VALID",
            },
          },
          attendees: {
            where: {
              attended: true,
            },
          },
        },
      },
    },
  });

  const analytics = events.map((event) => ({
    eventId: event.id,
    title: event.title,
    date: event.startDate,
    ticketsSold: event._count.tickets,
    actualAttendees: event._count.attendees,
    attendanceRate:
      event._count.tickets > 0
        ? (event._count.attendees / event._count.tickets) * 100
        : 0,
  }));

  res.json({
    events: analytics,
    summary: {
      totalEvents: events.length,
      totalTicketsSold: events.reduce(
        (sum, event) => sum + event._count.tickets,
        0,
      ),
      totalAttendees: events.reduce(
        (sum, event) => sum + event._count.attendees,
        0,
      ),
      averageAttendanceRate:
        events.length > 0
          ? analytics.reduce((sum, event) => sum + event.attendanceRate, 0) /
            events.length
          : 0,
    },
  });
});

module.exports = {
  getEventAnalytics,
  getSalesAnalytics,
  getAttendanceAnalytics,
};
