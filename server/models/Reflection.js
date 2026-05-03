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
        "trigger" TEXT,
        went_well TEXT,
        improve TEXT,
        insight TEXT,
        action TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, date)
      )
    `);

    // Rename column if it was created without quotes (reserved word fix)
    await pool.query(`
      ALTER TABLE reflections RENAME COLUMN trigger TO "trigger"
    `).catch(() => {});

    // Add new Gibbs cycle columns if they don't exist yet
    await pool.query(`ALTER TABLE reflections ADD COLUMN IF NOT EXISTS title TEXT`).catch(() => {});
    await pool.query(`ALTER TABLE reflections ADD COLUMN IF NOT EXISTS feeling TEXT`).catch(() => {});
    await pool.query(`ALTER TABLE reflections ADD COLUMN IF NOT EXISTS conclusion TEXT`).catch(() => {});
  },

  async getReflections(userId) {
    const result = await pool.query(
      `SELECT id, user_id, date, mood, moods, "trigger", went_well, improve, insight, action,
              title, feeling, conclusion, created_at
       FROM reflections WHERE user_id = $1 ORDER BY date DESC`,
      [userId]
    );
    return result.rows.map(row => ({
      ...row,
      trigger: row.trigger || row["trigger"] || "",
      moods: Array.isArray(row.moods) ? row.moods
           : (typeof row.moods === 'string' ? (() => { try { return JSON.parse(row.moods); } catch { return row.mood ? [row.mood] : []; } })()
           : (row.moods || (row.mood ? [row.mood] : []))),
    }));
  },

  async saveReflection(userId, data) {
    const { date, mood, moods, trigger, wentWell, improve, insight, action,
            title, feeling, conclusion, description, analysis } = data;

    // Support new field names (description→trigger, analysis→insight)
    const triggerVal = description || trigger || null;
    const insightVal = analysis || insight || null;

    const moodsValue = Array.isArray(moods) ? moods : (moods ? [moods] : null);

    const result = await pool.query(
      `INSERT INTO reflections
         (user_id, date, mood, moods, "trigger", went_well, improve, insight, action, title, feeling, conclusion)
       VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (user_id, date) DO UPDATE SET
         mood=$3, moods=$4::jsonb, "trigger"=$5, went_well=$6, improve=$7,
         insight=$8, action=$9, title=$10, feeling=$11, conclusion=$12
       RETURNING *`,
      [userId, date, mood||null, JSON.stringify(moodsValue),
       triggerVal, wentWell||null, improve||null, insightVal, action||null,
       title||null, feeling||null, conclusion||null]
    );

    // Auto-update streak & last_reflection_date
    const streakData = await Streak.getStreak(userId);
    let { streak, last_reflection_date } = streakData;
    streak = streak || 0;
    let newStreak = 1;

    if (last_reflection_date) {
      const last = new Date(last_reflection_date.toString().split('T')[0] + 'T12:00:00Z');
      const curr = new Date(date.toString().split('T')[0] + 'T12:00:00Z');
      const diff = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diff === 1) newStreak = streak + 1;
      else if (diff === 0) newStreak = streak;
      else newStreak = 1;
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