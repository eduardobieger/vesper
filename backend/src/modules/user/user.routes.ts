import type { FastifyInstance } from "fastify";
import type { UserController } from "./user.controller.js";

export async function userRoutes(
  fastify: FastifyInstance,
  options: {
    controller: UserController;
  },
) {
  fastify.get("/:id", options.controller.findById.bind(options.controller));
  fastify.post("/", options.controller.create.bind(options.controller));
}
