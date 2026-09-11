import { neon } from "@neondatabase/serverless";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("DATABASE_URL is not set. Database operations will be mocked.");
    return null;
  }
  return neon(databaseUrl);
}

let isDbInitialized = false;
let initDbPromise: Promise<void> | null = null;

export async function initDb(): Promise<void> {
  if (isDbInitialized) return;

  if (initDbPromise) {
    return initDbPromise;
  }

  const sql = getDb();
  if (!sql) return;

  initDbPromise = (async () => {
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

      await sql`
        CREATE TABLE IF NOT EXISTS customer_reviews (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          comment TEXT NOT NULL,
          rating INT DEFAULT 5,
          is_approved BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Ensure is_approved column exists for already created tables
      await sql`
        ALTER TABLE customer_reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
      `;

      isDbInitialized = true;
      console.log("Neon Postgres tables initialized successfully.");
    } catch (error) {
      console.error("Error initializing Neon database table:", error);
      // Reset promise so subsequent requests can retry if connection temporarily failed
      initDbPromise = null;
    }
  })();

  return initDbPromise;
}
