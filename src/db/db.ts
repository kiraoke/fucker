import { drizzle } from "npm:drizzle-orm/postgres-js";

const db_url: string | undefined = Deno.env.get("DATABASE_URL");

if (!db_url) throw new Error("DATABASE_URL environment variable not set");

const db = drizzle(db_url);
