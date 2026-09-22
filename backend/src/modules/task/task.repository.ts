import { eq } from "drizzle-orm";
import type { Database } from "../../config/db.js";
import { tasks } from "../../db/schema.js";
import { Task, type TaskProps } from "./task.entity.js";
import type { ITaskRepository } from "./task.repository.interface.js";

export class TaskRepository implements ITaskRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Task | null> {
    const result = (
      await this.db.select().from(tasks).where(eq(tasks.id, id)).limit(1)
    )[0];

    if (!result) return null;

    return new Task({
      id: result.id,
      title: result.title,
      projectId: result.projectId,
      ownerId: result.ownerId,
      status: result.status,
      priority: result.priority,
      deadline: result.deadline,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async findByProjectId(id: string): Promise<Task[] | null> {
    const result = await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, id));

    if (!result) return null;

    const tasksArr = [];

    for (const task of result) {
      tasksArr.push(
        new Task({
          id: task.id,
          title: task.title,
          projectId: task.projectId,
          ownerId: task.ownerId,
          status: task.status,
          priority: task.priority,
          deadline: task.deadline,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        }),
      );
    }

    return tasksArr;
  }

  async save(
    task: Omit<TaskProps, "createdAt" | "updatedAt">,
  ): Promise<Task | null> {
    const result = (
      await this.db
        .insert(tasks)
        .values({
          id: task.id,
          title: task.title,
          projectId: task.projectId,
          ownerId: task.ownerId,
          status: task.status,
          priority: task.priority,
          deadline: task.deadline,
        })
        .returning()
    )[0];

    if (!result) return null;

    return new Task({
      id: result.id,
      title: result.title,
      projectId: result.projectId,
      ownerId: result.ownerId,
      status: result.status,
      priority: result.priority,
      deadline: result.deadline,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tasks).where(eq(tasks.id, id));
  }
}
