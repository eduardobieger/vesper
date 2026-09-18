import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "./user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const user = await this.userService.findById(id);

    if (!user) {
      return reply.status(404).send({
        message: "User not found",
      });
    }

    return reply.send(user);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { firstName, lastName, email, password } = request.body as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };

    try {
      const user = await this.userService.create(
        firstName,
        lastName,
        email,
        password,
      );

      return reply.send(user);
    } catch (err) {
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
}
