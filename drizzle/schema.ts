import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** A public travel enquiry received through the guided contact form. */
export const travelRequests = mysqlTable(
  "travel_requests",
  {
    id: int("id").autoincrement().primaryKey(),
    requestCode: varchar("requestCode", { length: 24 }).notNull().unique(),
    service: varchar("service", { length: 128 }).notNull(),
    project: varchar("project", { length: 255 }).notNull(),
    requesterName: varchar("requesterName", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 48 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    details: text("details"),
    status: mysqlEnum("status", ["new", "in_review", "complete"]).default("new").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("travel_requests_code_idx").on(table.requestCode)],
);

/** Metadata for a document held in S3; raw file bytes are never stored in the database. */
export const travelRequestAttachments = mysqlTable(
  "travel_request_attachments",
  {
    id: int("id").autoincrement().primaryKey(),
    requestCode: varchar("requestCode", { length: 24 }).notNull(),
    storageKey: varchar("storageKey", { length: 512 }).notNull(),
    storageUrl: varchar("storageUrl", { length: 512 }).notNull(),
    originalName: varchar("originalName", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 160 }).notNull(),
    sizeBytes: int("sizeBytes").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("travel_request_attachments_request_idx").on(table.requestCode)],
);

export type TravelRequest = typeof travelRequests.$inferSelect;
export type TravelRequestAttachment = typeof travelRequestAttachments.$inferSelect;
