import { db } from '@/db';
import { notifications } from '@/db/schema';
import { and, eq, isNull, desc, lt, sql, or, type SQL } from 'drizzle-orm';
import { type NewNotification, type Notification } from './types';

export class NotificationRepository {
  async create(data: NewNotification): Promise<Notification> {
    const [inserted] = await db.insert(notifications).values(data).returning();
    return inserted;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Notification>,
  ): Promise<Notification | null> {
    const [updated] = await db
      .update(notifications)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return updated || null;
  }

  async findById(id: string): Promise<Notification | null> {
    const result = await db.query.notifications.findFirst({
      where: and(eq(notifications.id, id), isNull(notifications.deletedAt)),
    });
    return result || null;
  }

  async findRecentMatch(
    userId: string,
    deduplicationKey: string,
    timeWindowMs: number,
  ): Promise<Notification | null> {
    const since = new Date(Date.now() - timeWindowMs);
    const result = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.userId, userId),
        eq(notifications.deduplicationKey, deduplicationKey),
        isNull(notifications.deletedAt),
        isNull(notifications.readAt),
        sql`${notifications.createdAt} >= ${since}`,
      ),
      orderBy: desc(notifications.createdAt),
    });
    return result || null;
  }

  async findMany(filters: {
    userId: string;
    readStatus?: 'all' | 'unread' | 'read';
    archivedStatus?: 'active' | 'archived' | 'all';
    priority?: string;
    search?: string;
    limit?: number;
    offset?: number;
    cursor?: string; // ISO string of createdAt
  }): Promise<{ notifications: Notification[]; totalCount: number }> {
    const limit = filters.limit ?? 25;
    const conditions: SQL[] = [
      eq(notifications.userId, filters.userId),
      isNull(notifications.deletedAt),
    ];

    const deliverCondition = or(
      isNull(notifications.deliverAt),
      sql`${notifications.deliverAt} <= NOW()`,
    );
    if (deliverCondition) {
      conditions.push(deliverCondition);
    }

    if (filters.readStatus === 'unread') {
      conditions.push(isNull(notifications.readAt));
    } else if (filters.readStatus === 'read') {
      conditions.push(sql`${notifications.readAt} IS NOT NULL`);
    }

    if (filters.archivedStatus === 'archived') {
      conditions.push(sql`${notifications.archivedAt} IS NOT NULL`);
    } else if (filters.archivedStatus !== 'all') {
      // Default to active/unarchived
      conditions.push(isNull(notifications.archivedAt));
    }

    if (filters.priority && filters.priority !== 'all') {
      conditions.push(eq(notifications.priority, filters.priority));
    }

    if (filters.search?.trim()) {
      const searchTerm = `%${filters.search.trim()}%`;
      // Search in variables values by casting jsonb to text
      const searchOr = or(
        sql`CAST(${notifications.variables} AS TEXT) ILIKE ${searchTerm}`,
        sql`CAST(${notifications.templateId} AS TEXT) ILIKE ${searchTerm}`,
      );
      if (searchOr) {
        conditions.push(searchOr);
      }
    }

    if (filters.cursor) {
      conditions.push(lt(notifications.createdAt, new Date(filters.cursor)));
    }

    // Get total count of matching items (uncached query)
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(...conditions));
    const totalCount = Number(countResult?.count || 0);

    // Fetch paginated results
    const query = db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    if (filters.offset !== undefined && !filters.cursor) {
      query.offset(filters.offset);
    }

    const results = await query;
    return { notifications: results, totalCount };
  }

  async countUnread(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
          isNull(notifications.deletedAt),
          isNull(notifications.archivedAt),
          or(
            isNull(notifications.deliverAt),
            sql`${notifications.deliverAt} <= NOW()`,
          ),
        ),
      );
    return Number(result?.count || 0);
  }

  async markAsRead(ids: string[], userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ readAt: new Date(), updatedAt: new Date() })
      .where(and(sql`id IN ${ids}`, eq(notifications.userId, userId)));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ readAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
          isNull(notifications.deletedAt),
        ),
      );
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
  }

  async archive(
    id: string,
    userId: string,
    archiveState: boolean,
  ): Promise<void> {
    await db
      .update(notifications)
      .set({
        archivedAt: archiveState ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
  }

  async deleteExpired(): Promise<void> {
    // Delete notifications where expiresAt <= now or soft-deleted notifications > 30 days old
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await db
      .delete(notifications)
      .where(
        or(
          sql`${notifications.expiresAt} <= NOW()`,
          sql`${notifications.deletedAt} <= ${thirtyDaysAgo}`,
        ),
      );
  }

  async findScheduledPending(): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(
        and(
          isNull(notifications.readAt),
          isNull(notifications.deletedAt),
          sql`${notifications.deliverAt} <= NOW()`,
          sql`CAST(${notifications.delivery}->>'inApp' AS BOOLEAN) = TRUE`, // or whatever channel checks
        ),
      );
  }
}

export const notificationRepository = new NotificationRepository();
