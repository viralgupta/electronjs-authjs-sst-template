import { uuid, text, pgTable, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  phone_number: text("phone_number"),
  isAdmin: boolean("isAdmin"),
});
