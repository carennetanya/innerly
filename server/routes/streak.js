import express from "express";
import Streak from "../models/Streak.js";

const router = express.Router();

Streak.init().catch(console.error);

// GET /api/streak/:userId
// Returns: { streak, watered_streak, last_reflection_date, last_watered_date, chosen_flower, collected_flowers }
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await Streak.getStreak(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/streak/:userId  — update reflection streak
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

// POST /api/streak/:userId/water  — record today's watering
// Returns: { watered_streak, wasReset }
//   watered_streak = posisi dalam siklus saat ini (1, 2, atau 3)
//   wasReset = true jika user bolos (siklus direset ke 1)
router.post("/:userId/water", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: "date is required" });

    const { newWateredStreak, wasReset } = await Streak.setWatered(userId, date);
    res.json({ watered: true, date, watered_streak: newWateredStreak, wasReset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/streak/:userId/flower  — user picked a flower, reset watered cycle
router.post("/:userId/flower", async (req, res) => {
  try {
    const { userId } = req.params;
    const { flower } = req.body;
    if (!flower) return res.status(400).json({ error: "flower is required" });

    await Streak.setChosenFlower(userId, flower);
    await Streak.resetWateredCycle(userId);  // reset siklus untuk bunga berikutnya
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