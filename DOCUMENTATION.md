# Eventify API Documentation

Welcome to the Eventify API documentation. This API allows you to manage events, tickets, users, and more. Below you will find detailed information on how to use the API, including endpoints, request parameters, and response formats.

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Events](#events)
4. [Tickets](#tickets)
5. [Messages](#messages)
6. [Analytics](#analytics)
7. [Attendees](#attendees)
8. [Virtual Events](#virtual-events)

## Authentication

### Register

**Endpoint:** `POST /auth/register`

**Description:** Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "jwt-token"
}
```

### Login

**Endpoint:** `POST /auth/login`

**Description:** Login an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "jwt-token"
}
```

## Users

### Get Profile

**Endpoint:** `GET /users/profile`

**Description:** Get the profile of the authenticated user.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ATTENDEE"
}
```

### Update Profile

**Endpoint:** `PUT /users/profile`

**Description:** Update the profile of the authenticated user.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

## Events

### Create Event

**Endpoint:** `POST /events`

**Description:** Create a new event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "title": "Event Title",
  "description": "Event Description",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T18:00:00Z",
  "location": "Event Location",
  "isVirtual": false,
  "virtualLink": "https://virtual.event.link",
  "capacity": 100,
  "category": "Category",
  "status": "DRAFT"
}
```

**Response:**

```json
{
  "id": "event-id",
  "title": "Event Title",
  "description": "Event Description",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T18:00:00Z",
  "location": "Event Location",
  "isVirtual": false,
  "virtualLink": "https://virtual.event.link",
  "capacity": 100,
  "category": "Category",
  "status": "DRAFT",
  "organizerId": "user-id",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

### Get Events

**Endpoint:** `GET /events`

**Description:** Get a list of published events.

**Response:**

```json
[
  {
    "id": "event-id",
    "title": "Event Title",
    "description": "Event Description",
    "startDate": "2025-12-01T10:00:00Z",
    "endDate": "2025-12-01T18:00:00Z",
    "location": "Event Location",
    "isVirtual": false,
    "virtualLink": "https://virtual.event.link",
    "capacity": 100,
    "category": "Category",
    "status": "PUBLISHED",
    "organizer": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe"
    },
    "ticketTypes": [
      {
        "id": "ticket-type-id",
        "name": "General Admission",
        "price": 50.0,
        "quantity": 100
      }
    ]
  }
]
```

### Get Event

**Endpoint:** `GET /events/:id`

**Description:** Get details of a specific event.

**Response:**

```json
{
  "id": "event-id",
  "title": "Event Title",
  "description": "Event Description",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T18:00:00Z",
  "location": "Event Location",
  "isVirtual": false,
  "virtualLink": "https://virtual.event.link",
  "capacity": 100,
  "category": "Category",
  "status": "PUBLISHED",
  "organizer": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe"
  },
  "ticketTypes": [
    {
      "id": "ticket-type-id",
      "name": "General Admission",
      "price": 50.0,
      "quantity": 100
    }
  ]
}
```

### Update Event

**Endpoint:** `PUT /events/:id`

**Description:** Update an existing event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "title": "Updated Event Title",
  "description": "Updated Event Description",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T18:00:00Z",
  "location": "Updated Event Location",
  "isVirtual": true,
  "virtualLink": "https://updated.virtual.event.link",
  "capacity": 200,
  "category": "Updated Category",
  "status": "PUBLISHED"
}
```

**Response:**

```json
{
  "id": "event-id",
  "title": "Updated Event Title",
  "description": "Updated Event Description",
  "startDate": "2025-12-01T10:00:00Z",
  "endDate": "2025-12-01T18:00:00Z",
  "location": "Updated Event Location",
  "isVirtual": true,
  "virtualLink": "https://updated.virtual.event.link",
  "capacity": 200,
  "category": "Updated Category",
  "status": "PUBLISHED",
  "organizerId": "user-id",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

### Delete Event

**Endpoint:** `DELETE /events/:id`

**Description:** Delete an existing event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:** `204 No Content`

### Get Event Categories

**Endpoint:** `GET /events/categories`

**Description:** Get a list of event categories.

**Response:**

```json
["Category1", "Category2", "Category3"]
```

### Search Events

**Endpoint:** `GET /events/search`

**Description:** Search for events based on various filters.

**Query Parameters:**

- `search` (optional): Search term for event title or description.
- `category` (optional): Filter by event category.
- `startDate` (optional): Filter by start date.
- `endDate` (optional): Filter by end date.
- `isVirtual` (optional): Filter by virtual events.
- `page` (optional): Page number for pagination.
- `limit` (optional): Number of results per page.

**Response:**

```json
{
  "events": [
    {
      "id": "event-id",
      "title": "Event Title",
      "description": "Event Description",
      "startDate": "2025-12-01T10:00:00Z",
      "endDate": "2025-12-01T18:00:00Z",
      "location": "Event Location",
      "isVirtual": false,
      "virtualLink": "https://virtual.event.link",
      "capacity": 100,
      "category": "Category",
      "status": "PUBLISHED",
      "organizer": {
        "id": "user-id",
        "firstName": "John",
        "lastName": "Doe"
      },
      "ticketTypes": [
        {
          "id": "ticket-type-id",
          "name": "General Admission",
          "price": 50.0,
          "quantity": 100
        }
      ],
      "_count": {
        "attendees": 50
      }
    }
  ],
  "pagination": {
    "total": 1,
    "pages": 1,
    "page": 1,
    "limit": 10
  }
}
```

## Tickets

### Get Ticket Types

**Endpoint:** `GET /events/:id/ticket-types`

**Description:** Get a list of ticket types for an event.

**Response:**

```json
[
  {
    "id": "ticket-type-id",
    "name": "General Admission",
    "price": 50.0,
    "quantity": 100,
    "description": "General admission ticket",
    "maxPerUser": 4,
    "saleStartDate": "2025-11-01T10:00:00Z",
    "saleEndDate": "2025-11-30T23:59:59Z"
  }
]
```

### Create Ticket Type

**Endpoint:** `POST /events/:id/ticket-types`

**Description:** Create a new ticket type for an event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "name": "VIP",
  "price": 100.0,
  "quantity": 50,
  "description": "VIP ticket with special perks",
  "maxPerUser": 2,
  "saleStartDate": "2025-11-01T10:00:00Z",
  "saleEndDate": "2025-11-30T23:59:59Z"
}
```

**Response:**

```json
{
  "id": "ticket-type-id",
  "name": "VIP",
  "price": 100.0,
  "quantity": 50,
  "description": "VIP ticket with special perks",
  "maxPerUser": 2,
  "saleStartDate": "2025-11-01T10:00:00Z",
  "saleEndDate": "2025-11-30T23:59:59Z",
  "eventId": "event-id",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

### Update Ticket Type

**Endpoint:** `PUT /events/:id/ticket-types/:typeId`

**Description:** Update an existing ticket type.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "name": "Early Bird",
  "price": 75.0,
  "quantity": 100,
  "description": "Early bird discount tickets",
  "maxPerUser": 2,
  "saleStartDate": "2025-11-01T10:00:00Z",
  "saleEndDate": "2025-11-15T23:59:59Z"
}
```

**Response:**

```json
{
  "id": "ticket-type-id",
  "name": "Early Bird",
  "price": 75.0,
  "quantity": 100,
  "description": "Early bird discount tickets",
  "maxPerUser": 2,
  "saleStartDate": "2025-11-01T10:00:00Z",
  "saleEndDate": "2025-11-15T23:59:59Z",
  "eventId": "event-id",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z"
}
```

### Delete Ticket Type

**Endpoint:** `DELETE /events/:id/ticket-types/:typeId`

**Description:** Delete a ticket type. Cannot delete if tickets have been sold.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:** `204 No Content`

### Purchase Ticket

**Endpoint:** `POST /tickets/purchase`

**Description:** Purchase multiple tickets of different types for an event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "eventId": "event-id",
  "tickets": [
    {
      "ticketTypeId": "ticket-type-id-1",
      "quantity": 2
    },
    {
      "ticketTypeId": "ticket-type-id-2",
      "quantity": 1
    }
  ]
}
```

**Response:**

```json
{
  "tickets": [
    {
      "id": "ticket-id-1",
      "purchaseDate": "2025-11-01T10:00:00Z",
      "status": "PENDING",
      "paymentReference": "payment-reference",
      "userId": "user-id",
      "eventId": "event-id",
      "ticketTypeId": "ticket-type-id-1",
      "createdAt": "2025-11-01T10:00:00Z",
      "updatedAt": "2025-11-01T10:00:00Z"
    },
    {
      "id": "ticket-id-2",
      "purchaseDate": "2025-11-01T10:00:00Z",
      "status": "PENDING",
      "paymentReference": "payment-reference",
      "userId": "user-id",
      "eventId": "event-id",
      "ticketTypeId": "ticket-type-id-1",
      "createdAt": "2025-11-01T10:00:00Z",
      "updatedAt": "2025-11-01T10:00:00Z"
    },
    {
      "id": "ticket-id-3",
      "purchaseDate": "2025-11-01T10:00:00Z",
      "status": "PENDING",
      "paymentReference": "payment-reference",
      "userId": "user-id",
      "eventId": "event-id",
      "ticketTypeId": "ticket-type-id-2",
      "createdAt": "2025-11-01T10:00:00Z",
      "updatedAt": "2025-11-01T10:00:00Z"
    }
  ],
  "authorizationUrl": "https://paystack.com/authorization-url",
  "reference": "payment-reference"
}
```

### Verify Payment

**Endpoint:** `GET /tickets/verify`

**Description:** Verify the payment for purchased tickets.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Query Parameters:**

- `reference`: Payment reference.

**Response:**

```json
{
  "message": "Payment verified successfully"
}
```

### Get User Tickets

**Endpoint:** `GET /tickets/user`

**Description:** Get a list of tickets purchased by the authenticated user.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
[
  {
    "id": "ticket-id",
    "purchaseDate": "2025-11-01T10:00:00Z",
    "status": "VALID",
    "paymentReference": "payment-reference",
    "userId": "user-id",
    "eventId": "event-id",
    "ticketTypeId": "ticket-type-id",
    "createdAt": "2025-11-01T10:00:00Z",
    "updatedAt": "2025-11-01T10:00:00Z",
    "event": {
      "title": "Event Title",
      "startDate": "2025-12-01T10:00:00Z",
      "endDate": "2025-12-01T18:00:00Z",
      "location": "Event Location",
      "isVirtual": false,
      "virtualLink": "https://virtual.event.link"
    },
    "ticketType": {
      "name": "General Admission",
      "price": 50.0
    }
  }
]
```

### Get Ticket Details

**Endpoint:** `GET /tickets/:id`

**Description:** Get details of a specific ticket.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
{
  "id": "ticket-id",
  "purchaseDate": "2025-11-01T10:00:00Z",
  "status": "VALID",
  "paymentReference": "payment-reference",
  "userId": "user-id",
  "eventId": "event-id",
  "ticketTypeId": "ticket-type-id",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z",
  "event": {
    "title": "Event Title",
    "startDate": "2025-12-01T10:00:00Z",
    "endDate": "2025-12-01T18:00:00Z",
    "location": "Event Location",
    "isVirtual": false,
    "virtualLink": "https://virtual.event.link",
    "organizer": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  },
  "ticketType": {
    "name": "General Admission",
    "price": 50.0
  },
  "user": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com"
  }
}
```

## Messages

### Send Message

**Endpoint:** `POST /events/:id/messages`

**Description:** Send a message to an event. Messages are delivered in real-time to all connected users in the event room.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "content": "This is a message"
}
```

