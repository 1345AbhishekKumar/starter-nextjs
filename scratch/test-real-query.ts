import { db } from '../db';
import { users } from '../db/schema';

async function test() {
  console.log('Running test query...');
  try {
    const result = await db.select().from(users).limit(1);
    console.log('✅ Query succeeded! Result:', result);
  } catch (error) {
    console.error('❌ Query failed:', error);
    if (error && typeof error === 'object' && 'cause' in error) {
      console.error('Cause:', error.cause);
    }
  }
}

test();
