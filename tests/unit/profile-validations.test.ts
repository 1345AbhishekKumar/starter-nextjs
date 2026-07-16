import { describe, it, expect } from 'vitest';
import { profileFormSchema } from '@/lib/validations/profile';

describe('Profile Validation Schema', () => {
  it('passes on valid profile inputs', () => {
    const validData = {
      name: 'Meadow Creator',
      email: 'creator@meadow.com',
      bio: 'Just another creator in the green meadow.',
      website: 'https://meadow.com',
    };

    const result = profileFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if display name is less than 2 characters', () => {
    const invalidData = {
      name: 'a',
      email: 'creator@meadow.com',
    };

    const result = profileFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMsg = result.error.flatten().fieldErrors.name?.[0];
      expect(errorMsg).toBe('Name must be at least 2 characters long.');
    }
  });

  it('fails on invalid email format', () => {
    const invalidData = {
      name: 'Willow',
      email: 'not-an-email',
    };

    const result = profileFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMsg = result.error.flatten().fieldErrors.email?.[0];
      expect(errorMsg).toBe('Must be a valid email address.');
    }
  });

  it('fails if bio is longer than 200 characters', () => {
    const invalidData = {
      name: 'Willow',
      email: 'willow@meadow.com',
      bio: 'a'.repeat(201),
    };

    const result = profileFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMsg = result.error.flatten().fieldErrors.bio?.[0];
      expect(errorMsg).toBe('Bio cannot exceed 200 characters.');
    }
  });

  it('fails on invalid website URL', () => {
    const invalidData = {
      name: 'Willow',
      email: 'willow@meadow.com',
      website: 'invalid-url',
    };

    const result = profileFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMsg = result.error.flatten().fieldErrors.website?.[0];
      expect(errorMsg).toBe('Must be a valid URL (e.g. https://example.com).');
    }
  });
});
