
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from the project root
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Greedy Pig API is running!",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Greedy Pig API running on port ${PORT}`);
});
