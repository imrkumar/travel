require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const blogRoutes = require("./src/routes/blogRoutes");

const app = express();
dbConnect();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

app.use("/api", authRoutes);
app.use("/api/blog", blogRoutes);

app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: err.message || err.toString() });
  });
const PORT = process.env.PORT || 9000;
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running on port ${PORT}`);
  }
});

