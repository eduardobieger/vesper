import type { FastifyInstance } from "fastify";
import type { AuthController } from "./auth.controller.js";

export async function authRoutes(
  fastify: FastifyInstance,
  options: {
    controller: AuthController;
  },
) {
  fastify.post("/login", options.controller.login.bind(options.controller));
}
