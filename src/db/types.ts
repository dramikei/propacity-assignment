import { filesystem, user } from './schema';

export type UserRole = 'REGULAR' | 'ADMIN';

export type User = typeof user.$inferSelect;
export type CreateUser = typeof user.$inferInsert;

export type Filesystem = typeof filesystem.$inferSelect;
export type CreateFilsystem = typeof filesystem.$inferInsert;