**Response:**

```json
{
  "id": "message-id",
  "content": "This is a message",
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-01T10:00:00Z",
  "senderId": "user-id",
  "eventId": "event-id",
  "sender": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Get Event Messages

**Endpoint:** `GET /events/:id/messages`

**Description:** Get messages for a specific event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
[
  {
    "id": "message-id",
    "content": "This is a message",
    "createdAt": "2025-11-01T10:00:00Z",
    "updatedAt": "2025-11-01T10:00:00Z",
    "senderId": "user-id",
    "eventId": "event-id",
    "sender": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

### Real-time Messages

Messages are delivered in real-time using Socket.IO. To receive real-time messages:

1. Connect to the WebSocket server:

```javascript
const socket = io("http://your-api-url", {
  auth: {
    token: "your-jwt-token",
  },
});
```

2. Join an event room to receive messages for that event:

```javascript
socket.emit("join-event", "event-id");
```

3. Listen for new messages:

```javascript
socket.on("new-message", (message) => {
  console.log("New message received:", message);
});
```

4. Send typing indicators when a user starts or stops typing:

```javascript
// When user starts typing
socket.emit("typing", { eventId: "event-id", isTyping: true });

// When user stops typing
socket.emit("typing", { eventId: "event-id", isTyping: false });
```

5. Listen for typing updates from other users:

```javascript
socket.on("typing-update", (typingData) => {
  // typingData contains:
  // - userId: the ID of the user who is typing
  // - isTyping: boolean indicating if the user is typing
  // - firstName: first name of the user
  // - lastName: last name of the user

  console.log(
    `${typingData.firstName} ${typingData.lastName} is ${typingData.isTyping ? "typing..." : "stopped typing"}`,
  );
});
```

6. Leave an event room when done:

```javascript
socket.emit("leave-event", "event-id");
```

### Subscribe to Event

**Endpoint:** `POST /events/:id/subscribe`

**Description:** Subscribe to an event to receive real-time messages. User must have a valid ticket or be the event organizer.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
{
  "message": "Subscribed to event"
}
```

