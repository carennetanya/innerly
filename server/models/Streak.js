import pool from "../db.js";

export default {
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_streaks (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        streak INTEGER DEFAULT 0,
        last_reflection_date DATE,
        last_watered_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  async getStreak(userId) {
    const result = await pool.query(
      `SELECT streak, last_reflection_date, last_watered_date FROM user_streaks WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || { streak: 0, last_reflection_date: null, last_watered_date: null };
  },

  async updateStreak(userId, streak, lastReflectionDate) {
    await pool.query(
      `INSERT INTO user_streaks (user_id, streak, last_reflection_date)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET streak = $2, last_reflection_date = $3`,
      [userId, streak, lastReflectionDate]
    );
  },

  async setWatered(userId, date) {
    await pool.query(
      `INSERT INTO user_streaks (user_id, last_watered_date)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET last_watered_date = $2`,
      [userId, date]
    );
  },
};