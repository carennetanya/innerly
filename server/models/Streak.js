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
        chosen_flower TEXT,
        collected_flowers JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    // Add columns if upgrading from old schema
    await pool.query(`
      ALTER TABLE user_streaks ADD COLUMN IF NOT EXISTS chosen_flower TEXT
    `).catch(() => {});
    await pool.query(`
      ALTER TABLE user_streaks ADD COLUMN IF NOT EXISTS collected_flowers JSONB DEFAULT '[]'
    `).catch(() => {});
  },

  async getStreak(userId) {
    const result = await pool.query(
      `SELECT streak, last_reflection_date, last_watered_date, chosen_flower, collected_flowers FROM user_streaks WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || { streak: 0, last_reflection_date: null, last_watered_date: null, chosen_flower: null, collected_flowers: [] };
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

  async setChosenFlower(userId, flowerPath) {
    await pool.query(
      `INSERT INTO user_streaks (user_id, chosen_flower)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET chosen_flower = $2`,
      [userId, flowerPath]
    );
  },

  async getCollectedFlowers(userId) {
    const result = await pool.query(
      `SELECT collected_flowers FROM user_streaks WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0]?.collected_flowers || [];
  },

  async saveCollectedFlowers(userId, flowers) {
    await pool.query(
      `INSERT INTO user_streaks (user_id, collected_flowers)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (user_id)
       DO UPDATE SET collected_flowers = $2::jsonb`,
      [userId, JSON.stringify(flowers)]
    );
  },
};