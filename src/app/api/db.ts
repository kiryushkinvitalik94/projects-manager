// db.ts
import { createPool, Pool } from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function connectDB(): Promise<Pool> {
  const pool: Pool = createPool(dbConfig);
  return pool;
}
