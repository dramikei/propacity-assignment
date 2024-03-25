import { Boom } from '@hapi/boom';
import dotenv from 'dotenv';
dotenv.config();
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as process from 'process';

const connectionString = process.env.DATABASE_URL;
console.log(connectionString);

if (connectionString == null) {
    throw new Boom('connectionString is null!');
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function runMigration() {
  await migrate(db, { migrationsFolder: 'drizzle' });
}

runMigration().then(() => {
  console.log('Migrated');
  process.exit(0);
});