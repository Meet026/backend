🛠️ Backend API Server

🚀 Overview

This project is a backend API server developed as part of my learning journey to gain a deep understanding of RESTful API concepts. Built with Node.js and Express.js, it simulates the backend functionality of a YouTube-like application, enabling me to explore server-side development, routing, and data handling in a practical context.

📁 Project Structure

backend/
├── src/
│   ├── controllers/       # Contains the logic for handling API requests and responses
│   ├── routes/            # Defines application routes and endpoints
│   ├── models/            # Database schema definitions and models
│   ├── db/                # Database connection and configuration files
│   ├── middlewares/       # Custom middleware functions (e.g., authentication, error handling)
│   ├── utils/             # Utility functions and helpers used across the project
│   ├── constants.js       # Application-wide constants and configuration values
│   ├── app.js             # Initializes Express app and applies middleware and routes
│   └── index.js           # Entry point to start the server and connect to the database
├── public/                # Static assets served by the backend (e.g., images, uploads)
├── .gitignore             # Specifies files and folders to be ignored by Git
├── package.json           # Lists dependencies and scripts for running the project
└── README.md              # Project documentation and overview


⚙️ Installation

Clone the repository:

git clone https://github.com/Meet026/backend.git

cd backend

Install dependencies:

npm install

Start the server:

npm start

🛡️ Environment Variables

Create a .env file in the root directory and add the following:

PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

 Scripts
npm start: Starts the server.
npm run dev: Starts the server with nodemon for development
