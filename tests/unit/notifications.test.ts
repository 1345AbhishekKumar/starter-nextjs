// @vitest-environment node
import { vi } from 'vitest';

vi.mock('@/config/env.server', () => ({
  serverEnv: {
    DATABASE_URL: 'postgresql://user:password@localhost/dbname',
    CLERK_SECRET_KEY: 'mock_key',
    CLERK_WEBHOOK_SECRET: 'mock_key',
    RESEND_API_KEY: 'mock_key',
    UPSTASH_REDIS_REST_URL: 'https://mock.upstash.io',
    UPSTASH_REDIS_REST_TOKEN: 'mock_token',
    ARCJET_KEY: 'mock_key',
    UPLOADCARE_SECRET_KEY: 'mock_key',
    STRIPE_SECRET_KEY: 'mock_key',
    STRIPE_WEBHOOK_SECRET: 'mock_key',
  },
}));

import { describe, it, expect } from 'vitest';
import { resolveTemplate } from '@/lib/notifications/templates';
import { createNotificationSchema } from '@/lib/notifications/service';
import { providerRegistry } from '@/lib/notifications/provider.registry';

describe('Notification Templates', () => {
  it('should interpolate variables correctly in template strings', () => {
    const variables = {
      taskTitle: 'Plant Wildflowers',
      assignerName: 'Emma Watson',
    };

    const resolved = resolveTemplate('task.assigned', variables);

    expect(resolved.type).toBe('info');
    expect(resolved.icon).toBe('UserCheck');
    expect(resolved.title).toBe('Task Assigned to You');
    expect(resolved.body).toBe(
      'You have been assigned to "Plant Wildflowers" by Emma Watson.',
    );
    expect(resolved.actionUrl).toBe('/dashboard');
  });

  it('should use fallback values for unregistered templates', () => {
    const variables = {
      title: 'Custom Title',
      body: 'Custom message body',
      actionUrl: '/custom-path',
    };

    const resolved = resolveTemplate('unregistered.event', variables);

    expect(resolved.type).toBe('info');
    expect(resolved.icon).toBe('Bell');
    expect(resolved.title).toBe('Custom Title');
    expect(resolved.body).toBe('Custom message body');
    expect(resolved.actionUrl).toBe('/custom-path');
  });
});

describe('Notification Validation Schema', () => {
  it('should pass validation with complete input', () => {
    const valid = createNotificationSchema.safeParse({
      userId: 'user_123',
      templateId: 'task.created',
      variables: { taskTitle: 'Mow Grass' },
      priority: 'high',
      delivery: { inApp: true, email: true },
    });

    expect(valid.success).toBe(true);
  });

  it('should fail validation when userId is missing', () => {
    const invalid = createNotificationSchema.safeParse({
      templateId: 'task.created',
      variables: { taskTitle: 'Mow Grass' },
    });

    expect(invalid.success).toBe(false);
  });
});

describe('Notification Provider Registry', () => {
  it('should hold default inApp and email providers', () => {
    const inAppProvider = providerRegistry.getProvider('inApp');
    const emailProvider = providerRegistry.getProvider('email');

    expect(inAppProvider).toBeDefined();
    expect(inAppProvider?.name).toBe('inApp');

    expect(emailProvider).toBeDefined();
    expect(emailProvider?.name).toBe('email');
  });

  it('should allow registering a custom provider', () => {
    const customChannel = {
      name: 'slack',
      send: vi.fn().mockResolvedValue(undefined),
    };

    providerRegistry.registerProvider(customChannel);

    const retrieved = providerRegistry.getProvider('slack');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('slack');
  });
});
