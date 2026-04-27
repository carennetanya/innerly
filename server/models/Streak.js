import pool from "../db.js";

export default {
  async getStreak(userId) {
    const result = await pool.query(
      `SELECT streak, last_reflection_date FROM user_streaks WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || { streak: 0, last_reflection_date: null };
  },

  async updateStreak(userId, streak, lastReflectionDate) {
    // UPSERT: update if exists, else insert
    await pool.query(
      `INSERT INTO user_streaks (user_id, streak, last_reflection_date)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET streak = $2, last_reflection_date = $3`,
      [userId, streak, lastReflectionDate]
    );
  },
};
