import express from "express";
import Commitment from "../models/Commitment.js";

const router = express.Router();

// Init table on startup
Commitment.init().catch(console.error);

// GET /api/commitment/:userId/today?date=YYYY-MM-DD
router.get("/:userId/today", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date is required" });

    const commitment = await Commitment.getToday(userId, date);
    res.json(commitment || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/commitment/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const commitments = await Commitment.getAll(userId);
    res.json(commitments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/commitment/:userId
// { date, action, moodImg, mood }
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, action, moodImg, mood } = req.body;
    if (!date || !action) return res.status(400).json({ error: "date and action required" });

    const commitment = await Commitment.create(userId, date, action, moodImg, mood);
    res.status(201).json(commitment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/commitment/:userId/:id/done
router.patch("/:userId/:id/done", async (req, res) => {
  try {
    const { userId, id } = req.params;
    const updated = await Commitment.markDone(id, userId);
    if (!updated) return res.status(404).json({ error: "Commitment not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;