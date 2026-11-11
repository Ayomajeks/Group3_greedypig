
import express from "express";

import {
  registerGuest,
  getCurrentPlayer,
} from "../controllers/authController.js";

import { authenticatePlayer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new guest player
router.post("/guest", registerGuest);

// Get the currently authenticated player
router.get("/me", authenticatePlayer, getCurrentPlayer);

export default router;
