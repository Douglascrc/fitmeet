import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import express, { json } from "express";
import authController from "../../auth/auth-controller";
import { singIn } from "../../auth/auth-service";

const mockedSingIn = singIn as jest.MockedFunction<typeof singIn>;

jest.mock("../../auth/auth-service", () => ({
  singIn: jest.fn(),
  registerService: jest.fn(),
}));

let server: express.Express;

beforeAll(() => {
  server = express();
  server.use(json());
  authController(server);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Controller", () => {
  describe("POST /auth/sign-in", () => {
    test("Deve retornar 400 quando o corpo da requisição está inválido", async () => {
      const response = await request(server).post("/auth/sign-in").send({
        password: "4892719401",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Required");
    });

    test("Should return 404 when user is not found", async () => {
      mockedSingIn.mockRejectedValue(new Error("E4"));

      const response = await request(server).post("/auth/sign-in").send({
        email: "douglas2@gmail.com",
        password: "4892719401",
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Usuário não encontrado");
    });

    test("Should return 401 when password is wrong", async () => {
      mockedSingIn.mockRejectedValue(new Error("E5"));

      const response = await request(server).post("/auth/sign-in").send({
        email: "douglas@gmail.com",
        password: "123457",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Senha incorreta");
    });

    test("Should return 200 when authentication is successful", async () => {
      mockedSingIn.mockResolvedValue({
        token: "abcd",
        id: "user-id",
        name: "Test User",
        email: "douglas@gmail.com",
        cpf: "12345678901",
        avatar: null,
        xp: 100,
        level: 1,
        achievements: [],
      });

      const response = await request(server).post("/auth/sign-in").send({
        email: "douglas@gmail.com",
        password: "123456",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: "abcd",
        id: "user-id",
        name: "Test User",
        email: "douglas@gmail.com",
        cpf: "12345678901",
        avatar: null,
        xp: 100,
        level: 1,
        achievements: [],
      });
    });
  });
});
