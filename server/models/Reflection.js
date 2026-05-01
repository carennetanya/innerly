import pool from "../db.js";
import Streak from "./Streak.js";

export default {
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reflections (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        date DATE NOT NULL,
        mood TEXT,
        moods JSONB,
        trigger TEXT,
        went_well TEXT,
        improve TEXT,
        insight TEXT,
        action TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, date)
      )
    `);
  },

  async getReflections(userId) {
    const result = await pool.query(
      `SELECT id, user_id, date, mood, moods, trigger, went_well, improve, insight, action, created_at 
       FROM reflections WHERE user_id = $1 ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  },

  async saveReflection(userId, data) {
    const { date, mood, moods, trigger, wentWell, improve, insight, action } = data;
    const moodsJson = moods ? JSON.stringify(moods) : null;
    
    const result = await pool.query(
      `INSERT INTO reflections (user_id, date, mood, moods, trigger, went_well, improve, insight, action)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id, date) 
       DO UPDATE SET mood = $3, moods = $4, trigger = $5, went_well = $6, improve = $7, insight = $8, action = $9
       RETURNING *`,
      [userId, date, mood, moodsJson, trigger, wentWell, improve, insight, action]
    );

    // Auto-update streak & last_reflection_date
    const streakData = await Streak.getStreak(userId);
    let { streak, last_reflection_date } = streakData;
    streak = streak || 0;
    let newStreak = 1;

    if (last_reflection_date) {
      // Use noon UTC to avoid DST / timezone edge cases in date diff
      const last = new Date(last_reflection_date.toString().split('T')[0] + 'T12:00:00Z');
      const curr = new Date(date.toString().split('T')[0] + 'T12:00:00Z');
      const diff = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak = streak + 1;
      else if (diff === 0) newStreak = streak; // hari yang sama, tidak naik
      else newStreak = 1; // streak putus
    }

    await Streak.updateStreak(userId, newStreak, date);

    return result.rows[0];
  },

  async deleteReflection(userId, date) {
    await pool.query(
      `DELETE FROM reflections WHERE user_id = $1 AND date = $2`,
      [userId, date]
    );
  },
};