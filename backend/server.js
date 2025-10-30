import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/bookingsRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/experiences", experienceRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Error handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
