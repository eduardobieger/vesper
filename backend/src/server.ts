import Fastify from "fastify";
import { UserRepository } from "./modules/user/user.repository.js";
import { db } from "./config/db.js";
import { UserService } from "./modules/user/user.service.js";
import { UserController } from "./modules/user/user.controller.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { ProjectRepository } from "./modules/project/project.repository.js";
import { ProjectService } from "./modules/project/project.service.js";
import { ProjectController } from "./modules/project/project.controller.js";
import { projectRoutes } from "./modules/project/project.routes.js";

const PORT = 3000;

const fastify = Fastify({
  logger: true,
});

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const projectRepository = new ProjectRepository(db);
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

await fastify.register(userRoutes, {
  controller: userController,
});

await fastify.register(projectRoutes, {
  controller: projectController,
});

fastify.listen({ port: PORT, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${{ address }}`);
});
