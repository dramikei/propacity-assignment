import postgres from 'postgres';
import * as schema from '../db/schema';
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { Boom } from '@hapi/boom';
import { logger } from './logger';

export let db: PostgresJsDatabase<typeof schema>;

export async function setupDatabase() {
    const connectionString = process.env.DATABASE_URL;
    
    if (connectionString == null) {
        throw new Boom('connectionString is null!');
    }

    const client = postgres(connectionString);
    db = drizzle(client, { schema });
}