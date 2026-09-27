import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const token = await this.authService.login(email, password);

    if (!token) {
      return reply.status(400).send({
        message: "Bad Request",
      });
    }

    return reply.send(token);
  }
}
