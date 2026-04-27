import pool from "../db.js";

export default {
  async findOne(query) {
    const keys = Object.keys(query);
    const values = Object.values(query);
    const conditions = keys.map((k, i) => `${k} = $${i + 1}`).join(" AND ");
    const result = await pool.query(
      `SELECT * FROM users WHERE ${conditions} LIMIT 1`,
      values,
    );
    return result.rows[0] || null;
  },

  async create(data) {
    const result = await pool.query(
      `INSERT INTO users (name, username, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, username, email, created_at`,
      [data.name, data.username, data.email, data.password],
    );
    const user = result.rows[0];
    user._id = user.id;
    return user;
  },
};
