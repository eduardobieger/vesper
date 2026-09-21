import type { FastifyInstance } from "fastify";
import type { ProjectController } from "./project.controller.js";

export async function projectRoutes(
  fastify: FastifyInstance,
  options: {
    controller: ProjectController;
  },
) {
  fastify.get(
    "/projects/:id",
    options.controller.findById.bind(options.controller),
  );

  fastify.post("/projects", options.controller.create.bind(options.controller));
}
