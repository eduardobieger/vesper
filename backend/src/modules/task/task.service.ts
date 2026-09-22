import type { Task, TaskProps } from "./task.entity.js";
import type { ITaskRepository } from "./task.repository.interface.js";

export class TaskService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async findById(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async findByProjectId(id: string): Promise<Task[] | null> {
    return await this.taskRepository.findByProjectId(id);
  }

  async create(
    title: string,
    projectId: string,
    ownerId: string,
    status: string,
    priority?: string,
    deadline?: Date,
  ): Promise<Task | null> {
    const newTask: Omit<TaskProps, "createdAt" | "updatedAt"> = {
      id: crypto.randomUUID(),
      title: title,
      projectId: projectId,
      ownerId: ownerId,
      status: status,
      priority: priority ?? null,
      deadline: deadline ?? null,
    };

    const task = await this.taskRepository.save(newTask);
    return task;
  }

  async delete(id: string): Promise<void> {
    return await this.taskRepository.delete(id);
  }
}
