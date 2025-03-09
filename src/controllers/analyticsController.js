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
        status: { in: ["VALID", "USED", "EXPIRED"] },
      },
    }),
    // Total attendees checked in
    prisma.ticketAssignee.count({
      where: {
        eventId,
        attendedAt: {
          not: null,
        },
      },
    }),
    // Total revenue
    prisma.ticket.findMany({
      where: {
        eventId,
        status: { in: ["VALID", "USED", "EXPIRED"] },
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

  const sales = await prisma.ticket.findMany({
    where: {
      status: { in: ["VALID", "USED", "EXPIRED"] }, // Include all sold tickets regardless of current status
      purchaseDate: {
        gte: start,
        lte: end,
      },
      event: {
        organizerId: req.user.id,
      },
    },
    include: {
      ticketType: {
        select: {
          price: true,
        },
      },
    },
    orderBy: {
      purchaseDate: "asc",
    },
  });

  // Group sales by date
  const salesByDate = sales.reduce((acc, ticket) => {
    const dateStr = ticket.purchaseDate.toISOString().split("T")[0];

    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: new Date(dateStr),
        count: 0,
        revenue: 0,
      };
    }

    acc[dateStr].count += 1;
    acc[dateStr].revenue += ticket.ticketType.price;

    return acc;
  }, {});

  const salesArray = Object.values(salesByDate);

  res.json({
    sales: salesArray,
    totalSales: sales.length,
    totalRevenue: salesArray.reduce((sum, day) => sum + day.revenue, 0),
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
      tickets: {
        where: {
          status: { in: ["VALID", "USED", "EXPIRED"] },
        },
        select: {
          id: true,
        },
      },
      TicketAssignee: {
        where: {
          attendedAt: {
            not: null,
          },
        },
        select: {
          id: true,
        },
      },
    },
  });

  const analytics = events.map((event) => ({
    eventId: event.id,
    title: event.title,
    date: event.startDate,
    ticketsSold: event.tickets.length,
    actualAttendees: event.TicketAssignee.length,
    attendanceRate:
      event.tickets.length > 0
        ? (event.TicketAssignee.length / event.tickets.length) * 100
        : 0,
  }));

  res.json({
    events: analytics,
    summary: {
      totalEvents: events.length,
      totalTicketsSold: events.reduce(
        (sum, event) => sum + event.tickets.length,
        0,
      ),
      totalAttendees: events.reduce(
        (sum, event) => sum + event.TicketAssignee.length,
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
