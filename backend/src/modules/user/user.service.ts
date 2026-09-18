import { argon2Sync } from "node:crypto";
import { config } from "../../config/env.js";
import type { User, UserProps } from "./user.entity.js";
import type { IUserRepository } from "./user.repository.interface.js";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User | null> {
    const parameters = {
      message: password,
      nonce: config.argon2Salt,
      parallelism: 4,
      tagLength: 64,
      memory: 65536,
      passes: 3,
    };

    const derivedKey = argon2Sync("argon2id", parameters);

    if (!derivedKey) return null;

    const newUser: Omit<UserProps, "createdAt" | "updatedAt"> = {
      id: crypto.randomUUID(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: derivedKey.toString("hex"),
    };

    const user = await this.userRepository.save(newUser);
    return user;
  }
}
