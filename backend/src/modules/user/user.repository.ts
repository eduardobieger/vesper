import type { Database } from "../../config/db.js";
import type { IUserRepository } from "./user.repository.interface.js";
import { User, type UserProps } from "./user.entity.js";
import { eq } from "drizzle-orm";
import { users } from "../../db/schema.js";

export class UserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<User | null> {
    const result = (
      await this.db.select().from(users).where(eq(users.id, id)).limit(1)
    )[0];

    if (!result) return null;

    return new User({
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      password: result.passwordHash,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = (
      await this.db.select().from(users).where(eq(users.email, email)).limit(1)
    )[0];

    if (!result) return null;

    return new User({
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      password: result.passwordHash,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async save(
    user: Omit<UserProps, "createdAt" | "updatedAt">,
  ): Promise<User | null> {
    const result = (
      await this.db
        .insert(users)
        .values({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          passwordHash: user.password,
        })
        .returning()
    )[0];

    if (!result) return null;

    return new User({
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      password: result.passwordHash,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
