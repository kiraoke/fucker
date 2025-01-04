import { pgTable, serial, text, timestamp } from "npm:drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  urls: text("urls").array(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
