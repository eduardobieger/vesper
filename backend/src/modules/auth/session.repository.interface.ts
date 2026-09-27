import type { Session, SessionProps } from "./session.entity.js";

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;
  save(session: Omit<SessionProps, "createdAt">): Promise<Session | null>;
  delete(id: string): Promise<void>;
}
