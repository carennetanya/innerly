import pool from "../db.js";

export default {
  // Create table if not exists
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_commitments (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        date DATE NOT NULL,
        action TEXT NOT NULL,
        mood_img TEXT DEFAULT '',
        mood TEXT DEFAULT '',
        is_done BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  // Get today's commitment for a user
  async getToday(userId, date) {
    const result = await pool.query(
      `SELECT * FROM user_commitments WHERE user_id = $1 AND date = $2 ORDER BY created_at DESC LIMIT 1`,
      [userId, date]
    );
    return result.rows[0] || null;
  },

  // Get all commitments for a user
  async getAll(userId) {
    const result = await pool.query(
      `SELECT * FROM user_commitments WHERE user_id = $1 ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  },

  // Create a new commitment
  async create(userId, date, action, moodImg, mood) {
    const result = await pool.query(
      `INSERT INTO user_commitments (user_id, date, action, mood_img, mood)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, date, action, moodImg || "", mood || ""]
    );
    return result.rows[0];
  },

  // Mark commitment as done
  async markDone(id, userId) {
    const result = await pool.query(
      `UPDATE user_commitments SET is_done = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );
    return result.rows[0] || null;
  },
};