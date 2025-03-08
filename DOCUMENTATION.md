# Eventify API Reference

This reference documentation provides details about the Eventify API, which allows you to programmatically manage events, tickets, users, messages, and more.

## Authentication

The Eventify API uses token-based authentication. You need to include a Bearer token in the Authorization header for all authenticated requests.

```
Authorization: Bearer your_jwt_token
```

Tokens are obtained through the login or register endpoints and are valid for 1 hour.

## Error Handling

The API returns standard HTTP status codes to indicate success or failure:

| Code | Description                            |
| ---- | -------------------------------------- |
| 200  | Request succeeded                      |
| 201  | Resource created                       |
| 400  | Bad request - invalid parameters       |
| 401  | Unauthorized - authentication required |
| 403  | Forbidden - insufficient permissions   |
| 404  | Resource not found                     |
| 409  | Conflict with existing resource        |
| 500  | Server error                           |

Error responses include a message explaining what went wrong:

```json
{
  "message": "Error description"
}
```

## Authentication

### Register

> Creates a new user account

```
POST /auth/register
```

**Parameters**

| Field       | Type   | Description                                 |
| ----------- | ------ | ------------------------------------------- |
| `email`     | string | _Required_. User's email address            |
| `password`  | string | _Required_. Password (minimum 6 characters) |
| `firstName` | string | _Required_. User's first name               |
| `lastName`  | string | _Required_. User's last name                |

**Example Request**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Example Response**

```json
{
  "id": "user_1234",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJ..."
}
```

### Login

> Authenticates a user and returns a token

```
POST /auth/login
```

**Parameters**

| Field      | Type   | Description                      |
| ---------- | ------ | -------------------------------- |
| `email`    | string | _Required_. User's email address |
| `password` | string | _Required_. User's password      |

**Example Request**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Response**

```json
{
  "id": "user_1234",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJ..."
}
```

## Users

### Get User Profile

> Retrieves the authenticated user's profile

```
GET /users/profile
```

**Authorization**: Bearer token required

**Example Response**

