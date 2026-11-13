
import express from "express";

import {
  getLeaderboard,
  getPlayerStats,
} from "../controllers/leaderboardController.js";

const router = express.Router();

// Retrieve all ranked players (up to the requested limit)
router.get("/", getLeaderboard);

// Retrieve an individual player's statistics
router.get("/:playerId", getPlayerStats);

export default router;
