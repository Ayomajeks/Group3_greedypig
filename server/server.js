import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./config/supabase.js";
import authRoutes from "./routes/authRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

// Load environment variables from the project root
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/games", gameRoutes);

// Basic test endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Greedy Pig API is running!",
  });
});

// Test connection to Supabase
app.get("/health/database", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Successfully connected to Supabase!",
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Greedy Pig API running on port ${PORT}`);
});
