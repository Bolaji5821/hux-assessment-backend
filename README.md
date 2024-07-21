# Contact Management System Backend

This is the backend repository for the Contact Management System, a RESTful API that allows users to save and manage contact information. This project was created as part of the Hux Ventures Fullstack Developer Assessment.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Authentication](#authentication)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)


## Features

- User authentication (Signup/Login)
- CRUD operations for contacts
- Data validation
- Secure API with JWT authentication
- MongoDB integration

## Technologies Used

- Node.js
- Express.js 4.19.2
- MongoDB 6.8.0
- Mongoose 8.5.1
- JSON Web Token (JWT) 9.0.2
- bcryptjs 2.4.3
- express-validator 7.1.0
- Jest 29.7.0 (for testing)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (v4 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/hux-assessment-backend.git
   cd hux-assessment-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=5000
   MONGODB_URI=<MONGO STRING HERE>
   JWT_SECRET=your_jwt_secret
   ```
   Replace the values with your specific configuration.

## Running the Application

To start the server:

```
npm start
```

The API will be available at `http://localhost:5000`.

## API Endpoints

- POST `/api/users/signup` - Create a new user
- POST `/api/users/login` - User login
- POST `/api/users/logout` - User logout
- GET `/api/contacts` - Get all contacts for the logged-in user
- GET `/api/contacts/:id` - Get a single contact
- POST `/api/contacts` - Create a new contact
- PUT `/api/contacts/:id` - Update a contact
- DELETE `/api/contacts/:id` - Delete a contact

For detailed API documentation, refer to the Swagger documentation (if implemented).

## Database

This project uses MongoDB as the database. Make sure you have MongoDB installed and running on your machine, or provide a connection string to a MongoDB Atlas cluster.

## Authentication

Authentication is implemented using JSON Web Tokens (JWT). Protected routes require a valid JWT to be included in the Authorization header of the request.

## Testing

To run the tests:

```
npm test
```

This project uses Jest and Supertest for unit and integration testing.

## Environment Variables

- `PORT`: The port number on which the server will run
- `MONGODB_URI`: The connection string for your MongoDB database
- `JWT_SECRET`: A secret key used for signing JWTs

## Deployment

1. Ensure all environment variables are properly set

2. Start the server:
   ```
   npm start
   ```

