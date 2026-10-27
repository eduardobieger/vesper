import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IUserRepository } from "../user.repository.interface.js";
import { UserService } from "../user.service.js";

describe("Users", () => {
  let mockUserRepo: ReturnType<typeof vi.mocked<IUserRepository>>;

  beforeEach(() => {
    mockUserRepo = vi.mocked<IUserRepository>({
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    });
  });

  it("should find a user by id and return it", async () => {
    const svc = new UserService(mockUserRepo);
    const userId = crypto.randomUUID();

    mockUserRepo.findById.mockResolvedValue({
      props: {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "test@mail.com",
        password: "123qwe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const user = await svc.findById(userId);

    expect(mockUserRepo.findById).toHaveBeenCalledOnce();
    expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
    expect(user).toMatchObject({
      props: expect.objectContaining({
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "test@mail.com",
        password: "123qwe",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    });
  });

  it("should return null when user is not found by id", async () => {
    const svc = new UserService(mockUserRepo);
    mockUserRepo.findById.mockResolvedValue(null);

    const user = await svc.findById("non-existent-id");

    expect(user).toBeNull();
    expect(mockUserRepo.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should throw when userId is empty", async () => {
    const svc = new UserService(mockUserRepo);

    await expect(svc.findById("")).rejects.toThrow("id is empty");
  });

  it("should find a user by email and return it", async () => {
    const svc = new UserService(mockUserRepo);
    const userId = crypto.randomUUID();
    const userEmail = "test@mail.com";

    mockUserRepo.findByEmail.mockResolvedValue({
      props: {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: userEmail,
        password: "123qwe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const user = await svc.findByEmail(userEmail);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledOnce();
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(user).toMatchObject({
      props: expect.objectContaining({
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: userEmail,
        password: "123qwe",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    });
  });

  it("should return null when user is not found by email", async () => {
    const svc = new UserService(mockUserRepo);
    mockUserRepo.findByEmail.mockResolvedValue(null);

    const user = await svc.findByEmail("non-existent-email");

    expect(user).toBeNull();
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("non-existent-email");
  });

  it("should throw when user email is empty", async () => {
    const svc = new UserService(mockUserRepo);

    await expect(svc.findByEmail("")).rejects.toThrow("email is empty");
  });

  it("should create and return a new user", async () => {
    const svc = new UserService(mockUserRepo);
  });
});
