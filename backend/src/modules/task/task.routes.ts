import type { FastifyInstance } from "fastify";
import type { TaskController } from "./task.controller.js";

export async function taskRoutes(
  fastify: FastifyInstance,
  options: {
    controller: TaskController;
  },
) {
  fastify.get("/:id", options.controller.findById.bind(options.controller));

  fastify.get("/", options.controller.findByProjectId.bind(options.controller));

  fastify.post("/", options.controller.create.bind(options.controller));
}
