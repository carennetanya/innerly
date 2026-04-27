import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.ndzpzzubwnoxgmlibtkc",
  password: "jhm1yzlFgTCNgtWx",
  ssl: { rejectUnauthorized: false },
  options: "-c search_path=innerly",
});
export default pool;