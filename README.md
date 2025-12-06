# Artisan Treasures - Traditional E-commerce Platform

A full-stack e-commerce application built with React, Node.js, Express.js, and SQLite, featuring a modern, premium UI designed for traditional artisanal products.

## Features

- 🛍️ **Traditional Product Showcase**: Beautiful card-based layout for showcasing artisanal products.
- 🛒 **Shopping Cart**: Fully functional cart with quantity management.
- 💳 **Checkout System**: Streamlined checkout process for order placement.
- 🔐 **Authentication**: Secure Login/Register for customers and admins.
- 👨‍💼 **Admin Dashboard**: Comprehensive panel for managing products (Add/Edit/Delete) and viewing orders.
- 🎨 **Premium UI/UX**: Custom design system with earthy tones, smooth animations, and responsive layout.
- 📦 **Zero-Config Database**: Uses SQLite for a hassle-free, file-based database setup.
- 🛡️ **Security**: Protected routes, role-based access control, and password hashing.

## Tech Stack

### Frontend
- **React 18**: UI library for building interactive interfaces.
- **Vite**: Next-generation frontend tooling for fast builds.
- **React Router**: Declarative routing for single-page applications.
- **Axios**: Promise-based HTTP client.
- **CSS3**: Custom design system with CSS variables and modern layout techniques (Grid/Flexbox).

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated web framework.
- **SQLite**: Self-contained, serverless, zero-configuration SQL database engine.
- **bcryptjs**: Library for hashing passwords.
- **jsonwebtoken**: Implementation of JSON Web Tokens for authentication.

## Project Structure

```
.
├── backend/
│   ├── server.js              # Main server entry point
│   ├── database.sqlite        # SQLite database file (auto-generated)
│   ├── config/
│   │   └── database.js        # SQLite configuration and seeding
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── errorHandlers.js   # Global error handling
│   └── routes/                # API route definitions
├── frontend/
│   ├── src/
│   │   ├── components/        # React components (Navbar, ProductList, etc.)
│   │   ├── context/           # Global state (AuthContext)
│   │   ├── services/          # API integration
│   │   ├── App.css            # Global styles and design system
│   │   └── index.css          # Reset and base styles
│   └── public/
│       └── images/            # Static assets
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### 1. Backend Setup

The backend uses SQLite, so no external database server installation is required.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.
   *Note: The database will be automatically created and seeded with sample traditional products on the first run.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
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
   The frontend will run on `http://localhost:3000` (or the port shown in your terminal).

## Default Credentials

**Admin Account:**
- **Username:** `admin`
- **Password:** `admin123`

*Use these credentials to access the Admin Dashboard at `/admin`.*

## API Endpoints

### Public
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected (Admin Only)
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - View all orders

## Database Schema

The SQLite database (`backend/database.sqlite`) includes the following tables:
- **users**: Stores customer and admin accounts.
- **products**: Stores product details (name, description, price, image, stock).
- **cart**: Manages temporary shopping cart items.
- **orders**: Stores order information.
- **order_items**: Links products to orders.

## License

ISC
