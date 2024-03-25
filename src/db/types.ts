import { filesystem, user } from './schema';
import { createInsertSchema } from 'drizzle-typebox';

export type UserRole = 'REGULAR' | 'ADMIN';

export type User = typeof user.$inferSelect;
export type CreateUser = typeof user.$inferInsert;
export const CreateUserSchema = createInsertSchema(user);

export type Filesystem = typeof filesystem.$inferSelect;
export type CreateFilsystem = typeof filesystem.$inferInsert;