```json
{
  "id": "user_1234",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Update User Profile

> Updates the authenticated user's profile

```
PUT /users/profile
```

**Authorization**: Bearer token required

**Parameters**

| Field       | Type   | Description                   |
| ----------- | ------ | ----------------------------- |
| `firstName` | string | _Optional_. User's first name |
| `lastName`  | string | _Optional_. User's last name  |

**Example Request**

```json
{
  "firstName": "Johnny",
  "lastName": "Doe"
}
```

**Example Response**

```json
{
  "id": "user_1234",
  "email": "user@example.com",
  "firstName": "Johnny",
  "lastName": "Doe"
}
```

## Events

### Create Event

> Creates a new event

```
POST /events
```

**Authorization**: Bearer token required

**Parameters**

| Field         | Type    | Description                                                |
| ------------- | ------- | ---------------------------------------------------------- |
| `title`       | string  | _Required_. Event title                                    |
| `description` | string  | _Required_. Event description                              |
| `startDate`   | string  | _Required_. Event start date (ISO 8601)                    |
| `endDate`     | string  | _Required_. Event end date (ISO 8601)                      |
| `eventType`   | string  | _Required_. Event type: 'PHYSICAL', 'VIRTUAL', or 'HYBRID' |
| `capacity`    | integer | _Required_. Maximum capacity                               |
| `category`    | string  | _Required_. Event category                                 |
| `location`    | string  | _Required for PHYSICAL/HYBRID_. Event location             |
| `virtualLink` | string  | _Required for VIRTUAL/HYBRID_. Link to virtual event       |

**Example Request**

```json
{
  "title": "Tech Conference 2025",
  "description": "Annual tech conference featuring the latest innovations",
  "startDate": "2025-05-15T09:00:00Z",
  "endDate": "2025-05-17T18:00:00Z",
  "eventType": "HYBRID",
  "capacity": 500,
  "category": "Technology",
  "location": "Convention Center, City",
  "virtualLink": "https://example.com/virtual-conference"
}
```

**Example Response**

```json
{
  "id": "evt_1234",
  "title": "Tech Conference 2025",
  "description": "Annual tech conference featuring the latest innovations",
  "startDate": "2025-05-15T09:00:00Z",
  "endDate": "2025-05-17T18:00:00Z",
  "eventType": "HYBRID",
  "capacity": 500,
  "category": "Technology",
  "location": "Convention Center, City",
  "virtualLink": "https://example.com/virtual-conference",
  "status": "DRAFT",
  "createdAt": "2025-03-09T10:30:00Z",
  "updatedAt": "2025-03-09T10:30:00Z",
  "organizerId": "user_1234"
}
```

### Get Events

> Retrieves a list of all published events

```
GET /events
```

**Authorization**: Bearer token required

**Example Response**

```json
[
  {
    "id": "evt_1234",
    "title": "Tech Conference 2025",
    "description": "Annual tech conference featuring the latest innovations",
    "startDate": "2025-05-15T09:00:00Z",
    "endDate": "2025-05-17T18:00:00Z",
    "eventType": "HYBRID",
    "capacity": 500,
    "category": "Technology",
    "location": "Convention Center, City",
    "virtualLink": "https://example.com/virtual-conference",
    "status": "PUBLISHED",
    "createdAt": "2025-03-09T10:30:00Z",
    "updatedAt": "2025-03-09T10:30:00Z",
    "organizer": {
      "id": "user_1234",
      "firstName": "John",
      "lastName": "Doe"
    },
    "ticketTypes": [
      {
        "id": "tkt_1234",
        "name": "General Admission",
        "price": 150.0,
        "quantity": 400,
        "description": "Standard entry ticket"
      }
    ]
  }
]
```

### Get User's Events

> Retrieves events organized by the authenticated user

```
GET /events/my-events
```

**Authorization**: Bearer token required

**Example Response**

```json
[
  {
    "id": "evt_1234",
    "title": "Tech Conference 2025",
    "description": "Annual tech conference featuring the latest innovations",
    "startDate": "2025-05-15T09:00:00Z",
    "endDate": "2025-05-17T18:00:00Z",
    "eventType": "HYBRID",
    "capacity": 500,
    "category": "Technology",
    "location": "Convention Center, City",
    "virtualLink": "https://example.com/virtual-conference",
    "status": "PUBLISHED",
    "createdAt": "2025-03-09T10:30:00Z",
    "updatedAt": "2025-03-09T10:30:00Z",
    "organizer": {
      "id": "user_1234",
      "firstName": "John",
      "lastName": "Doe"
    },
    "_count": {
      "tickets": 150,
      "TicketAssignee": 75
    },
    "ticketTypes": [
      {
        "id": "tkt_1234",
        "name": "General Admission",
        "price": 150.0,
        "quantity": 400,
        "description": "Standard entry ticket"
      }
    ]
  }
]
```

### Get Event

> Retrieves details of a specific event

```
GET /events/:id
```

**Authorization**: Bearer token required

**Example Response**

```json
{
  "id": "evt_1234",
  "title": "Tech Conference 2025",
  "description": "Annual tech conference featuring the latest innovations",
  "startDate": "2025-05-15T09:00:00Z",
  "endDate": "2025-05-17T18:00:00Z",
  "eventType": "HYBRID",
  "capacity": 500,
  "category": "Technology",
  "location": "Convention Center, City",
  "virtualLink": "https://example.com/virtual-conference",
  "status": "PUBLISHED",
  "createdAt": "2025-03-09T10:30:00Z",
  "updatedAt": "2025-03-09T10:30:00Z",
  "organizer": {
    "id": "user_1234",
    "firstName": "John",
    "lastName": "Doe"
  },
  "ticketTypes": [
    {
      "id": "tkt_1234",
      "name": "General Admission",
      "price": 150.0,
      "quantity": 400,
      "description": "Standard entry ticket"
    }
  ]
}
```

### Update Event

> Updates an existing event

```
PUT /events/:id
```

**Authorization**: Bearer token required (event organizer only)

**Parameters**

| Field         | Type    | Description                                                              |
| ------------- | ------- | ------------------------------------------------------------------------ |
| `title`       | string  | _Optional_. Event title                                                  |
| `description` | string  | _Optional_. Event description                                            |
| `startDate`   | string  | _Optional_. Event start date (ISO 8601)                                  |
| `endDate`     | string  | _Optional_. Event end date (ISO 8601)                                    |
| `eventType`   | string  | _Optional_. Event type: 'PHYSICAL', 'VIRTUAL', or 'HYBRID'               |
| `capacity`    | integer | _Optional_. Maximum capacity                                             |
| `category`    | string  | _Optional_. Event category                                               |
| `location`    | string  | _Optional_. Event location (required for PHYSICAL/HYBRID)                |
| `virtualLink` | string  | _Optional_. Link to virtual event (required for VIRTUAL/HYBRID)          |
| `status`      | string  | _Optional_. Event status: 'DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED' |

**Example Request**

```json
{
  "title": "Tech Conference 2025 - Updated",
  "capacity": 600
}
```

**Example Response**

```json
{
  "id": "evt_1234",
  "title": "Tech Conference 2025 - Updated",
  "description": "Annual tech conference featuring the latest innovations",
  "startDate": "2025-05-15T09:00:00Z",
  "endDate": "2025-05-17T18:00:00Z",
  "eventType": "HYBRID",
  "capacity": 600,
  "category": "Technology",
  "location": "Convention Center, City",
  "virtualLink": "https://example.com/virtual-conference",
  "status": "PUBLISHED",
  "createdAt": "2025-03-09T10:30:00Z",
  "updatedAt": "2025-03-09T15:45:00Z",
  "organizerId": "user_1234"
}
```

### Delete Event

> Deletes an event

```
DELETE /events/:id
```

**Authorization**: Bearer token required (event organizer only)

**Response**: HTTP 204 (No Content)

## Ticket Types

### Create Ticket Type

> Creates a new ticket type for an event

```
POST /events/:id/ticket-types
```

**Authorization**: Bearer token required (event organizer only)

**Parameters**

| Field           | Type    | Description                                        |
| --------------- | ------- | -------------------------------------------------- |
| `name`          | string  | _Required_. Ticket type name                       |
| `price`         | number  | _Required_. Ticket price                           |
| `quantity`      | integer | _Required_. Number of tickets available            |
| `description`   | string  | _Optional_. Ticket description                     |
| `maxPerUser`    | integer | _Optional_. Maximum tickets per user (default: 10) |
| `saleStartDate` | string  | _Required_. Sale start date (ISO 8601)             |
| `saleEndDate`   | string  | _Required_. Sale end date (ISO 8601)               |

**Example Request**

```json
{
  "name": "VIP Pass",
  "price": 300.0,
  "quantity": 50,
  "description": "VIP access including exclusive sessions",
  "maxPerUser": 2,
  "saleStartDate": "2025-04-01T00:00:00Z",
  "saleEndDate": "2025-05-14T23:59:59Z"
}
```

**Example Response**

```json
{
  "id": "tt_1234",
  "name": "VIP Pass",
  "price": 300.0,
  "quantity": 50,
  "description": "VIP access including exclusive sessions",
  "maxPerUser": 2,
  "saleStartDate": "2025-04-01T00:00:00Z",
  "saleEndDate": "2025-05-14T23:59:59Z",
  "createdAt": "2025-03-09T16:20:00Z",
  "updatedAt": "2025-03-09T16:20:00Z",
  "eventId": "evt_1234"
}
```

### Get Ticket Types

> Retrieves all ticket types for an event

```
GET /events/:id/ticket-types
```

**Example Response**

```json
[
  {
    "id": "tt_1234",
    "name": "VIP Pass",
    "price": 300.0,
    "quantity": 50,
    "description": "VIP access including exclusive sessions",
    "maxPerUser": 2,
    "saleStartDate": "2025-04-01T00:00:00Z",
    "saleEndDate": "2025-05-14T23:59:59Z",
    "createdAt": "2025-03-09T16:20:00Z",
    "updatedAt": "2025-03-09T16:20:00Z",
    "eventId": "evt_1234"
  },
  {
    "id": "tt_5678",
    "name": "General Admission",
    "price": 150.0,
    "quantity": 400,
    "description": "Standard entry ticket",
    "maxPerUser": 10,
    "saleStartDate": "2025-03-15T00:00:00Z",
    "saleEndDate": "2025-05-14T23:59:59Z",
    "createdAt": "2025-03-09T16:20:00Z",
    "updatedAt": "2025-03-09T16:20:00Z",
    "eventId": "evt_1234"
  }
]
```

### Update Ticket Type

> Updates an existing ticket type

```
PUT /events/:id/ticket-types/:typeId
```

**Authorization**: Bearer token required (event organizer only)

**Parameters**

| Field           | Type    | Description                             |
| --------------- | ------- | --------------------------------------- |
| `name`          | string  | _Optional_. Ticket type name            |
| `price`         | number  | _Optional_. Ticket price                |
| `quantity`      | integer | _Optional_. Number of tickets available |
| `description`   | string  | _Optional_. Ticket description          |
| `maxPerUser`    | integer | _Optional_. Maximum tickets per user    |
| `saleStartDate` | string  | _Optional_. Sale start date (ISO 8601)  |
| `saleEndDate`   | string  | _Optional_. Sale end date (ISO 8601)    |

**Example Request**

```json
{
  "price": 250.0,
  "quantity": 75
}
```

**Example Response**

```json
{
  "id": "tt_1234",
  "name": "VIP Pass",
  "price": 250.0,
  "quantity": 75,
  "description": "VIP access including exclusive sessions",
  "maxPerUser": 2,
  "saleStartDate": "2025-04-01T00:00:00Z",
  "saleEndDate": "2025-05-14T23:59:59Z",
  "createdAt": "2025-03-09T16:20:00Z",
  "updatedAt": "2025-03-09T16:45:00Z",
  "eventId": "evt_1234"
}
```

### Delete Ticket Type

> Deletes a ticket type (only if no tickets sold)

```
DELETE /events/:id/ticket-types/:typeId
```

**Authorization**: Bearer token required (event organizer only)

**Response**: HTTP 204 (No Content)

## Tickets

### Purchase Ticket

> Initiates the purchase of tickets

```
POST /tickets/purchase
```

**Authorization**: Bearer token required

**Parameters**

| Field                    | Type    | Description                           |
| ------------------------ | ------- | ------------------------------------- |
| `eventId`                | string  | _Required_. ID of the event           |
| `tickets`                | array   | _Required_. Array of ticket purchases |
| `tickets[].ticketTypeId` | string  | _Required_. ID of the ticket type     |
| `tickets[].quantity`     | integer | _Required_. Quantity to purchase      |

**Example Request**

```json
{
  "eventId": "evt_1234",
  "tickets": [
    {
      "ticketTypeId": "tt_1234",
      "quantity": 2
    },
    {
      "ticketTypeId": "tt_5678",
      "quantity": 1
    }
  ]
}
```

**Example Response**

```json
{
  "tickets": [
    {
      "id": "tck_1234",
      "status": "PENDING",
      "eventId": "evt_1234",
      "ticketTypeId": "tt_1234",
      "purchaserId": "user_1234",
      "paymentReference": "ref_12345"
    },
    {
      "id": "tck_1235",
      "status": "PENDING",
      "eventId": "evt_1234",
      "ticketTypeId": "tt_1234",
      "purchaserId": "user_1234",
      "paymentReference": "ref_12345"
    },
    {
      "id": "tck_1236",
      "status": "PENDING",
      "eventId": "evt_1234",
      "ticketTypeId": "tt_5678",
      "purchaserId": "user_1234",
      "paymentReference": "ref_12345"
    }
  ],
  "authorizationUrl": "https://checkout.paystack.com/ref_12345",
  "reference": "ref_12345"
}
```

### Verify Payment

> Verifies a payment and activates tickets

```
GET /tickets/verify?reference=ref_12345
```

**Authorization**: Bearer token required

**Query Parameters**

| Field       | Type   | Description                                 |
| ----------- | ------ | ------------------------------------------- |
| `reference` | string | _Required_. Payment reference from Paystack |

**Example Response**

```json
{
  "message": "Payment verified successfully"
}
```

### Get User Tickets

> Retrieves all tickets purchased by the authenticated user

```
GET /tickets/user
```

**Authorization**: Bearer token required

**Example Response**

```json
[
  {
    "id": "tck_1234",
    "purchaseDate": "2025-03-09T17:30:00Z",
    "status": "VALID",
    "event": {
      "title": "Tech Conference 2025",
      "startDate": "2025-05-15T09:00:00Z",
      "endDate": "2025-05-17T18:00:00Z",
      "location": "Convention Center, City",
      "eventType": "HYBRID",
      "virtualLink": "https://example.com/virtual-conference"
    },
    "ticketType": {
      "name": "VIP Pass",
      "price": 250.0
    },
    "assignee": {
      "id": "asn_1234",
      "email": "attendee@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "attendedAt": null
    }
  }
]
```

### Get Ticket Details

> Retrieves details of a specific ticket

```
GET /tickets/:id
```

**Authorization**: Bearer token required (ticket purchaser only)

**Example Response**

```json
{
  "id": "tck_1234",
  "purchaseDate": "2025-03-09T17:30:00Z",
  "status": "VALID",
  "paymentReference": "ref_12345",
  "event": {
    "id": "evt_1234",
    "title": "Tech Conference 2025",
    "startDate": "2025-05-15T09:00:00Z",
    "endDate": "2025-05-17T18:00:00Z",
    "location": "Convention Center, City",
    "organizer": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  },
  "ticketType": {
    "name": "VIP Pass",
    "price": 250.0
  },
  "user": {
    "firstName": "User",
    "lastName": "Example",
    "email": "user@example.com"
  },
  "assignee": {
    "id": "asn_1234",
    "email": "attendee@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "attendedAt": null,
    "user": null
  }
}
```

### Assign Ticket

> Assigns a ticket to a user or email

```
POST /tickets/:ticketId/assign
```

**Authorization**: Bearer token required (ticket purchaser only)

**Parameters**

| Field       | Type   | Description                                           |
| ----------- | ------ | ----------------------------------------------------- |
| `email`     | string | _Optional_. Email for non-registered attendee         |
| `firstName` | string | _Optional_. First name (required with email)          |
| `lastName`  | string | _Optional_. Last name (required with email)           |
| `userId`    | string | _Optional_. ID of registered user to assign ticket to |

**Example Request**

```json
{
  "email": "attendee@example.com",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Example Response**

```json
{
  "id": "asn_1234",
  "email": "attendee@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "attendedAt": null,
  "ticketId": "tck_1234",
  "userId": null,
  "eventId": "evt_1234",
  "createdAt": "2025-03-09T18:15:00Z",
  "updatedAt": "2025-03-09T18:15:00Z"
}
```

### Remove Ticket Assignment

> Removes a ticket assignment

```
DELETE /tickets/:ticketId/assign
```

**Authorization**: Bearer token required (ticket purchaser only)

**Response**: HTTP 204 (No Content)

## Messages

### Send Message

> Sends a message in an event

```
POST /events/:id/messages
```

**Authorization**: Bearer token required (event access required)

**Parameters**

| Field     | Type   | Description                                       |
| --------- | ------ | ------------------------------------------------- |
| `content` | string | _Required_. Message content (max 1000 characters) |

**Example Request**

```json
{
  "content": "Is there a schedule for the workshop sessions?"
}
```

**Example Response**

```json
{
  "id": "msg_1234",
  "content": "Is there a schedule for the workshop sessions?",
  "createdAt": "2025-03-09T19:20:00Z",
  "updatedAt": "2025-03-09T19:20:00Z",
  "senderId": "user_1234",
  "eventId": "evt_1234",
  "sender": {
    "id": "user_1234",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Get Event Messages

> Retrieves all messages for an event

```
GET /events/:id/messages
```

**Authorization**: Bearer token required (event access required)

**Example Response**

```json
[
  {
    "id": "msg_1234",
    "content": "Is there a schedule for the workshop sessions?",
    "createdAt": "2025-03-09T19:20:00Z",
    "updatedAt": "2025-03-09T19:20:00Z",
    "senderId": "user_1234",
    "eventId": "evt_1234",
    "sender": {
      "id": "user_1234",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  {
    "id": "msg_1235",
    "content": "Workshop schedules will be posted tomorrow.",
    "createdAt": "2025-03-09T19:25:00Z",
    "updatedAt": "2025-03-09T19:25:00Z",
    "senderId": "user_5678",
    "eventId": "evt_1234",
    "sender": {
      "id": "user_5678",
      "firstName": "Jane",
      "lastName": "Smith"
    }
  }
]
```

## Attendees

### Get Event Attendees

> Retrieves all attendees for an event

```
GET /events/:id/attendees
```

**Authorization**: Bearer token required (event organizer only)

**Example Response**

```json
[
  {
    "id": "asn_1234",
    "email": "attendee@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "attendedAt": "2025-05-15T10:30:00Z",
    "ticketId": "tck_1234",
    "userId": "user_5678",
    "eventId": "evt_1234",
    "ticket": {
      "ticketType": {
        "name": "VIP Pass"
      }
    },
    "user": {
      "id": "user_5678",
      "email": "attendee@example.com",
      "firstName": "Jane",
      "lastName": "Smith"
    }
  }
]
```

### Check In Attendee

> Checks in an attendee to an event

```
POST /events/:id/attendees/:assigneeId/check-in
```

**Authorization**: Bearer token required (event organizer only)

**Example Response**

```json
{
  "id": "asn_1234",
  "email": "attendee@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "attendedAt": "2025-05-15T10:30:00Z",
  "ticketId": "tck_1234",
  "userId": "user_5678",
  "eventId": "evt_1234",
  "user": {
    "id": "user_5678",
    "email": "attendee@example.com",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

### Invite Attendees

> Sends invitations to potential attendees

```
POST /events/:id/attendees/invite
```

**Authorization**: Bearer token required (event organizer only)

**Parameters**

| Field     | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| `emails`  | array  | _Required_. Array of email addresses                |
| `message` | string | _Optional_. Custom message to include in invitation |

**Example Request**

```json
{
  "emails": ["invitee@example.com", "another@example.com"],
  "message": "We'd love to have you join our tech conference!"
}
```

**Example Response**

```json
{
  "results": [
    {
      "email": "invitee@example.com",
      "status": "sent"
    },
    {
      "email": "another@example.com",
      "status": "sent"
    }
  ]
}
```

## Analytics

### Get Event Analytics

> Retrieves analytics for a specific event

```
GET /events/:id/analytics
```

**Authorization**: Bearer token required (event organizer only)

**Example Response**

```json
{
  "ticketsSold": 150,
  "attendees": 75,
  "revenue": 28500,
  "attendanceRate": 50
}
```

### Get Sales Analytics

> Retrieves sales analytics for the organizer's events

```
GET /analytics/sales
```

**Authorization**: Bearer token required

**Query Parameters**

| Field       | Type   | Description                                                    |
| ----------- | ------ | -------------------------------------------------------------- |
| `startDate` | string | _Optional_. Start date for analytics (defaults to 30 days ago) |
| `endDate`   | string | _Optional_. End date for analytics (defaults to current date)  |

**Example Response**

```json
{
  "sales": [
    {
      "date": "2025-03-01T00:00:00Z",
      "count": 15,
      "revenue": 2250
    },
    {
      "date": "2025-03-02T00:00:00Z",
      "count": 22,
      "revenue": 3650
    }
  ],
  "totalSales": 150,
  "totalRevenue": 28500
}
```

### Get Attendance Analytics

> Retrieves attendance analytics for the organizer's events

```
GET /analytics/attendance
```

**Authorization**: Bearer token required

**Query Parameters**

| Field       | Type   | Description                                                    |
| ----------- | ------ | -------------------------------------------------------------- |
| `startDate` | string | _Optional_. Start date for analytics (defaults to 30 days ago) |
| `endDate`   | string | _Optional_. End date for analytics (defaults to current date)  |

**Example Response**

I'll continue the Attendance Analytics API documentation where it was cut off:

```json
{
  "events": [
    {
      "eventId": "evt_1234",
      "title": "Tech Conference 2025",
      "date": "2025-05-15T09:00:00Z",
      "ticketsSold": 150,
      "actualAttendees": 75,
      "attendanceRate": 50
    },
    {
      "eventId": "evt_5678",
      "title": "Music Festival 2025",
      "date": "2025-07-20T16:00:00Z",
      "ticketsSold": 800,
      "actualAttendees": 720,
      "attendanceRate": 90
    }
  ],
  "summary": {
    "totalEvents": 2,
    "totalTicketsSold": 950,
    "totalAttendees": 795,
    "averageAttendanceRate": 70
  }
}
```

## Real-time Communication

Eventify supports real-time communication via WebSockets for event chat and user interactions.

### Authentication

To authenticate with the socket server, include your JWT token when establishing the connection:

```javascript
const socket = io("YOUR_BACKEND_URL", {
  auth: {
    token: "your_jwt_token",
  },
});
```

### Event Rooms

#### Join Event Room

> Joins an event's real-time communication room

```
socket.emit("join-event", eventId)
```

**Example Response**

```javascript
socket.on("joined-event", (data) => {
  console.log(`Joined event ${data.eventId}`);
});
```

#### Leave Event Room

> Leaves an event's real-time communication room

```
socket.emit("leave-event", eventId)
```

### Messaging

#### New Message Notification

> Listens for new messages in an event

```
socket.on("new-message", callback)
```

**Example Response**

```javascript
socket.on("new-message", (message) => {
  console.log(
    `New message from ${message.sender.firstName}: ${message.content}`,
  );
});
```

### Typing Indicators

#### Send Typing Status

> Notifies other users when you are typing

```
socket.emit("typing", { eventId, isTyping })
```

**Parameters**

| Field      | Type    | Description                                    |
| ---------- | ------- | ---------------------------------------------- |
| `eventId`  | string  | _Required_. ID of the event                    |
| `isTyping` | boolean | _Required_. True if user is typing, else false |

#### Receive Typing Status

> Receives notifications when other users are typing

```
socket.on("typing-update", callback)
```

**Example Response**

```javascript
socket.on("typing-update", (data) => {
  console.log(
    `${data.firstName} ${data.lastName} is ${data.isTyping ? "typing..." : "not typing"}`,
  );
});
```

### Error Handling

> Listens for socket error events

```
socket.on("error", callback)
```

**Example Response**

```javascript
socket.on("error", (error) => {
  console.error(`Socket error: ${error.message}`);
});
```
