import { eq } from "drizzle-orm";
import type { Database } from "../../config/db.js";
import { projects } from "../../db/schema.js";
import { Project, type ProjectProps } from "./project.entity.js";
import type { IProjectRepository } from "./project.repository.interface.js";

export class ProjectRepository implements IProjectRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Project | null> {
    const result = (
      await this.db.select().from(projects).where(eq(projects.id, id)).limit(1)
    )[0];

    if (!result) return null;

    return new Project({
      id: result.id,
      name: result.name,
      ownerId: result.ownerId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async findByOwnerId(id: string): Promise<Project[] | null> {
    const result = await this.db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, id));

    if (!result) return null;

    const projectsArr = [];

    for (const project of result) {
      projectsArr.push(
        new Project({
          id: project.id,
          name: project.name,
          ownerId: project.ownerId,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        }),
      );
    }

    return projectsArr;
  }

  async save(
    project: Omit<ProjectProps, "createdAt" | "updatedAt">,
  ): Promise<Project | null> {
    const result = (
      await this.db
        .insert(projects)
        .values({
          id: project.id,
          name: project.name,
          ownerId: project.ownerId,
        })
        .returning()
    )[0];

    if (!result) return null;

    return new Project({
      id: result.id,
      name: result.name,
      ownerId: result.ownerId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(projects).where(eq(projects.id, id));
  }
}
