
import express from "express";
import { completeGame } from "../controllers/gameController.js";

const router = express.Router();

// Save a completed game and its participants' results.
router.post("/complete", completeGame);

export default router;
