# Eventify API

Eventify API is a RESTful API for managing events, tickets, users, and more. This API allows you to create, update, delete, and retrieve information about events, users, tickets, messages, analytics, attendees, and virtual events.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- User authentication and authorization
- Event management (create, update, delete, retrieve)
- Ticket management (create, purchase, verify)
- Messaging system for events
- Analytics for events and sales
- Attendee management and invitations
- Virtual event support

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

Create a .env file in the root directory and add the following environment variables:

```env
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-sendgrid-from-email
SENDGRID_INVITE_TEMPLATE=your-sendgrid-invite-template-id
PAYSTACK_SECRET_KEY=your-paystack-secret-key
FRONTEND_URL=your-frontend-url
```

## Usage

Start the development server:

```sh
npm run dev
```

Run tests:

```sh
npm test
```

## API Endpoints

Refer to the [API Documentation](DOCUMENTATION.md) for detailed information on available endpoints, request parameters, and response formats.

## Database Schema

The database schema is defined using Prisma. Refer to the [schema.prisma](./prisma/schema.prisma) file for the complete schema definition.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
