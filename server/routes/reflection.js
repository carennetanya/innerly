import express from "express";
import Reflection from "../models/Reflection.js";

const router = express.Router();

// Init table on startup
Reflection.init().catch(console.error);

// GET /api/reflections/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const reflections = await Reflection.getReflections(userId);
    res.json(reflections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reflections/:userId
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;
    const reflection = await Reflection.saveReflection(userId, data);
    res.json(reflection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reflections/:userId/:date
router.delete("/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;
    await Reflection.deleteReflection(userId, date);
    res.json({ message: "Reflection deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;