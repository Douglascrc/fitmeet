import request from "supertest";
import express, { json } from "express";
import authController from "../../auth/auth-controller";
import { registerService, singIn } from "../../auth/auth-service";

const mockedSingIn = singIn as jest.MockedFunction<typeof singIn>;
const mockedRegisterService = registerService as jest.MockedFunction<typeof registerService>;

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
    test("Deve retornar 400 quando o corpo da requisição está imcompleto", async () => {
      const response = await request(server).post("/auth/sign-in").send({
        password: "4892719401",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Informe os campos obrigatórios corretamente.");
    });

    test("Deve retornar 404 quando o usuário não for encontrado", async () => {
      mockedSingIn.mockRejectedValue(new Error("E4"));

      const response = await request(server).post("/auth/sign-in").send({
        email: "douglas2@gmail.com",
        password: "4892719401",
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Usuário não encontrado");
    });

    test("Deve retornar 404 quando a senha estiver incorreta", async () => {
      mockedSingIn.mockRejectedValue(new Error("E5"));

      const response = await request(server).post("/auth/sign-in").send({
        email: "douglas@gmail.com",
        password: "123457",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Senha incorreta");
    });

    test("Deve retornar 200 quando a autenticação for bem sucedida", async () => {
      mockedSingIn.mockResolvedValue({
        token: "abcd",
        id: "user-id",
        name: "Test User",
        email: "douglas@gmail.com",
        cpf: "12345678901",
        avatar: "avatar.jpg",
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

  describe("POST /auth/register", () => {
    test("Deve retornar 409 quando o e-mail ou CPF já estiverem em uso", async () => {
      mockedRegisterService.mockRejectedValue(new Error("E3"));
      const response = await request(server).post("/auth/register").send({
        name: "Douglas",
        email: "douglas@gmail.com",
        cpf: "12345678901",
        password: "123456",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("O e-mail ou CPF informado já pertence a outro usuário.");
    });

    test("Deve retornar 201 quando o usuário for registrado com sucesso", async () => {
      mockedRegisterService.mockResolvedValue({
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        cpf: "12345678901",
        avatar: "avatar.jpg",
        xp: 100,
        level: 2,
        deletedAt: null,
        updatedAt: new Date("2025-03-26 23:23:29.810"),
        createdAt: new Date("2025-03-26 23:23:29.810"),
      });
      const response = await request(server).post("/auth/register").send({
        name: "Douglas",
        email: "douglas@gmail.com",
        cpf: "12345678901",
        password: "123456",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Usuário criado com sucesso");
    });
  });
});
