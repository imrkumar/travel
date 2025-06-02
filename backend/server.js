require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const trekRoutes = require("./src/routes/trek.routes");
const contactRoutes = require("./src/routes/contact.routes");

const app = express();
dbConnect();

app.use(cors());
app.use(express.json());

// Default test route
app.get("/", (req, res) => {
  res.send("API is working.");
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/trek", trekRoutes);
app.use("/api/contact", contactRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: err.message || err.toString() });
});

//Export the app for Vercel
module.exports = app;
