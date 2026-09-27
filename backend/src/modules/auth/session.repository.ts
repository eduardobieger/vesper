import { eq } from "drizzle-orm";
import type { Database } from "../../config/db.js";
import { sessions } from "../../db/schema.js";
import { Session, type SessionProps } from "./session.entity.js";
import type { ISessionRepository } from "./session.repository.interface.js";

export class SessionRepository implements ISessionRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Session | null> {
    const result = (
      await this.db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
    )[0];

    if (!result) return null;

    return new Session({
      id: result.id,
      userId: result.userId,
      createdAt: result.createdAt,
      expiresAt: result.expiresAt,
    });
  }

  async save(
    session: Omit<SessionProps, "createdAt">,
  ): Promise<Session | null> {
    const result = (
      await this.db
        .insert(sessions)
        .values({
          id: session.id,
          userId: session.userId,
          expiresAt: session.expiresAt,
        })
        .returning()
    )[0];

    if (!result) return null;

    return new Session({
      id: result.id,
      userId: result.userId,
      createdAt: result.createdAt,
      expiresAt: result.expiresAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.id, id));
  }
}
