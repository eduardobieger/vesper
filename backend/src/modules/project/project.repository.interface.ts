import type { Project, ProjectProps } from "./project.entity.js";

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findByOwnerId(id: string): Promise<Project[] | null>;
  save(
    project: Omit<ProjectProps, "createdAt" | "updatedAt">,
  ): Promise<Project | null>;
  delete(id: string): Promise<void>;
}
