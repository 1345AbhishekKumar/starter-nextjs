import { pgTable, text, timestamp, serial, integer } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('member'),
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

export const posts = pgTable('posts', {
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
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const subscriptions = pgTable('subscriptions', {
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
});

export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey(),
  processedAt: timestamp('processed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const uploadcareFiles = pgTable('uploadcare_files', {
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
});

// Relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  posts: many(posts),
  subscription: one(subscriptions),
  uploadcareFiles: many(uploadcareFiles),
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
