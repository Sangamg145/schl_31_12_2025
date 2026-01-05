// CORS Configuration for Backend
// Add this to backendSchl/index.js

/**
 * Installation:
 * npm install cors
 * 
 * Then add the following code to your index.js BEFORE your routes
 */

const cors = require('cors');

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,                 // Allow credentials (cookies, auth headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 3600                       // Cache preflight requests for 1 hour
};

// Apply CORS middleware
app.use(cors(corsOptions));

/**
 * For Production:
 * Set origin to your actual frontend URL, e.g., 'https://yourdomain.com'
 * Or use environment variable:
 * 
 * const corsOptions = {
 *   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
 *   credentials: true,
 *   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
 *   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
 * };
 */

/**
 * Complete Example index.js:
 */

/*
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // <-- Add this
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());

// CORS Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));  // <-- Add this

// MongoDB Connection
mongoose
  .connect("mongodb+srv://aamirnawazkhn_db_user:77r9PtPB0uZui0LQ@cluster0.el3ggth.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/
