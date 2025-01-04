import postgres from "npm:postgres";

const connectionString: string | undefined = Deno.env.get("DATABASE_URL");
if (!connectionString) {
  throw new Error("DATABASE_URL must be set");
}

const db = postgres(connectionString);

export default db;
