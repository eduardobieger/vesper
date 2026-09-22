import type { Task, TaskProps } from "./task.entity.js";

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  findByProjectId(id: string): Promise<Task[] | null>;
  save(task: Omit<TaskProps, "createdAt" | "updatedAt">): Promise<Task | null>;
  delete(id: string): Promise<void>;
}
