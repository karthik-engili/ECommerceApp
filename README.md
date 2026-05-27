# ECommerce App

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features

- Product catalog with search and category filtering
- Shopping cart with quantity management and localStorage persistence
- User authentication with JWT (register, login, logout)
- Role-based access control (admin and user roles)
- Checkout with shipping address and cash on delivery
- Order history for customers
- Admin panel to manage products and update order statuses

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcryptjs |

## Project Structure

```
ECommerceApp/
├── backend/
│   └── src/
│       ├── config/         Database connection
│       ├── controllers/    Route handlers
│       ├── middleware/      Auth and error middleware
│       ├── models/         Mongoose schemas
│       ├── routes/         API route definitions
│       ├── utils/          Token generation and seeder
│       └── server.js       Express entry point
├── frontend/
│   └── src/
│       ├── components/     Navbar, ProductCard, ProtectedRoute
│       ├── context/        Global state (auth, cart)
│       ├── pages/          All page components
│       ├── api.js          Axios instance
│       ├── App.jsx         Router setup
│       └── main.jsx        React entry point
└── package.json            Root scripts
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB running locally or a MongoDB Atlas cluster

### Installation

```bash
npm install
npm run install-all
```

### Running in Development

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

You can also run them individually:

```bash
npm run server    # backend only
npm run client    # frontend only
```

### Seeding the Database

```bash
npm run seed
```

This creates sample users and products in the database.

### Default Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@example.com | admin123 |
| User | user@example.com | user123 |

## Environment Variables

This project requires environment variables to run. See the `.env.example` files in the `backend` and `frontend` directories for the required variables.

## Deployment

- Frontend is deployed on Vercel: https://e-commerce-app-seven-mocha-89.vercel.app
- Backend is deployed on Render: https://ecommerce-backend-iicb.onrender.com
- Database is hosted on MongoDB Atlas
