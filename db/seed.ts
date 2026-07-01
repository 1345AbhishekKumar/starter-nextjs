import { db } from './index';
import { users, profiles } from './schema';

async function main() {
  console.log('Seeding database...');

  try {
    // Insert mock user
    const mockUser = {
      id: 'user_2seedmock1234567890abcdef',
      email: 'seed.mock@example.com',
      role: 'member',
    };

    await db.insert(users).values(mockUser).onConflictDoNothing();
    console.log('User seeded or already exists');

    // Insert mock profile
    const mockProfile = {
      id: mockUser.id,
      name: 'Meadow Creator',
      bio: 'A quiet creator wandering the meadows of imagination.',
      website: 'https://meadow.example.com',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    };

    await db.insert(profiles).values(mockProfile).onConflictDoNothing();
    console.log('Profile seeded or already exists');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

main();
