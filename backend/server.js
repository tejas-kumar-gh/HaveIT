const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const tripRoutes = require("./src/routes/trip.routes");
const requestRoutes = require("./src/routes/request.routes");
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "https://have-it-sooty.vercel.app/", // frontend URL later
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/requests", requestRoutes);

// Test
app.get("/", (req, res) => {
  res.send("welcome to our home page of site");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:3000`);
});
