Digital Wallet API Backend
A secure, modular, and role-based backend API for a digital wallet system (similar to Bkash or Nagad) built with Express.js and Mongoose.

🚀 Project Overview
This project implements a digital wallet system allowing users, agents, and admins to securely manage wallets and perform financial operations such as adding money, withdrawing, sending money, and viewing transaction history. It includes JWT-based authentication, role-based authorization, wallet management, and transaction tracking.

🛠️ Features
Authentication & Authorization

JWT-based login system with roles: admin, user, and agent

Secure password hashing with bcrypt

Role-based route protection middleware

Wallet Management

Automatic wallet creation on user/agent registration with initial balance (৳50)

Add money (top-up), withdraw money, send money to another user

Admin can block/unblock wallets

Transaction Management

All transactions are stored with details

View transaction history with pagination

Agents can perform cash-in and cash-out operations for users

Admin Controls

View all users, agents, wallets, and transactions

Approve/suspend agents

Block/unblock user wallets


src/
├── modules/
│   ├── auth/               # Authentication & authorization logic
│   ├── user/               # User-related features
│   ├── wallet/             # Wallet & transaction logic
│   ├── transaction/        # Transaction schema and routes
│   ├── admin/              # Admin routes and controllers
├── middlewares/            # Custom middleware (auth, error handling)
├── config/                 # Environment and DB config
├── utils/                  # Utility functions
├── app.ts                  # Express app setup
├── server.ts               # Server launch & API handler for serverless




📚 API Endpoints Summary
Auth
POST /api/auth/register — Register a new user/agent/admin

POST /api/auth/login — Login and receive JWT token

Wallet
GET /api/wallet/balance — Get current user wallet balance

POST /api/wallet/add — Add money to own wallet

POST /api/wallet/withdraw — Withdraw money from own wallet

POST /api/wallet/send — Send money to another user by email

GET /api/wallet/transactions — View own transaction history

Admin (Admin only routes)
GET /api/admin/users — View all users and agents

GET /api/admin/wallets — View all wallets

PATCH /api/admin/wallets/toggle-block/:userId — Block/unblock user wallet

PATCH /api/admin/agent/toggle-status/:agentId — Approve/suspend agent

GET /api/admin/transactions — View all transactions


Testing
Use Postman or similar tools to test API endpoints.

Include the JWT token in the Authorization header as Bearer <token> for protected routes.

Pagination parameters available on listing endpoints: ?page=1&limit=10