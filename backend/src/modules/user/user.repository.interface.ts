import type { User, UserProps } from "./user.entity.js";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: Omit<UserProps, "createdAt" | "updatedAt">): Promise<User | null>;
  delete(id: string): Promise<void>;
}
