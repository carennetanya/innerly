import express from "express";
import Streak from "../models/Streak.js";

const router = express.Router();

// Init: add last_watered_date column if not exists
Streak.init().catch(console.error);

// GET /api/streak/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const streak = await Streak.getStreak(userId);
    res.json(streak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/streak/:userId
// { today: "2026-04-29" }
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { today } = req.body;
    if (!today) return res.status(400).json({ error: "today is required" });

    const streakData = await Streak.getStreak(userId);
    let { streak, last_reflection_date } = streakData;
    streak = streak || 0;
    let newStreak = 1;

    if (last_reflection_date) {
      const last = new Date(last_reflection_date);
      const curr = new Date(today);
      const diff = Math.floor((curr - last) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak = streak + 1;
      else if (diff === 0) newStreak = streak;
      else newStreak = 1;
    }

    await Streak.updateStreak(userId, newStreak, today);
    res.json({ streak: newStreak, last_reflection_date: today });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/streak/:userId/water
// { date: "2026-04-29" }
router.post("/:userId/water", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: "date is required" });

    await Streak.setWatered(userId, date);
    res.json({ watered: true, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;