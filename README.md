# Eventify API

Eventify API is a comprehensive RESTful API for event management platforms. It enables seamless creation, management, and attendance tracking for both physical and virtual events, with features like ticket sales, messaging, real-time communication, and analytics.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [API Documentation](#api-documentation)
8. [Project Structure](#project-structure)
9. [Real-time Communication](#real-time-communication)
10. [Database Schema](#database-schema)
11. [Contributing](#contributing)
12. [License](#license)

## Overview

Eventify API provides a scalable backend solution for event management platforms. It handles everything from user registration and authentication to event creation, ticket sales, attendee management, and analytics. The API supports various event types (physical, virtual, or hybrid) and includes real-time messaging features.

## Features

- **User Management**

  - Registration and authentication
  - Profile management
  - JWT-based authorization
  - Personalized dashboard with event statistics

- **Event Management**

  - Create, update, read, and delete events
  - Support for physical, virtual, and hybrid events
  - Event status tracking (draft, published, cancelled, completed)

- **Ticket Management**

  - Multiple ticket types per event
  - Customizable pricing and availability
  - Secure payment processing via Paystack
  - Ticket assignment and transfer

- **Attendee Management**

  - Attendee check-in
  - Email invitations
  - Attendee tracking

- **Messaging System**

  - Event-specific communication
  - Real-time updates with WebSockets
  - Typing indicators

- **Analytics**

  - Event performance metrics
  - Sales analytics
  - Attendance tracking

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- SendGrid account (for email services)
- Paystack account (for payment processing)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/LazyEllis/eventify-api.git
   cd eventify-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up the database:

   ```sh
   npx prisma migrate deploy
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database configuration
DATABASE_URL=postgresql://username:password@localhost:5432/eventify
TEST_DATABASE_URL=postgresql://username:password@localhost:5432/eventify_test

# Authentication
JWT_SECRET=your_secure_jwt_secret_key

# Email services
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_INVITE_TEMPLATE=your_template_id

# Payment processing
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Application
PORT=3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Usage

Start the development server with hot-reload:

```sh
npm run dev
```

Start the production server:

```sh
npm start
```

Run tests:

```sh
npm test
```

Lint the code:

```sh
npm run lint
```

Format the code:

```sh
npm run format
```

## API Documentation

Comprehensive API documentation is available in the [DOCUMENTATION.md](DOCUMENTATION.md) file, which includes:

- Authentication details
- Endpoint descriptions
- Dashboard analytics and statistics
- Request/response formats
- Error handling
- Examples for all operations

## Project Structure

```
eventify-api/
├── src/
│   ├── app.js                # Application entry point
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middleware
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   └── utils/                # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── .env                      # Environment variables
└── package.json              # Project dependencies
```

## Real-time Communication

Eventify API implements WebSocket communication using Socket.IO for real-time features:

- Live event chat
- Typing indicators
- Instant notifications

Clients can connect to the WebSocket server and authenticate using their JWT token:

```javascript
const socket = io("YOUR_BACKEND_URL", {
  auth: {
    token: "your_jwt_token",
  },
});

// Join an event room
socket.emit("join-event", "event_id");

// Listen for new messages
socket.on("new-message", (message) => {
  console.log(`New message: ${message.content}`);
});
```

## Database Schema

The database schema is defined using Prisma ORM. Key models include:

- User
- Event
- TicketType
- Ticket
- TicketAssignee
- Message
- EventInvitation

See the [schema.prisma](./prisma/schema.prisma) file for complete details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and passes all tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
