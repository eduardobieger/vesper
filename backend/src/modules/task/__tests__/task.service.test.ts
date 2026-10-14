import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ITaskRepository } from "../task.repository.interface.js";
import { TaskService } from "../task.service.js";

describe("Tasks", () => {
  let mockTaskRepo: ReturnType<typeof vi.mocked<ITaskRepository>>;

  beforeEach(() => {
    mockTaskRepo = vi.mocked<ITaskRepository>({
      findById: vi.fn(),
      findByProjectId: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    });
  });

  it("should find a task by id and return it", async () => {
    const svc = new TaskService(mockTaskRepo);
    const taskId = crypto.randomUUID();

    mockTaskRepo.findById.mockResolvedValue({
      props: {
        id: taskId,
        title: "test-123",
        projectId: crypto.randomUUID(),
        ownerId: crypto.randomUUID(),
        status: "pending",
        priority: null,
        deadline: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const task = await svc.findById(taskId);

    expect(mockTaskRepo.findById).toHaveBeenCalledOnce();
    expect(mockTaskRepo.findById).toHaveBeenCalledWith(taskId);
    expect(task).toMatchObject({
      props: expect.objectContaining({
        id: taskId,
        title: "test-123",
        status: "pending",
        deadline: null,
      }),
    });
  });

  it("should return null when task is not found", async () => {
    const svc = new TaskService(mockTaskRepo);
    mockTaskRepo.findById.mockResolvedValue(null);

    const task = await svc.findById("non-existent-id");

    expect(task).toBeNull();
    expect(mockTaskRepo.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should throw when taskId is empty", async () => {
    const svc = new TaskService(mockTaskRepo);

    await expect(svc.findById("")).rejects.toThrow("id is empty");
  });

  it("should find all tasks by projectId and return them", async () => {
    const svc = new TaskService(mockTaskRepo);
    const projectId = crypto.randomUUID();

    mockTaskRepo.findByProjectId.mockResolvedValue([
      {
        props: {
          id: crypto.randomUUID(),
          title: "task-1",
          projectId: projectId,
          ownerId: crypto.randomUUID(),
          status: "pending",
          priority: null,
          deadline: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        props: {
          id: crypto.randomUUID(),
          title: "task-2",
          projectId: projectId,
          ownerId: crypto.randomUUID(),
          status: "completed",
          priority: "high",
          deadline: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ]);

    const tasks = await svc.findByProjectId(projectId);

    expect(mockTaskRepo.findByProjectId).toHaveBeenCalledWith(projectId);
    expect(tasks).toHaveLength(2);
    expect(tasks?.[0]?.props.projectId).toBe(projectId);
  });

  it("should return empty when project has no tasks", async () => {
    const svc = new TaskService(mockTaskRepo);
    mockTaskRepo.findByProjectId.mockResolvedValue([]);

    const tasks = await svc.findByProjectId("project-1");

    expect(tasks).toEqual([]);
  });

  it("should throw when projectId is empty", async () => {
    const svc = new TaskService(mockTaskRepo);

    await expect(svc.findByProjectId("")).rejects.toThrow("id is empty");
  });

  it("should create and return a new task", async () => {
    const svc = new TaskService(mockTaskRepo);

    const title = "Test Task";
    const projectId = crypto.randomUUID();
    const ownerId = crypto.randomUUID();
    const status = "pending";

    mockTaskRepo.save.mockImplementation(async (task) => ({
      props: {
        ...task,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));

    const task = await svc.create(title, projectId, ownerId, status);

    expect(mockTaskRepo.save).toHaveBeenCalledOnce();
    expect(mockTaskRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        title: title,
        projectId: projectId,
        ownerId: ownerId,
        status: status,
        priority: null,
        deadline: null,
      }),
    );
    expect(task).toMatchObject({
      props: expect.objectContaining({
        id: expect.any(String),
        title: title,
        projectId: projectId,
        ownerId: ownerId,
        status: status,
        priority: null,
        deadline: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    });
  });

  it.each([
    {
      title: "",
      projectId: "some-project-id",
      ownerId: "some-owner-id",
      status: "test-status",
      label: "empty title",
    },
    {
      title: "test-title",
      projectId: "",
      ownerId: "some-owner-id",
      status: "test-status",
      label: "empty projectId",
    },
    {
      title: "test-title",
      projectId: "some-project-id",
      ownerId: "",
      status: "test-status",
      label: "empty ownerId",
    },
    {
      title: "test-title",
      projectId: "some-project-id",
      ownerId: "some-owner-id",
      status: "",
      label: "empty status",
    },
  ])(
    "should throw when $label",
    async ({ title, projectId, ownerId, status }) => {
      const svc = new TaskService(mockTaskRepo);

      await expect(
        svc.create(title, projectId, ownerId, status),
      ).rejects.toThrow("invalid request body");

      expect(mockTaskRepo.save).not.toHaveBeenCalled();
    },
  );

  it("should delete without return", async () => {
    const svc = new TaskService(mockTaskRepo);
    const taskId = crypto.randomUUID();

    await svc.delete(taskId);

    expect(mockTaskRepo.delete).toHaveBeenCalledWith(taskId);
  });

  it("should throw when id is empty", async () => {
    const svc = new TaskService(mockTaskRepo);

    await expect(svc.delete("")).rejects.toThrow("id is empty");
  });
});
