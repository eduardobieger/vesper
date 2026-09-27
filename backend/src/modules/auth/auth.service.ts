import type { UserService } from "../user/user.service.js";
import type { ISessionRepository } from "./session.repository.interface.js";
import { randomBytes, createHash } from "node:crypto";

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async login(email: string, password: string): Promise<string | null> {
    // Check login info
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const correctPassword = await this.userService.checkPassword(
      user.props.id,
      password,
    );

    if (correctPassword === false) return null;

    // Generate session token
    const sessionToken = randomBytes(32).toString("base64url");
    const sessionTokenHash = createHash("sha256")
      .update(sessionToken)
      .digest("hex");

    try {
      await this.sessionRepository.save({
        id: sessionTokenHash,
        userId: user.props.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } catch (err) {
      console.error(err);
      return null;
    }

    return sessionToken;
  }
}
