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
      // Use noon UTC to avoid DST / timezone edge cases in date diff
      const last = new Date(last_reflection_date.toString().split('T')[0] + 'T12:00:00Z');
      const curr = new Date(today.split('T')[0] + 'T12:00:00Z');
      const diff = Math.round((curr - last) / (1000 * 60 * 60 * 24));
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
// NOTE: Streak is managed by the reflection endpoint (POST /:userId).
// Watering does NOT increment streak — it only records the watered date.
// The current streak value is returned so the frontend can display plant stage correctly.
router.post("/:userId/water", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: "date is required" });

    await Streak.setWatered(userId, date);

    // Return current streak (unchanged) so frontend can compute plant stage
    const streakData = await Streak.getStreak(userId);
    const streak = streakData.streak || 0;

    res.json({ watered: true, date, streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/streak/:userId/flower
// { flower: "/happy1.png" }
router.post("/:userId/flower", async (req, res) => {
  try {
    const { userId } = req.params;
    const { flower } = req.body;
    if (!flower) return res.status(400).json({ error: "flower is required" });

    await Streak.setChosenFlower(userId, flower);
    res.json({ ok: true, flower });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/streak/:userId/collection
router.get("/:userId/collection", async (req, res) => {
  try {
    const { userId } = req.params;
    const flowers = await Streak.getCollectedFlowers(userId);
    res.json({ flowers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/streak/:userId/collection
// { flowers: [...] }
router.post("/:userId/collection", async (req, res) => {
  try {
    const { userId } = req.params;
    const { flowers } = req.body;
    if (!Array.isArray(flowers)) return res.status(400).json({ error: "flowers must be an array" });

    await Streak.saveCollectedFlowers(userId, flowers);
    res.json({ ok: true, count: flowers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;