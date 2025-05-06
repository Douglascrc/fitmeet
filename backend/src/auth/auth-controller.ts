import { Express, Router } from "express";
import { singIn, registerService } from "../auth/auth-service";
import validateRequestBody from "../middlewares/request-validator";
import authValidation from "../validations/auth-validation";
import userValidation from "../validations/user-validation";

/* eslint-disable @typescript-eslint/no-explicit-any */
const authController = (server: Express) => {
  const router = Router();

  router.post("/register", validateRequestBody(userValidation), async (request, response) => {
    try {
      const newUser = await registerService(request.body);
      if (newUser) {
        response.status(201).json({ message: "Usuário criado com sucesso" });
        return;
      }
    } catch (error: any) {
      switch (error.message) {
        case "E3":
          response.status(409).json({
            error: "O e-mail ou CPF informado já pertence a outro usuário.",
          });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
      }
    }
  });

  router.post("/sign-in", validateRequestBody(authValidation), async (request, response) => {
    try {
      const result = await singIn(request.body);
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E4":
          response.status(404).json({ error: "Usuário não encontrado" });
          break;
        case "E5":
          response.status(401).json({ error: "Senha incorreta" });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  server.use("/auth", router);
};

export default authController;
