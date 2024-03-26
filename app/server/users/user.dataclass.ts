import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "../db/schema/user";

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  userType: z.enum(["OWNER", "USER"]),
});
export const selectUserSchema = createSelectSchema(users, {
  id: z.number().optional(),
  email: (schema) => schema.email.email(),
  userType: z.enum(["OWNER", "USER"]).optional(),
  password: z.string().optional(),
});

export type InsertUserSchema = z.infer<typeof insertUserSchema>;
export type SelectUserSchema = z.infer<typeof selectUserSchema>;
