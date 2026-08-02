import { neon } from "@neondatabase/serverless";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("DATABASE_URL is not set. Database operations will be mocked.");
    return null;
  }
  return neon(databaseUrl);
}

export async function initDb() {
  const sql = getDb();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS customer_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'inquiry',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Neon Postgres table initialized successfully.");
  } catch (error) {
    console.error("Error initializing Neon database table:", error);
  }
}
