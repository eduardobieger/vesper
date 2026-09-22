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
import { TaskRepository } from "./modules/task/task.repository.js";
import { TaskService } from "./modules/task/task.service.js";
import { TaskController } from "./modules/task/task.controller.js";
import { taskRoutes } from "./modules/task/task.routes.js";

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

const taskRepository = new TaskRepository(db);
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

await fastify.register(userRoutes, {
  prefix: "/users",
  controller: userController,
});

await fastify.register(projectRoutes, {
  prefix: "/projects",
  controller: projectController,
});

await fastify.register(taskRoutes, {
  prefix: "/tasks",
  controller: taskController,
});

fastify.listen({ port: PORT, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${{ address }}`);
});
