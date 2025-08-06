# 🏦 Digital Wallet System API

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1+-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

A **secure, scalable, and feature-rich** backend API for a digital wallet system similar to **Bkash** or **Nagad**. Built with modern technologies and following best practices for financial applications.

## 🌟 Key Features

### 🔐 **Authentication & Security**
- **JWT-based authentication** with role-based access control
- **Secure password hashing** using bcryptjs
- **Role-based authorization** (Admin, User, Agent)
- **Session management** with express-session
- **Input validation** using Zod schemas

### 💰 **Wallet Management**
- **Automatic wallet creation** upon user registration
- **Initial balance** of ৳50 for new users
- **Real-time balance tracking** and updates
- **Wallet blocking/unblocking** capabilities
- **Role-based wallet access control**

### 📱 **User Operations**
- **Add Money**: Top-up wallet balance
- **Withdraw Money**: Secure money withdrawal
- **Send Money**: Transfer funds to other users
- **Transaction History**: Complete transaction tracking
- **Balance Inquiry**: Real-time balance checking

### 🏪 **Agent Services**
- **Cash-In**: Add money to user wallets (physical cash collection)
- **Cash-Out**: Withdraw money from user wallets (physical cash disbursement)
- **Commission System**: 2% commission on all transactions
- **Commission History**: Track earnings and transactions
- **Agent Approval System**: Admin-controlled agent verification

### 👑 **Admin Panel**
- **User Management**: View and manage all users
- **Agent Management**: Approve/suspend agents
- **Wallet Oversight**: Block/unblock user wallets
- **Transaction Monitoring**: View all system transactions
- **System Analytics**: Complete financial oversight

## 🏗️ **Architecture & Tech Stack**

### **Backend Technologies**
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5.1+
- **Language**: TypeScript 5.8+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js
- **Validation**: Zod schema validation
- **Security**: bcryptjs, CORS, helmet

### **Development Tools**
- **Development**: ts-node-dev with hot reloading
- **Code Quality**: ESLint with TypeScript support
- **API Testing**: Postman collection included
- **Email Service**: Nodemailer integration
- **Template Engine**: EJS for email templates

## 📁 **Project Structure**

```
digital-wallet-system/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   ├── env.ts              # Environment configuration
│   │   │   └── passport.ts         # Passport.js configuration
│   │   ├── constants.ts            # Application constants
│   │   ├── errorHelpers/           # Custom error classes
│   │   │   ├── ApiError.ts
│   │   │   └── AppError.ts
│   │   ├── helpers/                # Error handling utilities
│   │   ├── interfaces/             # TypeScript interfaces
│   │   │   ├── error.types.ts
│   │   │   └── index.d.ts          # Global type definitions
│   │   ├── middlewares/            # Express middlewares
│   │   │   ├── auth.ts             # Authentication middleware
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts  # Request validation
│   │   ├── modules/                # Feature modules
│   │   │   ├── auth/               # Authentication module
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── user/               # User management
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.validation.ts
│   │   │   ├── wallet/             # Wallet operations
│   │   │   │   ├── wallet.controller.ts
│   │   │   │   ├── wallet.interface.ts
│   │   │   │   ├── wallet.model.ts
│   │   │   │   ├── wallet.route.ts
│   │   │   │   ├── wallet.service.ts
│   │   │   │   └── wallet.validation.ts
│   │   │   └── transaction/        # Transaction management
│   │   │       ├── transaction.controller.ts
│   │   │       ├── transaction.interface.ts
│   │   │       ├── transaction.model.ts
│   │   │       ├── transaction.route.ts
│   │   │       └── transaction.service.ts
│   │   ├── routes/
│   │   │   └── index.ts            # Route aggregation
│   │   └── utils/                  # Utility functions
│   │       ├── catchAsync.ts
│   │       ├── jwt.ts
│   │       ├── sendEmail.ts
│   │       ├── sendResponse.ts
│   │       └── templates/          # Email templates
│   ├── app.ts                      # Express app configuration
│   └── server.ts                   # Server startup
├── Digital-Wallet-API.postman_collection.json  # API testing
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-wallet-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_URL=mongodb://localhost:27017/digital-wallet
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=12
   
   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 **API Documentation**

### **Base URL**
```
http://localhost:5000/api/v1
```

### **Authentication Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/auth/login` | User login | Public |
| `POST` | `/users/register` | User registration | Public |

### **User Management**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/users/me` | Get current user profile | User, Agent, Admin |
| `GET` | `/users/all-users` | Get all users | Admin |
| `GET` | `/users/agents/all` | Get all agents | Admin |
| `PATCH` | `/users/agents/:id/approve` | Approve agent | Admin |
| `PATCH` | `/users/agents/:id/suspend` | Suspend agent | Admin |

