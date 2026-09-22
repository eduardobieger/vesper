import type { FastifyReply, FastifyRequest } from "fastify";
import type { TaskService } from "./task.service.js";
import type { TaskResponseDTO } from "./task.dto.js";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const task = await this.taskService.findById(id);

    if (!task) {
      return reply.status(404).send({
        message: "Task not found",
      });
    }

    const response: TaskResponseDTO = {
      id: task.props.id,
      title: task.props.title,
      projectId: task.props.projectId,
      ownerId: task.props.ownerId,
      status: task.props.status,
      priority: task.props.priority,
      deadline: task.props.deadline,
      createdAt: task.props.createdAt,
      updatedAt: task.props.updatedAt,
    };

    return reply.send(response);
  }

  async findByProjectId(request: FastifyRequest, reply: FastifyReply) {
    const { projectId } = request.query as { projectId: string };

    if (!projectId) {
      return reply.status(400).send({
        message: "projectId is required",
      });
    }

    const tasks = await this.taskService.findByProjectId(projectId);

    if (!tasks) {
      return reply.status(404).send({
        message: "Tasks not found",
      });
    }

    const responseTasks = [];

    for (const task of tasks) {
      const response: TaskResponseDTO = {
        id: task.props.id,
        title: task.props.title,
        projectId: task.props.projectId,
        ownerId: task.props.ownerId,
        status: task.props.status,
        priority: task.props.priority,
        deadline: task.props.deadline,
        createdAt: task.props.createdAt,
        updatedAt: task.props.updatedAt,
      };

      responseTasks.push(response);
    }

    return reply.send(responseTasks);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { title, projectId, ownerId, status, priority, deadline } =
      request.body as {
        title: string;
        projectId: string;
        ownerId: string;
        status: string;
        priority?: string;
        deadline?: Date;
      };

    try {
      const task = await this.taskService.create(
        title,
        projectId,
        ownerId,
        status,
        priority,
        deadline,
      );

      if (task) {
        const response: TaskResponseDTO = {
          id: task.props.id,
          title: task.props.title,
          projectId: task.props.projectId,
          ownerId: task.props.ownerId,
          status: task.props.status,
          priority: task.props.priority,
          deadline: task.props.deadline,
          createdAt: task.props.createdAt,
          updatedAt: task.props.updatedAt,
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
