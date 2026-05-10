import express from "express";
import pool from "../db.js";

const router = express.Router();

// Init contact_messages table if not exists
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS innerly.contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}
init().catch(console.error);

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;

    if (!name || !email || !topic || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const result = await pool.query(
      `INSERT INTO innerly.contact_messages (name, email, topic, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), email.trim(), topic.trim(), message.trim()]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ error: "Failed to save message." });
  }
});

export default router;