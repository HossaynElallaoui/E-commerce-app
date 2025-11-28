# Ecommerce Website

A full-stack ecommerce application built with React, Node.js, Express.js, and SQLite database.

## Features

- 🛍️ Product listing and browsing
- 🛒 Shopping cart functionality
- 💳 Checkout and order placement
- 📦 Order management
- 🔐 User authentication (Login/Register for customers and admins)
- 👨‍💼 Admin dashboard with product management (Add/Edit/Delete products)
- 📊 Order management for admins
- 🛡️ Protected routes and role-based access control
- ⚠️ HTTP error handling (404, 301, 500)
- 🎨 Modern and responsive UI
- 📝 Beginner-friendly code with detailed comments

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database (using mysql2)
- **CORS** - Cross-origin resource sharing
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

## Project Structure

```
.
├── backend/
│   ├── server.js              # Main server entry point
│   ├── package.json          # Backend dependencies
│   ├── database.sqlite       # SQLite database (created on first run)
│   ├── config/
│   │   └── database.js       # Database configuration and initialization
│   ├── middleware/
│   │   ├── authMiddleware.js # Authentication & authorization middleware
│   │   └── errorHandlers.js  # Error handling (404, 301, 500)
│   └── routes/
│       ├── authRoutes.js     # Authentication routes (login, register)
│       ├── productRoutes.js  # Public product routes
│       ├── cartRoutes.js     # Cart management routes
│       ├── orderRoutes.js    # Order management routes
│       └── adminRoutes.js    # Admin-only routes
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Register.jsx  # Registration page
│   │   │   ├── AdminDashboard.jsx # Admin panel
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/          # React context
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── services/         # API service layer
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL Server (v5.7 or higher)

### Backend Setup

1. **Install MySQL Server** (if not already installed)
   - See `backend/docs/MYSQL_SETUP.md` for detailed instructions

2. **Create MySQL Database:**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env` in the backend folder
   - Update MySQL credentials in `.env`:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=ecommerce_db
     ```

4. Navigate to the backend directory:
```bash
cd backend
```

5. Install dependencies:
```bash
npm install
```

6. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

**Note:** The database tables will be created automatically on first run!

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new customer account
- `POST /api/auth/login` - Login (admin or customer)
- `GET /api/auth/me` - Get current user info (requires authentication)

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart (Public)
- `GET /api/cart?sessionId=xxx` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart?sessionId=xxx` - Clear cart

### Orders (Public)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order with items

### Admin Routes (Protected - Admin only)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

### Error Handling
- `404` - Route not found (with helpful error message)
- `301` - Permanent redirects for moved resources
- `500` - Internal server error handling

## Default Admin Credentials

**⚠️ IMPORTANT: Change these credentials in production!**

- **Username:** `admin`
- **Password:** `admin123`

You can login as admin to access the admin dashboard and manage products.

## Database Schema

### Users
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `role` - User role ('admin' or 'customer')
- `created_at` - Creation timestamp

### Products
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `image_url` - Product image URL
- `stock` - Available stock
- `created_at` - Creation timestamp

### Cart
- `id` - Primary key
- `product_id` - Foreign key to products
- `quantity` - Item quantity
- `session_id` - Session identifier
- `created_at` - Creation timestamp

### Orders
- `id` - Primary key
- `total_amount` - Order total
- `customer_name` - Customer name
- `customer_email` - Customer email
- `customer_address` - Shipping address
- `status` - Order status (default: 'pending')
- `created_at` - Creation timestamp

### Order Items
- `id` - Primary key
- `order_id` - Foreign key to orders
- `product_id` - Foreign key to products
- `quantity` - Item quantity
- `price` - Item price at time of order

## Sample Data

The application comes with:
- **Default Admin Account:** username: `admin`, password: `admin123`
- **5 Sample Products:**
  - Laptop ($999.99)
  - Smartphone ($699.99)
  - Headphones ($199.99)
  - Keyboard ($129.99)
  - Mouse ($49.99)

## Development

### Backend Development
- The server uses nodemon for auto-reload during development
- Database is automatically initialized on first run
- Sample products are inserted if the database is empty

### Frontend Development
- Vite provides hot module replacement
- API proxy is configured to forward `/api` requests to the backend

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Backend
The backend can be run directly with:
```bash
cd backend
npm start
```

## Authentication & Authorization

### Customer Registration
Customers can register by providing:
- Username (must be unique)
- Email (must be unique)
- Password (minimum 6 characters)

### Admin Access
- Admins can login using the default credentials or any account with `role = 'admin'`
- Admin dashboard allows:
  - Adding new products
  - Editing existing products
  - Deleting products
  - Viewing all orders
  - Updating order status

### Protected Routes
- `/admin` - Only accessible to authenticated admins
- Other routes are public, but cart/orders are linked to user sessions

## Error Handling

The application includes comprehensive error handling:

1. **404 Not Found** - Returns helpful message with available routes
2. **301 Redirects** - Handles moved resources (e.g., `/api/product` → `/api/products`)
3. **500 Server Error** - Catches and handles server errors gracefully
4. **Authentication Errors** - 401 for unauthorized, 403 for forbidden

## Code Organization

The backend is organized into separate modules for better maintainability:

### Configuration (`config/`)
- **database.js**: Database connection, table creation, and data seeding

### Middleware (`middleware/`)
- **authMiddleware.js**: JWT authentication and admin authorization
- **errorHandlers.js**: Centralized error handling (404, 301, 500)

### Routes (`routes/`)
- **authRoutes.js**: User registration and login
- **productRoutes.js**: Public product endpoints
- **cartRoutes.js**: Shopping cart operations
- **orderRoutes.js**: Order creation and retrieval
- **adminRoutes.js**: Admin-only product and order management

### Benefits of This Structure
- ✅ **Separation of Concerns**: Each module has a single responsibility
- ✅ **Easy to Maintain**: Changes to one feature don't affect others
- ✅ **Reusable Code**: Middleware and utilities can be shared
- ✅ **Better Testing**: Each module can be tested independently
- ✅ **Scalable**: Easy to add new routes or features

## Beginner-Friendly Features

This project is designed to be beginner-friendly with:
- ✅ Detailed comments explaining code functionality
- ✅ Clear file structure and organization
- ✅ Modular architecture (separated concerns)
- ✅ Simple authentication flow
- ✅ Easy-to-understand error messages
- ✅ Step-by-step setup instructions
- ✅ Well-documented API endpoints

## Database Information

- **Database Type:** MySQL (Relational Database)
- **Connection:** Uses connection pooling for better performance
- **Path Module:** Used in `database.js` for configuration file paths
- **Auto-initialization:** Tables are created automatically on first run
- **Foreign Keys:** Enabled for data integrity

## Notes

- The application uses MySQL as the database. Make sure MySQL server is running.
- Session management uses localStorage for the frontend. For production, implement proper session management.
- The cart is session-based. Each browser session gets a unique session ID.
- Image URLs use placeholder images. Replace with actual product images.
- JWT tokens expire after 7 days. Users need to login again after expiration.
- **Change the default admin password immediately in production!**
- See `backend/docs/MYSQL_SETUP.md` for detailed MySQL setup instructions.

## License

ISC

