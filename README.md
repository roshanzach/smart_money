# Smart Money 💰

A full-stack personal finance tracker built with React, Node.js, and MongoDB, featuring real-time budget alerts, spending visualizations, and PDF reporting.

## Features

- **Transaction Management**: Record, track, and manage income and expenses effortlessly.
- **Budgeting & Alerts**: Set customized spending limits and receive real-time warnings when nearing your budget.
- **Data Visualization**: Gain insights into your financial habits with interactive pie charts, graphs, and a calendar view.
- **Reporting**: Generate and export comprehensive PDF reports of your financial data.
- **Secure Backend**: User authentication and robust data persistence using MongoDB.

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB connection string (set up via MongoDB Atlas or local instance)

### Installation

1. Clone the repository.
2. Install dependencies for both frontend and backend:
   ```bash
   # In the root directory (frontend)
   npm install
   
   # In the backend directory
   cd backend
   npm install
   ```

### Environment Variables
Create a `.env` file in the `backend` directory and add your variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the App
Start the development servers:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
# In the root directory
npm run dev
```
