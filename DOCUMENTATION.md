# Eventify API Documentation

Welcome to the Eventify API documentation. This guide provides comprehensive information about available endpoints, request formats, and responses for integrating with our event management platform.

## Contents

- [Authentication](#authentication)
- [Users](#users)
- [Events](#events)
- [Ticket Types](#ticket-types)
- [Tickets](#tickets)
- [Messaging](#messaging)
- [Virtual Events](#virtual-events)
- [Attendees](#attendees)
- [Analytics](#analytics)
- [Real-time Communication](#real-time-communication)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

## Authentication

All API endpoints require authentication using JSON Web Tokens (JWT) except for registration and login endpoints.

### Register a new user

Creates a new user account in the system.

**Request:**

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

Authenticates a user and provides an access token.

**Request:**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Users

### Get user profile

Retrieves the profile information for the authenticated user.

**Request:**

```http
GET /users/profile
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

### Update user profile

Updates the authenticated user's profile information.

**Request:**

```http
PUT /users/profile
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith"
}
```

**Response:** `200 OK`

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "role": "USER"
}
```

## Events

### Create an event

Creates a new event with the authenticated user as the organizer.

**Request:**

```http
POST /events
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Annual tech conference for developers",
  "startDate": "2025-06-15T09:00:00Z",
  "endDate": "2025-06-17T18:00:00Z",
  "capacity": 500,
  "category": "Technology",
  "location": "Convention Center, New York",
  "isVirtual": false
}
```

**Response:** `201 Created`

```json
{
  "id": "event_123",
  "title": "Tech Conference 2025",
  "description": "Annual tech conference for developers",
  "startDate": "2025-06-15T09:00:00Z",
  "endDate": "2025-06-17T18:00:00Z",
  "capacity": 500,
  "category": "Technology",
  "location": "Convention Center, New York",
  "isVirtual": false,
  "status": "DRAFT",
  "organizerId": "user_123",
  "createdAt": "2025-03-05T10:30:00Z",
  "updatedAt": "2025-03-05T10:30:00Z"
}
```

### List all events

Retrieves a list of all published events.

**Request:**

```http
GET /events
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
[
  {
    "id": "event_123",
    "title": "Tech Conference 2025",
    "description": "Annual tech conference for developers",
    "startDate": "2025-06-15T09:00:00Z",
    "endDate": "2025-06-17T18:00:00Z",
    "capacity": 500,
    "category": "Technology",
    "location": "Convention Center, New York",
    "isVirtual": false,
    "status": "PUBLISHED",
    "organizer": {
      "id": "user_123",
      "firstName": "John",
      "lastName": "Doe"
    },
    "ticketTypes": [
      {
        "id": "ticket_type_456",
        "name": "VIP Pass",
        "price": 299.99,
        "quantity": 50
      }
    ]
  }
]
```

### List user's organized events

Retrieves a list of events organized by the authenticated user.

**Request:**

```http
GET /events/my-events
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
[
  {
    "id": "event_123",
    "title": "Tech Conference 2025",
    "description": "Annual tech conference for developers",
    "startDate": "2025-06-15T09:00:00Z",
    "endDate": "2025-06-17T18:00:00Z",
    "capacity": 500,
    "category": "Technology",
    "location": "Convention Center, New York",
    "isVirtual": false,
    "status": "PUBLISHED",
    "organizer": {
      "id": "user_123",
      "firstName": "John",
      "lastName": "Doe"
    },
    "_count": {
      "tickets": 25,
      "attendees": 10
    },
    "ticketTypes": [
      {
        "id": "ticket_type_456",
        "name": "VIP Pass",
        "price": 299.99,
        "quantity": 50
      }
    ]
  }
]
```

### Get single event details

Retrieves detailed information about a specific event.

**Request:**

```http
GET /events/:id
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "id": "event_123",
  "title": "Tech Conference 2025",
  "description": "Annual tech conference for developers",
  "startDate": "2025-06-15T09:00:00Z",
  "endDate": "2025-06-17T18:00:00Z",
  "capacity": 500,
  "category": "Technology",
  "location": "Convention Center, New York",
  "isVirtual": false,
  "status": "PUBLISHED",
  "organizer": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe"
  },
  "ticketTypes": [
    {
      "id": "ticket_type_456",
      "name": "VIP Pass",
      "price": 299.99,
      "quantity": 50,
      "description": "VIP access to all conference areas",
      "maxPerUser": 2,
      "saleStartDate": "2025-01-01T00:00:00Z",
      "saleEndDate": "2025-06-01T00:00:00Z"
    }
  ]
}
```

### Update an event

Updates the details of an existing event. Only the event organizer or an admin can update an event.

**Request:**

```http
PUT /events/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "Updated Tech Conference 2025",
  "capacity": 600
}
```

**Response:** `200 OK`

```json
{
  "id": "event_123",
  "title": "Updated Tech Conference 2025",
  "description": "Annual tech conference for developers",
  "startDate": "2025-06-15T09:00:00Z",
  "endDate": "2025-06-17T18:00:00Z",
  "capacity": 600,
  "category": "Technology",
  "location": "Convention Center, New York",
  "isVirtual": false,
  "status": "PUBLISHED",
  "organizerId": "user_123",
  "createdAt": "2025-03-05T10:30:00Z",
  "updatedAt": "2025-03-05T11:45:00Z"
}
```

### Delete an event

Permanently deletes an event. Only the event organizer or an admin can delete an event.

**Request:**

```http
DELETE /events/:id
Authorization: Bearer your_jwt_token
```

**Response:** `204 No Content`

## Ticket Types

### Create a ticket type

Creates a new ticket type for a specific event. Only the event organizer or an admin can create ticket types.

**Request:**

```http
POST /events/:id/ticket-types
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "name": "VIP Pass",
  "price": 299.99,
  "quantity": 50,
  "description": "VIP access to all conference areas",
  "maxPerUser": 2,
  "saleStartDate": "2025-01-01T00:00:00Z",
  "saleEndDate": "2025-06-01T00:00:00Z"
}
```

**Response:** `201 Created`

```json
{
  "id": "ticket_type_456",
  "name": "VIP Pass",
  "price": 299.99,
  "quantity": 50,
  "description": "VIP access to all conference areas",
  "maxPerUser": 2,
  "saleStartDate": "2025-01-01T00:00:00Z",
  "saleEndDate": "2025-06-01T00:00:00Z",
  "eventId": "event_123",
  "createdAt": "2025-03-05T12:00:00Z",
  "updatedAt": "2025-03-05T12:00:00Z"
}
```

### List ticket types for an event

Retrieves all ticket types available for a specific event.

**Request:**

```http
GET /events/:id/ticket-types
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
[
  {
    "id": "ticket_type_456",
    "name": "VIP Pass",
    "price": 299.99,
    "quantity": 50,
    "description": "VIP access to all conference areas",
    "maxPerUser": 2,
    "saleStartDate": "2025-01-01T00:00:00Z",
    "saleEndDate": "2025-06-01T00:00:00Z",
    "eventId": "event_123",
    "createdAt": "2025-03-05T12:00:00Z",
    "updatedAt": "2025-03-05T12:00:00Z"
  },
  {
    "id": "ticket_type_457",
    "name": "Standard Pass",
    "price": 99.99,
    "quantity": 200,
    "description": "Standard conference access",
    "maxPerUser": 5,
    "saleStartDate": "2025-01-01T00:00:00Z",
    "saleEndDate": "2025-06-01T00:00:00Z",
    "eventId": "event_123",
    "createdAt": "2025-03-05T12:05:00Z",
    "updatedAt": "2025-03-05T12:05:00Z"
  }
]
```

### Update a ticket type

Updates the details of a ticket type. Only the event organizer or an admin can update ticket types.

**Request:**

```http
PUT /events/:id/ticket-types/:typeId
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "price": 349.99,
  "quantity": 40
}
```

**Response:** `200 OK`

```json
{
  "id": "ticket_type_456",
  "name": "VIP Pass",
  "price": 349.99,
  "quantity": 40,
  "description": "VIP access to all conference areas",
  "maxPerUser": 2,
  "saleStartDate": "2025-01-01T00:00:00Z",
  "saleEndDate": "2025-06-01T00:00:00Z",
  "eventId": "event_123",
  "createdAt": "2025-03-05T12:00:00Z",
  "updatedAt": "2025-03-05T12:30:00Z"
}
```

### Delete a ticket type

Deletes a ticket type. Only possible if no tickets of this type have been sold.

**Request:**

```http
DELETE /events/:id/ticket-types/:typeId
Authorization: Bearer your_jwt_token
```

**Response:** `204 No Content`

## Tickets

### Purchase tickets

Initiates the ticket purchase process and creates a payment transaction with Paystack.

**Request:**

```http
POST /tickets/purchase
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "eventId": "event_123",
  "tickets": [
    {
      "ticketTypeId": "ticket_type_456",
      "quantity": 2
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "tickets": [
    {
      "id": "ticket_789",
      "userId": "user_123",
      "eventId": "event_123",
      "ticketTypeId": "ticket_type_456",
      "status": "PENDING",
      "paymentReference": "ref_123456",
      "purchaseDate": "2025-03-05T13:00:00Z",
      "createdAt": "2025-03-05T13:00:00Z",
      "updatedAt": "2025-03-05T13:00:00Z"
    },
    {
      "id": "ticket_790",
      "userId": "user_123",
      "eventId": "event_123",
      "ticketTypeId": "ticket_type_456",
      "status": "PENDING",
      "paymentReference": "ref_123456",
      "purchaseDate": "2025-03-05T13:00:00Z",
      "createdAt": "2025-03-05T13:00:00Z",
      "updatedAt": "2025-03-05T13:00:00Z"
    }
  ],
  "authorizationUrl": "https://checkout.paystack.com/ref_123456",
  "reference": "ref_123456"
}
```

### Verify ticket payment

Verifies a payment transaction and updates ticket status accordingly.

**Request:**

```http
GET /tickets/verify?reference=ref_123456
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "message": "Payment verified successfully"
}
```

### Get user tickets

Retrieves all tickets purchased by the authenticated user.

**Request:**

```http
GET /tickets/user
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
[
  {
    "id": "ticket_789",
    "status": "VALID",
    "purchaseDate": "2025-03-05T13:00:00Z",
    "paymentReference": "ref_123456",
    "event": {
      "title": "Tech Conference 2025",
      "startDate": "2025-06-15T09:00:00Z",
      "endDate": "2025-06-17T18:00:00Z",
      "location": "Convention Center, New York",
      "isVirtual": false
    },
    "ticketType": {
      "name": "VIP Pass",
      "price": 349.99
    }
  }
]
```

### Get ticket details

Retrieves detailed information about a specific ticket.

**Request:**

```http
GET /tickets/:id
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "id": "ticket_789",
  "status": "VALID",
  "purchaseDate": "2025-03-05T13:00:00Z",
  "paymentReference": "ref_123456",
  "event": {
    "title": "Tech Conference 2025",
    "startDate": "2025-06-15T09:00:00Z",
    "endDate": "2025-06-17T18:00:00Z",
    "location": "Convention Center, New York",
    "isVirtual": false,
    "organizer": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  },
  "ticketType": {
    "name": "VIP Pass",
    "price": 349.99,
    "description": "VIP access to all conference areas"
  },
  "user": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com"
  }
}
```

### Validate a ticket

Validates a ticket for entry to an event and records attendance.

**Request:**

```http
POST /tickets/:ticketId/validate
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Ticket validated successfully",
  "ticket": {
    "id": "ticket_789",
    "status": "USED",
    "purchaseDate": "2025-03-05T13:00:00Z",
    "paymentReference": "ref_123456",
    "event": {
      "title": "Tech Conference 2025",
      "startDate": "2025-06-15T09:00:00Z",
      "endDate": "2025-06-17T18:00:00Z"
    },
    "ticketType": {
      "name": "VIP Pass",
      "price": 349.99
    },
    "user": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    }
  }
}
```

## Messaging

### Send a message

Sends a message to all attendees of an event. The message is also broadcast in real-time via Socket.IO.

**Request:**

```http
POST /events/:id/messages
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "content": "Important announcement for all attendees!"
}
```

**Response:** `201 Created`

```json
{
  "id": "message_123",
  "content": "Important announcement for all attendees!",
  "senderId": "user_123",
  "eventId": "event_123",
  "createdAt": "2025-03-05T14:00:00Z",
  "updatedAt": "2025-03-05T14:00:00Z",
  "sender": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### List event messages

Retrieves all messages for a specific event.

**Request:**

```http
GET /events/:id/messages
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
[
  {
    "id": "message_123",
    "content": "Important announcement for all attendees!",
    "senderId": "user_123",
    "eventId": "event_123",
    "createdAt": "2025-03-05T14:00:00Z",
    "updatedAt": "2025-03-05T14:00:00Z",
    "sender": {
      "id": "user_123",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  {
    "id": "message_124",
    "content": "The keynote will start in 15 minutes.",
    "senderId": "user_456",
    "eventId": "event_123",
    "createdAt": "2025-03-05T14:15:00Z",
    "updatedAt": "2025-03-05T14:15:00Z",
    "sender": {
      "id": "user_456",
      "firstName": "Jane",
      "lastName": "Smith"
    }
  }
]
```

## Virtual Events

### Get virtual event link

Retrieves the virtual link for an online event.

**Request:**

```http
GET /events/:id/virtual-link
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "virtualLink": "https://zoom.us/j/1234567890"
}
```

### Record virtual attendance

Records that a user has attended a virtual event.

**Request:**

```http
POST /events/:id/virtual-attendance
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "id": "attendance_123",
  "eventId": "event_123",
  "userId": "user_123",
  "attended": true,
  "attendedAt": "2025-03-05T15:00:00Z",
  "createdAt": "2025-03-05T15:00:00Z",
  "updatedAt": "2025-03-05T15:00:00Z"
}
```

## Attendees

### List event attendees

Retrieves a list of all attendees for a specific event.

**Request:**

```http
GET /events/:id/attendees
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
[
  {
    "id": "attendance_123",
    "attended": true,
    "attendedAt": "2025-03-05T15:00:00Z",
    "user": {
      "id": "user_456",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    }
  },
  {
    "id": "attendance_124",
    "attended": false,
    "attendedAt": null,
    "user": {
      "id": "user_789",
      "firstName": "Bob",
      "lastName": "Johnson",
      "email": "bob.johnson@example.com"
    }
  }
]
```

### Invite attendees

Sends email invitations to potential attendees for an event.

**Request:**

```http
POST /events/:id/attendees/invite
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "emails": ["guest1@example.com", "guest2@example.com"],
  "message": "You are invited to my tech conference!"
}
```

**Response:** `200 OK`

```json
{
  "results": [
    {
      "email": "guest1@example.com",
      "status": "sent"
    },
    {
      "email": "guest2@example.com",
      "status": "sent"
    }
  ]
}
```

### Record manual attendance

Manually records attendance for a ticket holder who is physically present at an event.

**Request:**

```http
POST /events/:id/record-attendance
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "ticketId": "ticket_789"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Attendance recorded successfully",
  "data": {
    "ticket": {
      "id": "ticket_789",
      "status": "USED"
    },
    "attendee": {
      "id": "attendance_125",
      "attended": true,
      "attendedAt": "2025-03-05T16:00:00Z"
    },
    "user": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    }
  }
}
```

### Get attendee connections

Retrieves a list of people the authenticated user has met at events.

**Request:**

```http
GET /attendees/connections
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
[
  {
    "event": {
      "id": "event_123",
      "title": "Tech Conference 2025",
      "date": "2025-06-15T09:00:00Z"
    },
    "attendees": [
      {
        "id": "user_456",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com"
      },
      {
        "id": "user_789",
        "firstName": "Bob",
        "lastName": "Johnson",
        "email": "bob.johnson@example.com"
      }
    ]
  }
]
```

## Analytics

### Get event analytics

Retrieves analytics data for a specific event, including ticket sales and attendance information.

**Request:**

```http
GET /events/:id/analytics
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "ticketsSold": 45,
  "attendees": 30,
  "revenue": 8999.75,
  "attendanceRate": 66.67
}
```

### Get sales analytics

Retrieves sales analytics data across all events or for events organized by the authenticated user.

**Request:**

```http
GET /analytics/sales?startDate=2025-01-01&endDate=2025-07-01
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "sales": [
    {
      "date": "2025-01-15T00:00:00Z",
      "count": 5,
      "revenue": 1499.95
    },
    {
      "date": "2025-02-20T00:00:00Z",
      "count": 12,
      "revenue": 2499.88
    }
  ],
  "totalSales": 17,
  "totalRevenue": 3999.83
}
```

### Get attendance analytics

Retrieves attendance analytics data across all events or for events organized by the authenticated user.

**Request:**

```http
GET /analytics/attendance
Authorization: Bearer your_jwt_token
```

**Response:** `200 OK`

```json
{
  "events": [
    {
      "eventId": "event_123",
      "title": "Tech Conference 2025",
      "date": "2025-06-15T09:00:00Z",
      "ticketsSold": 45,
      "actualAttendees": 30,
      "attendanceRate": 66.67
    },
    {
      "eventId": "event_124",
      "title": "Product Launch",
      "date": "2025-04-10T10:00:00Z",
      "ticketsSold": 100,
      "actualAttendees": 92,
      "attendanceRate": 92
    }
  ],
  "summary": {
    "totalEvents": 2,
    "totalTicketsSold": 145,
    "totalAttendees": 122,
    "averageAttendanceRate": 79.33
  }
}
```

## Real-time Communication

Eventify API supports real-time communication using Socket.IO.

### Connection Authentication

Authentication is required to establish a Socket.IO connection:

```javascript
const socket = io("https://api.eventify.com", {
  auth: {
    token: "your_jwt_token",
  },
});
```

### Event Communication

Once connected, clients can:

#### Join an event room

```javascript
socket.emit("join-event", "event_123");
```

Response on successful join:

```javascript
socket.on("joined-event", (data) => {
  console.log(`Joined event: ${data.eventId}`);
});
```

#### Leave an event room

```javascript
socket.emit("leave-event", "event_123");
```

#### Send typing indicators

```javascript
socket.emit("typing", { eventId: "event_123", isTyping: true });
```

#### Receive messages and updates

```javascript
// Listen for new messages
socket.on("new-message", (message) => {
  console.log("New message:", message);
});

// Listen for typing updates
socket.on("typing-update", (data) => {
  console.log(
    `${data.firstName} ${data.lastName} is ${data.isTyping ? "typing..." : "stopped typing"}`,
  );
});

// Listen for errors
socket.on("error", (error) => {
  console.error("Socket error:", error.message);
});
```

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in case of failures.

Standard error response format:

```json
{
  "message": "Error message description"
}
```

Common HTTP status codes:

- `400`: Bad Request - The request contains invalid parameters
- `401`: Unauthorized - Authentication is required or has failed
- `403`: Forbidden - The authenticated user doesn't have permission
- `404`: Not Found - The requested resource doesn't exist
- `409`: Conflict - The request conflicts with the current state
- `500`: Internal Server Error - Something went wrong on the server

## Data Models

### User

```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "USER|ADMIN",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Event

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "startDate": "datetime",
  "endDate": "datetime",
  "location": "string|null",
  "isVirtual": "boolean",
  "virtualLink": "string|null",
  "capacity": "integer",
  "category": "string",
  "status": "DRAFT|PUBLISHED|CANCELLED|COMPLETED",
  "organizerId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Ticket Type

```json
{
  "id": "string",
  "name": "string",
  "price": "float",
  "quantity": "integer",
  "description": "string|null",
  "maxPerUser": "integer",
  "saleStartDate": "datetime",
  "saleEndDate": "datetime",
  "eventId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Ticket

```json
{
  "id": "string",
  "purchaseDate": "datetime",
  "status": "PENDING|VALID|USED|CANCELLED|EXPIRED",
  "paymentReference": "string|null",
  "userId": "string",
  "eventId": "string",
  "ticketTypeId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Message

```json
{
  "id": "string",
  "content": "string",
  "senderId": "string",
  "eventId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Rate Limits

API requests are limited to 100 requests per minute per user. If you exceed this limit, you'll receive a 429 Too Many Requests response.

## Webhook Events

Eventify can notify your application about events that happen in your account. Set up webhooks to receive notifications about:

- Ticket purchases
- Event creation/updates
- Attendee registrations

Contact support for webhook setup assistance.
