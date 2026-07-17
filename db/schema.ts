import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  index,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('member'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const profiles = pgTable('profiles', {
  id: text('id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name'),
  bio: text('bio'),
  website: text('website'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('draft'),
    category: text('category').notNull().default('nature'),
    tags: text('tags')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    summary: text('summary'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('posts_user_id_idx').on(table.userId)],
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id').primaryKey(), // Stripe subscription ID
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status').notNull(),
    priceId: text('price_id'),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('subscriptions_user_id_idx').on(table.userId)],
);

export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey(),
  processedAt: timestamp('processed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const uploadcareFiles = pgTable(
  'uploadcare_files',
  {
    id: serial('id').primaryKey(),
    fileId: text('file_id').notNull().unique(), // Uploadcare UUID
    fileUrl: text('file_url').notNull(), // CDN URL
    fileName: text('file_name').notNull(),
    fileSize: integer('file_size').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('uploadcare_files_user_id_idx').on(table.userId)],
);

// Relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  posts: many(posts),
  subscription: one(subscriptions),
  uploadcareFiles: many(uploadcareFiles),
  notifications: many(notifications),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.id], references: [users.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const uploadcareFilesRelations = relations(
  uploadcareFiles,
  ({ one }) => ({
    user: one(users, {
      fields: [uploadcareFiles.userId],
      references: [users.id],
    }),
  }),
);

export const notifications = pgTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    templateId: text('template_id').notNull(),
    variables: jsonb('variables')
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    priority: text('priority').notNull().default('normal'), // low, normal, high, urgent
    delivery: jsonb('delivery')
      .$type<{ inApp: boolean; email: boolean; push: boolean }>()
      .notNull()
      .default({ inApp: true, email: false, push: false }),
    deduplicationKey: text('deduplication_key'),
    readAt: timestamp('read_at', { withTimezone: true }),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    deliverAt: timestamp('deliver_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('notifications_user_id_idx').on(table.userId),
    index('notifications_user_unread_idx').on(table.userId, table.readAt),
    index('notifications_deliver_at_idx').on(table.deliverAt),
    index('notifications_dedup_idx').on(
      table.userId,
      table.deduplicationKey,
      table.createdAt,
    ),
  ],
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));
