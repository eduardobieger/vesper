import { describe, expect, it, vi } from "vitest";

describe("Projects", () => {
  it("should create and return a new project", async () => {
    const repoSave = vi.fn();

    const name = "Test Project";
    const ownerId = crypto.randomUUID();
    const projectId = crypto.randomUUID();

    repoSave.mockResolvedValue({
      props: {
        id: projectId,
        name: name,
        ownerId: ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const project = await repoSave();
    expect(project.props.id).toBe(projectId);
  });
});
