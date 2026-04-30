import pg from "pg";
const { Pool, types } = pg;

// Fix: PostgreSQL DATE columns are returned as JS Date objects by default,
// which causes timezone shift issues (e.g. 2025-04-29 WIB becomes 2025-04-28 UTC).
// Override the parser to return DATE as a plain string (YYYY-MM-DD).
const DATE_OID = 1082;
types.setTypeParser(DATE_OID, (val) => val); // keep as string, no conversion

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