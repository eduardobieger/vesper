import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectService } from "../project.service.js";
import type { IProjectRepository } from "../project.repository.interface.js";

let mockProjectRepo: ReturnType<typeof vi.mocked<IProjectRepository>>;

beforeEach(() => {
  mockProjectRepo = vi.mocked<IProjectRepository>({
    findById: vi.fn(),
    findByOwnerId: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  });
});

describe("Projects", () => {
  it("should create and return a new project", async () => {
    const svc = new ProjectService(mockProjectRepo);

    const name = "Test Project";
    const ownerId = crypto.randomUUID();
    const projectId = crypto.randomUUID();

    mockProjectRepo.save.mockResolvedValue({
      props: {
        id: projectId,
        name: name,
        ownerId: ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const project = await svc.create(name, ownerId);

    expect(mockProjectRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: name, ownerId: ownerId }),
    );
    expect(project).not.toBeNull();
    expect(project?.props.id).toBe(projectId);
    expect(project?.props.name).toBe(name);
    expect(project?.props.ownerId).toBe(ownerId);
  });
});
