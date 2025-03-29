import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { join } from "path";
import userController from "../../../src/controllers/user-controller";
import * as userService from "../../../src/services/user-service";

jest.mock("../../../src/middlewares/auth-guard", () => {
  return jest.fn((req: Request, res: Response, next: NextFunction) => {
    req.userId = "test-user-id";
    next();
  });
});
let app: express.Express;

describe("User Controller", () => {
  const token = jwt.sign({ id: "test-user-id" }, process.env.JWT_SECRET || "default-secret", {
    expiresIn: "1d",
  });

  beforeAll(() => {
    app = express();
    app.use(express.json());
    userController(app);
  });

  describe("GET /user", () => {
    test("Deve os dados do usuário autenticado", async () => {
      const fakeUser = {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        cpf: "12345678901",
        avatar: "avatar.jpg",
        xp: 100,
        level: 2,
        achievements: [],
      };
      jest.spyOn(userService, "getUserAuth").mockResolvedValue(fakeUser);

      const res = await request(app).get("/user").set("Authorization", `${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(fakeUser);
    });
  });

  describe("PUT /user/update", () => {
    test("Deve retorna o usuário atualizado", async () => {
      const updatedUser = {
        id: "test-user-id",
        name: "Updated User",
        email: "updated@example.com",
        cpf: "12345678901",
        avatar: "avatar.jpg",
        xp: 150,
        level: 3,
      };
      jest.spyOn(userService, "updateUser").mockResolvedValue(updatedUser);

      const res = await request(app)
        .put("/user/update")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated User", email: "updated@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedUser);
    });
  });

  describe("DELETE /user/deactivate", () => {
    test("Deve desativar a conta do usuário", async () => {
      const fakeUser = {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        cpf: "12345678901",
        avatar: "avatar.jpg",
        xp: 100,
        level: 2,
        updatedAt: new Date("2025-03-26 23:23:29.810"),
        deletedAt: null,
        createdAt: new Date("2025-03-26 23:23:29.810"),
      };
      jest.spyOn(userService, "deactivate").mockResolvedValue(fakeUser);

      const res = await request(app)
        .delete("/user/deactivate")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Conta desativada com sucesso." });
    });
  });

  describe("PUT /user/avatar", () => {
    test("Deve atualizar o avatar do usuário", async () => {
      const fakeAvatar = {
        avatar: "avatar.png",
      };

      jest.spyOn(userService, "updateAvatar").mockResolvedValue(fakeAvatar);
      const response = await request(app)
        .put("/user/avatar")
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", join(process.cwd(), "src", "tests", "mocks", "avatar.svg"));

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeAvatar);
    });
  });
});
