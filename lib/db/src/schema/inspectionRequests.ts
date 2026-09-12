import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const inspectionRequestsTable = pgTable("inspection_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertInspectionRequestSchema = createInsertSchema(
  inspectionRequestsTable,
).omit({ id: true, createdAt: true });

export type InsertInspectionRequest = z.infer<
  typeof insertInspectionRequestSchema
>;
export type InspectionRequest = typeof inspectionRequestsTable.$inferSelect;