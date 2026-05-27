# Backend

The backend is a REST API built with Node.js and Express. It handles authentication, product management, and order processing. Data is stored in MongoDB using Mongoose.

## Architecture

```
src/
├── config/
│   └── db.js                 MongoDB connection using Mongoose
├── controllers/
│   ├── authController.js     Register, login, and profile handlers
│   ├── productController.js  CRUD operations for products
│   └── orderController.js    Order creation, retrieval, and status updates
├── middleware/
│   ├── authMiddleware.js     JWT verification and role-based access
│   └── errorMiddleware.js    404 handler and global error handler
├── models/
│   ├── User.js               User schema with password hashing
│   ├── Product.js            Product schema with stock tracking
│   └── Order.js              Order schema with embedded items and shipping
├── routes/
│   ├── authRoutes.js         POST /register, POST /login, GET /profile
│   ├── productRoutes.js      GET, POST, PUT, DELETE /products
│   └── orderRoutes.js        POST, GET /orders, PATCH /orders/:id/status
├── utils/
│   ├── generateToken.js      JWT token creation utility
│   └── seed.js               Database seeder with sample data
└── server.js                 Express app entry point
```

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | /api/auth/register | Public | Create a new user account |
| POST | /api/auth/login | Public | Authenticate and receive JWT |
| GET | /api/auth/profile | Protected | Get current user profile |

### Products

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | /api/products | Public | List all products (supports search and category query params) |
| GET | /api/products/:id | Public | Get a single product by ID |
| POST | /api/products | Admin | Create a new product |
| PUT | /api/products/:id | Admin | Update a product |
| DELETE | /api/products/:id | Admin | Delete a product |

### Orders

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | /api/orders | Protected | Place a new order (validates stock) |
| GET | /api/orders/my-orders | Protected | Get orders for the logged-in user |
| GET | /api/orders | Admin | Get all orders with user details |
| PATCH | /api/orders/:id/status | Admin | Update order status |

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/health | Returns API status |

## Authentication Flow

1. User registers or logs in and receives a JWT token
2. Token is sent in the Authorization header as `Bearer <token>`
3. The `protect` middleware verifies the token and attaches the user to the request
4. The `adminOnly` middleware checks if the user has the admin role

## Models

### User
- name, email (unique), password (hashed with bcrypt), role (admin or user)
- Passwords are automatically hashed before saving using a pre-save hook
- The matchPassword method compares entered passwords against the hash

### Product
- name, description, price, category, image (URL), stock, featured (boolean)
- Stock is decremented when orders are placed

### Order
- References the user who placed it
- Contains an array of order items (product reference, name, image, price, quantity)
- Includes shipping address (fullName, address, city, postalCode, country)
- Tracks payment method and status (Pending, Processing, Shipped, Delivered, Cancelled)

## Commands

```bash
npm install       # Install backend dependencies
npm run dev       # Start with nodemon (auto-restart on changes)
npm start         # Start without nodemon (production)
npm run seed      # Seed the database with sample users and products
```

## Environment Variables

Refer to `.env.example` for the required variables. Copy it to `.env` and fill in your values:

```bash
cp .env.example .env
```

The backend requires a MongoDB connection string, a JWT secret, and the frontend URL for CORS configuration.

## Error Handling

All errors pass through a centralized error handler. In development, error responses include the stack trace. In production, only the error message is returned.

## CORS

The backend accepts requests from the frontend URL specified in the environment variables. Multiple origins can be provided as a comma-separated list.
