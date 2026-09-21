import type { Project, ProjectProps } from "./project.entity.js";
import type { IProjectRepository } from "./project.repository.interface.js";

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async findById(id: string): Promise<Project | null> {
    return await this.projectRepository.findById(id);
  }

  async findByOwnerId(id: string): Promise<Project[] | null> {
    return await this.projectRepository.findByOwnerId(id);
  }

  async create(name: string, ownerId: string): Promise<Project | null> {
    const newProject: Omit<ProjectProps, "createdAt" | "updatedAt"> = {
      id: crypto.randomUUID(),
      name: name,
      ownerId: ownerId,
    };

    const project = await this.projectRepository.save(newProject);
    return project;
  }

  async delete(id: string): Promise<void> {
    return await this.projectRepository.delete(id);
  }
}
