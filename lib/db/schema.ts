import { pgTable, serial, varchar, boolean, integer, timestamp, date, jsonb } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
    id: serial("id").primaryKey(),
    nis: varchar("nis", { length: 32 }).notNull().unique(),
    nama: varchar("nama", { length: 255 }).notNull(),
    kelas: varchar("kelas", { length: 64 }).notNull(),
    tanggalLahir: date("tanggal_lahir").notNull(),
    statusLulus: boolean("status_lulus").notNull().default(false),
    isOpen: boolean("is_open").notNull().default(false),
    tanggalDibuka: timestamp("tanggal_dibuka", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const settings = pgTable("settings", {
    id: serial("id").primaryKey(),
    isCheckOpen: boolean("is_check_open").notNull().default(false),
    openAt: timestamp("open_at", { withTimezone: true }),
});

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 64 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
});

export const auditLogs = pgTable("audit_logs", {
    id: serial("id").primaryKey(),
    actorUserId: integer("actor_user_id").notNull(),
    action: varchar("action", { length: 128 }).notNull(),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});