### WebSocket Events

| Event           | Description                                           |
| --------------- | ----------------------------------------------------- |
| `connect`       | Fired when socket connection is established           |
| `disconnect`    | Fired when socket connection is closed                |
| `join-event`    | Join an event room to receive messages                |
| `leave-event`   | Leave an event room                                   |
| `new-message`   | Received when a new message is sent to the event room |
| `typing`        | Emit when a user starts/stops typing                  |
| `typing-update` | Received when another user starts/stops typing        |

### Error Handling

The WebSocket connection includes authentication using JWT tokens. Common errors:

- Authentication error: Invalid or missing token
- User not found: Token refers to non-existent user
- Connection error: Unable to establish WebSocket connection

## Analytics

### Get Event Analytics

**Endpoint:** `GET /events/:id/analytics`

**Description:** Get analytics for a specific event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
{
  "ticketsSold": 100,
  "attendees": 50,
  "revenue": 5000.0,
  "attendanceRate": 50.0
}
```

### Get Sales Analytics

**Endpoint:** `GET /sales`

**Description:** Get sales analytics.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Query Parameters:**

- `startDate` (optional): Start date for the analytics period.
- `endDate` (optional): End date for the analytics period.

**Response:**

```json
{
  "sales": [
    {
      "date": "2025-11-01",
      "count": 10,
      "revenue": 500.0
    }
  ],
  "totalSales": 10,
  "totalRevenue": 500.0
}
```

### Get Attendance Analytics

**Endpoint:** `GET /attendance`

**Description:** Get attendance analytics.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Query Parameters:**

- `startDate` (optional): Start date for the analytics period.
- `endDate` (optional): End date for the analytics period.

**Response:**

```json
{
  "events": [
    {
      "eventId": "event-id",
      "title": "Event Title",
      "date": "2025-12-01T10:00:00Z",
      "ticketsSold": 100,
      "actualAttendees": 50,
      "attendanceRate": 50.0
    }
  ],
  "summary": {
    "totalEvents": 1,
    "totalTicketsSold": 100,
    "totalAttendees": 50,
    "averageAttendanceRate": 50.0
  }
}
```

## Attendees

### Get Event Attendees

**Endpoint:** `GET /events/:id/attendees`

**Description:** Get a list of attendees for a specific event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
[
  {
    "id": "attendee-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
]
```

