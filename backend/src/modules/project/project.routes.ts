import type { FastifyInstance } from "fastify";
import type { ProjectController } from "./project.controller.js";

export async function projectRoutes(
  fastify: FastifyInstance,
  options: {
    controller: ProjectController;
  },
) {
  fastify.get("/:id", options.controller.findById.bind(options.controller));

  fastify.get("/", options.controller.findByOwnerId.bind(options.controller));

  fastify.post("/", options.controller.create.bind(options.controller));
}
