import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "./user.service.js";
import type { UserResponseDTO } from "./user.dto.js";

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

    const response: UserResponseDTO = {
      id: user.props.id,
      firstName: user.props.firstName,
      lastName: user.props.lastName,
      email: user.props.email,
      createdAt: user.props.createdAt,
      updatedAt: user.props.updatedAt,
    };

    return reply.send(response);
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

      if (user) {
        const response: UserResponseDTO = {
          id: user.props.id,
          firstName: user.props.firstName,
          lastName: user.props.lastName,
          email: user.props.email,
          createdAt: user.props.createdAt,
          updatedAt: user.props.updatedAt,
        };

        return reply.status(201).send(response);
      }
    } catch (err) {
      return reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
}