### Invite Attendees

**Endpoint:** `POST /events/:id/attendees/invite`

**Description:** Invite attendees to an event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Request Body:**

```json
{
  "emails": ["invitee@example.com"],
  "message": "You are invited to our event!"
}
```

**Response:**

```json
{
  "results": [
    {
      "email": "invitee@example.com",
      "status": "sent"
    }
  ]
}
```

### Get Attendee Connections

**Endpoint:** `GET /attendees/connections`

**Description:** Get connections of the authenticated user with other attendees.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
[
  {
    "event": {
      "id": "event-id",
      "title": "Event Title",
      "date": "2025-12-01T10:00:00Z"
    },
    "attendees": [
      {
        "id": "attendee-id",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane.doe@example.com"
      }
    ]
  }
]
```

## Virtual Events

### Get Virtual Event Link

**Endpoint:** `GET /events/:id/virtual-link`

**Description:** Get the virtual event link for a specific event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
{
  "virtualLink": "https://virtual.event.link"
}
```

### Record Virtual Attendance

**Endpoint:** `POST /events/:id/virtual-attendance`

**Description:** Record the attendance of a user for a virtual event.

**Headers:**

```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Response:**

```json
{
  "id": "attendance-id",
  "attended": true,
  "attendedAt": "2025-12-01T10:00:00Z",
  "eventId": "event-id",
  "userId": "user-id"
}
```
