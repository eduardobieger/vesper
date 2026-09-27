import { defineRelations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull(),
  priority: text("priority"),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const relations = defineRelations(
  { users, projects, tasks, sessions },
  (r) => ({
    projects: {
      owner: r.one.users({
        from: r.projects.ownerId,
        to: r.users.id,
      }),
      taks: r.many.tasks(),
    },
    users: {
      projects: r.many.projects(),
      sessions: r.many.sessions(),
    },
    tasks: {
      project: r.one.projects({
        from: r.tasks.projectId,
        to: r.projects.id,
      }),
      owner: r.one.users({
        from: r.tasks.ownerId,
        to: r.users.id,
      }),
    },
    sessions: {
      user: r.one.users({
        from: r.sessions.userId,
        to: r.users.id,
      }),
    },
  }),
);
