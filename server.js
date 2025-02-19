require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // Allow all origins (change in production)
app.use(express.json()); // Parse JSON body

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Schema & Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, // Validate email format
  message: { type: String, required: true },
});

const User = mongoose.model("users", UserSchema);

// API Endpoint to Store Data
app.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const newUser = new User({ name, email, message });
    await newUser.save();
    res.json({ success: true, message: "Data stored successfully!" });
  } catch (err) {
    console.error("❌ Error saving data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Serve index.html from the root directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
