require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();


// CORS Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Middleware
app.use(express.json());

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
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