### **Wallet Operations**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/wallets/my-wallet` | Get my wallet details | User, Agent, Admin |
| `GET` | `/wallets/balance` | Get my wallet balance | User, Agent, Admin |
| `GET` | `/wallets/user/:userId` | Get user wallet (Admin/Agent) | Agent, Admin |
| `GET` | `/wallets/user/:userId/balance` | Get user balance (Admin/Agent) | Agent, Admin |
| `POST` | `/wallets/add-money` | Add money to wallet | User |
| `POST` | `/wallets/withdraw` | Withdraw money | User |
| `POST` | `/wallets/send-money` | Send money to another user | User |

### **Agent Operations**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/wallets/cash-in` | Cash-in to user wallet | Agent |
| `POST` | `/wallets/cash-out` | Cash-out from user wallet | Agent |

### **Admin Operations**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/wallets/all` | Get all wallets | Admin |
| `PATCH` | `/wallets/block/:userId` | Block user wallet | Admin |
| `PATCH` | `/wallets/unblock/:userId` | Unblock user wallet | Admin |
| `POST` | `/wallets/create` | Create wallet manually | Admin |

### **Transaction History**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/transactions/my-history` | Get my transaction history | User, Agent, Admin |
| `GET` | `/transactions/commission-history` | Get commission history | Agent |
| `GET` | `/transactions/all` | Get all transactions | Admin |

## 🔐 **Authentication & Authorization**

### **User Roles**

1. **👤 User Role**
   - Basic wallet operations (add, withdraw, send money)
   - View personal transaction history
   - Check wallet balance
   - Send money to other users

2. **🏪 Agent Role**
   - Must be approved by admin before activation
   - Perform cash-in/cash-out services for users
   - Earn 2% commission on all transactions
   - View commission history and earnings
   - Access user wallet information for services

3. **👑 Admin Role**
   - Complete system oversight and management
   - Manage users and approve/suspend agents
   - Block/unblock user wallets
   - View all transactions and system analytics
   - Create wallets manually if needed

### **JWT Token Structure**
```json
{
  "userId": "user_object_id",
  "email": "user@example.com",
  "role": "user|agent|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 💳 **Transaction Types**

The system supports six types of transactions:

1. **ADD_MONEY**: User adds money to their wallet
2. **WITHDRAW**: User withdraws money from their wallet
3. **SEND_MONEY**: User sends money to another user
4. **RECEIVE_MONEY**: User receives money from another user
5. **CASH_IN**: Agent adds money to user's wallet (physical cash collection)
6. **CASH_OUT**: Agent withdraws money from user's wallet (physical cash disbursement)

## 📊 **Business Rules**

### **Wallet Rules**
- New users receive ৳50 initial balance
- Minimum transaction amount: ৳1
- Blocked wallets cannot perform any operations
- Insufficient balance prevents withdrawal/send operations

### **Commission Structure**
- Agents earn **2% commission** on cash-in/cash-out transactions
- Commission is automatically calculated and recorded
- Commission history is tracked separately

### **Security Features**
- All passwords are hashed using bcryptjs
- JWT tokens expire after 7 days (configurable)
- Role-based access control on all endpoints
- Input validation using Zod schemas
- Error handling with appropriate HTTP status codes

## 🧪 **API Testing**

### **Using Postman**
1. Import the `Digital-Wallet-API.postman_collection.json` file
2. Set up environment variables:
   - `base_url`: `http://localhost:5000/api/v1`
   - `user_token`: JWT token for user role
   - `agent_token`: JWT token for agent role
   - `admin_token`: JWT token for admin role
   - `user_id`: Sample user ID for testing

### **Sample API Calls**

**Register a User:**
```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Add Money to Wallet:**
```bash
curl -X POST http://localhost:5000/api/v1/wallets/add-money \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 500
  }'
```

## 🛠️ **Development**

### **Available Scripts**
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm run lint     # Run ESLint for code quality
```

### **Code Quality**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with TypeScript support
- **Modular Architecture**: Feature-based module organization
- **Error Handling**: Comprehensive error handling with custom error classes
- **Validation**: Request validation using Zod schemas

## 🔧 **Environment Variables**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | ✅ |
| `PORT` | Server port | `5000` | ✅ |
| `DB_URL` | MongoDB connection string | - | ✅ |
| `JWT_SECRET` | JWT signing secret | - | ✅ |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | ✅ |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12` | ✅ |
| `EMAIL_HOST` | SMTP host for emails | - | ❌ |
| `EMAIL_PORT` | SMTP port | `587` | ❌ |
| `EMAIL_USER` | Email username | - | ❌ |
| `EMAIL_PASS` | Email password | - | ❌ |

## 🚧 **Error Handling**

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errorDetails": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### **Common HTTP Status Codes**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 📈 **Performance Features**

- **Database Indexing**: Optimized MongoDB queries
- **Async/Await**: Non-blocking operations
- **Error Boundaries**: Graceful error handling
- **Input Validation**: Request validation to prevent invalid data
- **JWT Optimization**: Efficient token verification

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Digital Wallet System**  
A comprehensive backend solution for digital financial services.

---

## 📞 **Support**

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the Postman collection for examples

---

**Built with ❤️ using Node.js, TypeScript, and MongoDB**