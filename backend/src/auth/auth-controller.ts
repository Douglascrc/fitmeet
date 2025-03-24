import { Express, Router } from "express";
import { logIn, registerService } from "../services/user-service";

const router = Router();

const authController = (server: Express) => {
  router.post("/register", async (request, response) => {
    const newUser = await registerService(request.body);
    response.status(201).json(newUser);
  });

  router.post("/sign-in", async (request, response) => {
    try {
      const result = await logIn(request.body);
      response.status(200).json(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      switch (error.message) {
        case "E4":
          response.status(404).json({ error: "Usuário não encontrado" });
          break;
        case "E5":
          response.status(401).json({ error: "Senha incorreta" });
          break;
        default:
          response.status(500).json({ error: "Erro interno no servidor" });
      }
    }
  });

  server.use("/auth", router);
};

export default authController;
