import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Grab your connection string
const connectionString = process.env.DATABASE_URL;

// Create a custom Postgres Pool instance with explicit connection timeout rules
const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 10000, // Timeout to acquire connection (10s)
  // Bumping the underlying network authentication stream window
  statement_timeout: 30000,
});

const adapter = new PrismaPg(pool);

// Instantiate global client
export const prisma = new PrismaClient({ adapter });
