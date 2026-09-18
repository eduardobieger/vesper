import { argon2 } from "node:crypto";
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

    try {
      argon2("argon2id", parameters, (err, derivedKey) => {
        if (err) throw err;

        const newUser: Omit<UserProps, "createdAt" | "updatedAt"> = {
          id: crypto.randomUUID(),
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: derivedKey.toString(),
        };

        return this.userRepository.save(newUser);
      });
    } catch (err) {
      throw err;
    }

    return null;
  }
}
