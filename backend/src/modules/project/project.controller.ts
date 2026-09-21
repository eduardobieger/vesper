import type { FastifyReply, FastifyRequest } from "fastify";
import type { ProjectService } from "./project.service.js";
import type { ProjectResponseDTO } from "./project.dto.js";

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const project = await this.projectService.findById(id);

    if (!project) {
      return reply.status(404).send({
        message: "Project not found",
      });
    }

    const response: ProjectResponseDTO = {
      id: project.props.id,
      name: project.props.name,
      ownerId: project.props.ownerId,
      createdAt: project.props.createdAt,
      updatedAt: project.props.updatedAt,
    };

    return reply.send(response);
  }

  async findByOwnerId(request: FastifyRequest, reply: FastifyReply) {
    const { ownerId } = request.query as { ownerId: string };

    if (!ownerId) {
      return reply.status(400).send({
        message: "ownerId is required",
      });
    }

    const projects = await this.projectService.findByOwnerId(ownerId);

    if (!projects) {
      return reply.status(404).send({
        message: "Projects not found",
      });
    }

    const responseProjects = [];

    for (const project of projects) {
      const response: ProjectResponseDTO = {
        id: project.props.id,
        name: project.props.name,
        ownerId: project.props.ownerId,
        createdAt: project.props.createdAt,
        updatedAt: project.props.updatedAt,
      };

      responseProjects.push(response);
    }

    return reply.send(responseProjects);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { name, ownerId } = request.body as {
      name: string;
      ownerId: string;
    };

    try {
      const project = await this.projectService.create(name, ownerId);

      if (project) {
        const response: ProjectResponseDTO = {
          id: project.props.id,
          name: project.props.name,
          ownerId: project.props.ownerId,
          createdAt: project.props.createdAt,
          updatedAt: project.props.updatedAt,
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
