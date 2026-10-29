import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IUserRepository } from "../user.repository.interface.js";
import { UserService } from "../user.service.js";
import { argon2Sync } from "node:crypto";

vi.mock("node:crypto", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:crypto")>();
  return {
    ...actual,
    argon2Sync: vi.fn(() => Buffer.from("fakehash")),
  };
});

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

    const firstName = "John";
    const lastName = "Doe";
    const email = "johndoe@mail.com";
    const password = "secretpassword123";

    mockUserRepo.save.mockImplementation(async (user) => ({
      props: {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));

    const user = await svc.create(firstName, lastName, email, password);

    expect(mockUserRepo.save).toHaveBeenCalledOnce();
    expect(mockUserRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: "66616b6568617368",
      }),
    );
    expect(user).toMatchObject({
      props: expect.objectContaining({
        id: expect.any(String),
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: "66616b6568617368",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    });
  });

  it.each([
    {
      firstName: "",
      lastName: "Doe",
      email: "johndoe@mail.com",
      password: "secretpassword123",
      label: "empty first name",
    },
    {
      firstName: "John",
      lastName: "",
      email: "johndoe@mail.com",
      password: "secretpassword123",
      label: "empty last name",
    },
    {
      firstName: "John",
      lastName: "Doe",
      email: "",
      password: "secretpassword123",
      label: "empty email",
    },
    {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@mail.com",
      password: "",
      label: "empty password",
    },
  ])(
    "should throw when $label",
    async ({ firstName, lastName, email, password }) => {
      const svc = new UserService(mockUserRepo);

      await expect(
        svc.create(firstName, lastName, email, password),
      ).rejects.toThrow("invalid request body");

      expect(mockUserRepo.save).not.toHaveBeenCalled();
    },
  );
});

describe("checkPassword", () => {
  let mockUserRepo: ReturnType<typeof vi.mocked<IUserRepository>>;

  beforeEach(() => {
    mockUserRepo = vi.mocked<IUserRepository>({
      findById: vi.fn(),
      findByEmail: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    });
  });

  // Buffer.from("fakehash").toString("hex");
  const FAKE_HASH_HEX = "66616b6568617368";

  const baseUser = (
    overrides: Partial<{ password: string; id: string }> = {},
  ) => ({
    props: {
      id: overrides.id ?? crypto.randomUUID(),
      firstName: "John",
      lastName: "Doe",
      email: "john@mail.com",
      password: overrides.password ?? FAKE_HASH_HEX,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  it("should return true when the password matches the stores hash", async () => {
    const svc = new UserService(mockUserRepo);
    const userId = crypto.randomUUID();
    mockUserRepo.findById.mockResolvedValue(baseUser({ id: userId }));

    const result = await svc.checkPassword(userId, "any-password");

    expect(result).toBe(true);
    expect(mockUserRepo.findById).toHaveBeenCalledOnce();
    expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
  });

  it("should return false when the password does not match the stored hash", async () => {
    const svc = new UserService(mockUserRepo);
    const userId = crypto.randomUUID();
    mockUserRepo.findById.mockResolvedValue(
      baseUser({ id: userId, password: "deadbeef" }), // != FAKE_HASH_HEX
    );

    const result = await svc.checkPassword(userId, "wrong-password");

    expect(result).toBe(false);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
  });

  it("should return false when the user is not found", async () => {
    const svc = new UserService(mockUserRepo);
    mockUserRepo.findById.mockResolvedValue(null);

    const result = await svc.checkPassword("non-existent-id", "any-password");

    expect(result).toBe(false);
    expect(mockUserRepo.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should throw when argon2Sync fails to derive a key", async () => {
    const svc = new UserService(mockUserRepo);

    vi.mocked(argon2Sync).mockReturnValueOnce(undefined as unknown as Buffer);

    await expect(svc.checkPassword("any-id", "any-password")).rejects.toThrow(
      "Error generating key",
    );

    expect(mockUserRepo.findById).not.toHaveBeenCalled();
  });
});
