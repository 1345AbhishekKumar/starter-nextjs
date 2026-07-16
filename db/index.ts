import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { serverEnv } from '@/config/env.server';
import * as schema from './schema';

if (!serverEnv.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in serverEnv');
}

const sql = neon(serverEnv.DATABASE_URL.trim());
export const db = drizzle({ client: sql, schema });
