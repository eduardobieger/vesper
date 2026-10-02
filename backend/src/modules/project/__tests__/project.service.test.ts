import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectService } from "../project.service.js";
import type { IProjectRepository } from "../project.repository.interface.js";

describe("Projects", () => {
  let mockProjectRepo: ReturnType<typeof vi.mocked<IProjectRepository>>;

  beforeEach(() => {
    mockProjectRepo = vi.mocked<IProjectRepository>({
      findById: vi.fn(),
      findByOwnerId: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    });
  });

  it("should find a project by id and return it", async () => {
    const svc = new ProjectService(mockProjectRepo);
    const projectId = crypto.randomUUID();

    mockProjectRepo.findById.mockResolvedValue({
      props: {
        id: projectId,
        name: "test-123",
        ownerId: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const project = await svc.findById(projectId);

    expect(mockProjectRepo.findById).toHaveBeenCalledOnce();
    expect(mockProjectRepo.findById).toHaveBeenCalledWith(projectId);
    expect(project).toMatchObject({
      props: expect.objectContaining({ id: projectId, name: "test-123" }),
    });
  });

  it("should return null when project is not found", async () => {
    const svc = new ProjectService(mockProjectRepo);
    mockProjectRepo.findById.mockResolvedValue(null);

    const project = await svc.findById("non-existent-id");

    expect(project).toBeNull();
    expect(mockProjectRepo.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should throw when projectId is empty", async () => {
    const svc = new ProjectService(mockProjectRepo);

    await expect(svc.findById("")).rejects.toThrow("id is empty");
  });

  it("should find all projects by ownerId and return them", async () => {
    const svc = new ProjectService(mockProjectRepo);
    const ownerId = crypto.randomUUID();

    mockProjectRepo.findByOwnerId.mockResolvedValue([
      {
        props: {
          id: crypto.randomUUID(),
          name: "project-1",
          ownerId: ownerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        props: {
          id: crypto.randomUUID(),
          name: "project-2",
          ownerId: ownerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ]);

    const projects = await svc.findByOwnerId(ownerId);

    expect(mockProjectRepo.findByOwnerId).toHaveBeenCalledWith(ownerId);
    expect(projects).toHaveLength(2);
    expect(projects?.[0]?.props.ownerId).toBe(ownerId);
  });

  it("should return empty when owner has no projects", async () => {
    const svc = new ProjectService(mockProjectRepo);
    mockProjectRepo.findByOwnerId.mockResolvedValue([]);

    const projects = await svc.findByOwnerId("onwer-1");

    expect(projects).toEqual([]);
  });

  it("should throw when ownerId is empty", async () => {
    const svc = new ProjectService(mockProjectRepo);

    await expect(svc.findByOwnerId("")).rejects.toThrow("id is empty");
  });

  it("should create and return a new project", async () => {
    const svc = new ProjectService(mockProjectRepo);

    const name = "Test Project";
    const ownerId = crypto.randomUUID();

    mockProjectRepo.save.mockImplementation(async (project) => ({
      props: {
        ...project,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));

    const project = await svc.create(name, ownerId);

    expect(mockProjectRepo.save).toHaveBeenCalledOnce();
    expect(mockProjectRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name: name,
        ownerId: ownerId,
      }),
    );
    expect(project).toMatchObject({
      props: expect.objectContaining({
        id: expect.any(String),
        name: name,
        ownerId: ownerId,
      }),
    });
  });

  it.each([
    { name: "", ownerId: "some-owner-id", label: "empty name" },
    { name: "test-name", ownerId: "", label: "empty ownerId" },
    { name: "", ownerId: "", label: "empty name and ownerId" },
  ])("should throw when $label", async ({ name, ownerId }) => {
    const svc = new ProjectService(mockProjectRepo);

    await expect(svc.create(name, ownerId)).rejects.toThrow(
      "name or ownerId is empty",
    );

    expect(mockProjectRepo.save).not.toHaveBeenCalled();
  });
});
