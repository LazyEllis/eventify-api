const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");

const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const twoMonthsAgo = new Date(now);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  // Get upcoming events (organized by the user or where the user has tickets)
  const [
    organizedEvents,
    ticketsCount,
    totalRevenue,
    lastMonthRevenue,
    attendeesCount,
    recentActivities,
    upcomingEventsList,
  ] = await Promise.all([
    // Count user's upcoming events
    prisma.event.count({
      where: {
        organizerId: userId,
        startDate: { gt: now },
        status: { not: "CANCELLED" },
      },
    }),

    // Count user's tickets
    prisma.ticket.count({
      where: {
        purchaserId: userId,
        status: { in: ["VALID", "PENDING"] },
      },
    }),

    // Calculate total revenue from user's events
    prisma.ticket.findMany({
      where: {
        event: {
          organizerId: userId,
        },
        status: { in: ["VALID", "USED"] },
      },
      include: {
        ticketType: {
          select: { price: true },
        },
      },
    }),

    // Calculate last month's revenue for comparison
    prisma.ticket.findMany({
      where: {
        event: {
          organizerId: userId,
        },
        status: { in: ["VALID", "USED"] },
        purchaseDate: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo,
        },
      },
      include: {
        ticketType: {
          select: { price: true },
        },
      },
    }),

    // Count total attendees for user's events
    prisma.ticketAssignee.count({
      where: {
        event: {
          organizerId: userId,
        },
      },
    }),

    // Get recent activities
    prisma.$transaction(async (tx) => {
      // Recent ticket purchases
      const recentTickets = await tx.ticket.findMany({
        where: {
          OR: [{ purchaserId: userId }, { event: { organizerId: userId } }],
        },
        orderBy: { purchaseDate: "desc" },
        take: 5,
        include: {
          event: { select: { title: true } },
          ticketType: { select: { name: true } },
        },
      });

      // Recent event creations
      const recentEvents = await tx.event.findMany({
        where: { organizerId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      // Recent attendee check-ins
      const recentCheckIns = await tx.ticketAssignee.findMany({
        where: {
          event: { organizerId: userId },
          attendedAt: { not: null },
        },
        orderBy: { attendedAt: "desc" },
        take: 5,
        include: {
          event: { select: { title: true } },
        },
      });

      // Format and merge activities
      const activities = [
        ...recentTickets.map((t) => ({
          id: `ticket-${t.id}`,
          type: "TICKET_PURCHASE",
          description: `Ticket purchased: ${t.ticketType.name} for ${t.event.title}`,
          timestamp: t.purchaseDate,
        })),
        ...recentEvents.map((e) => ({
          id: `event-${e.id}`,
          type: "EVENT_CREATION",
          description: `Event created: ${e.title}`,
          timestamp: e.createdAt,
        })),
        ...recentCheckIns.map((a) => ({
          id: `checkin-${a.id}`,
          type: "ATTENDEE_CHECKIN",
          description: `Attendee checked in: ${a.firstName} ${a.lastName} for ${a.event.title}`,
          timestamp: a.attendedAt,
        })),
      ];

      // Sort by timestamp and limit to 10
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    }),

    // Get upcoming events list
    prisma.event.findMany({
      where: {
        OR: [
          { organizerId: userId },
          {
            tickets: {
              some: {
                purchaserId: userId,
                status: { in: ["VALID", "PENDING"] },
              },
            },
          },
        ],
        startDate: { gt: now },
        status: { not: "CANCELLED" },
      },
      orderBy: { startDate: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        startDate: true,
        location: true,
        eventType: true,
        virtualLink: true,
        status: true,
      },
    }),
  ]);

  // Calculate revenue
  const currentRevenue = totalRevenue.reduce(
    (sum, ticket) => sum + ticket.ticketType.price,
    0,
  );

  const previousRevenue = lastMonthRevenue.reduce(
    (sum, ticket) => sum + ticket.ticketType.price,
    0,
  );

  // Calculate revenue change percentage
  const revenueChange =
    previousRevenue > 0
      ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
      : 0;

  // Construct response
  const dashboardData = {
    upcomingEvents: organizedEvents,
    myTickets: ticketsCount,
    totalAttendees: attendeesCount,
    revenue: currentRevenue,
    revenueChange: revenueChange,
    upcomingEventsList: upcomingEventsList,
    recentActivities: recentActivities,
  };

  res.json(dashboardData);
});

module.exports = { getDashboardData };
