import type { FastifyInstance } from "fastify";
import type { UserController } from "./user.controller.js";

export async function userRoutes(
  fastify: FastifyInstance,
  options: {
    controller: UserController;
  },
) {
  fastify.get(
    "/users/:id",
    options.controller.findById.bind(options.controller),
  );
  fastify.post("/users", options.controller.create.bind(options.controller));
}
