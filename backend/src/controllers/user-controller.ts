import { Express, Router } from "express";
import authGuard from "../middlewares/auth-guard";
import {
  deactivate,
  definePreferences,
  getPreferences,
  getUserAuth,
  updateAvatar,
  updateUser,
} from "../services/user-service";
import validateRequestBody from "../middlewares/request-validator";
import updateValidation from "../../validations/update-validation";
import upload from "../multer/multer";

/* eslint-disable @typescript-eslint/no-explicit-any */
const userController = (server: Express) => {
  const router = Router();
  router.use(authGuard);

  router.get("/", async (request, response) => {
    try {
      const userAuth = await getUserAuth(request.userId);
      response.status(200).json(userAuth);
    } catch (error: any) {
      switch (error.message) {
        case "E6":
          response.status(403).json({
            error: "Esta conta foi desativada e não pode ser utilizada.",
          });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.get("/preferences", async (request, response) => {
    try {
      const preferences = await getPreferences(request.userId);
      response.status(200).json(preferences);
    } catch (error: any) {
      switch (error.message) {
        case "E4":
          response.status(400).json({
            error: "Usuário não encontrado.",
          });
          break;
        case "E6":
          response.status(403).json({
            error: "Esta conta foi desativada e não pode ser utilizada.",
          });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
      }
    }
  });

  router.post("/preferences/define", async (request, response) => {
    try {
      const validActivityTypes = await definePreferences(request.userId, request.body);
      if (validActivityTypes) {
        response.status(200).json({
          message: "Preferências atualizadas com sucesso!",
          preferences: validActivityTypes,
        });
        return;
      }
    } catch (error: any) {
      switch (error.message) {
        case "Id":
          response.status(400).json({ error: "Um ou mais IDs informados são inválidos." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
          return;
      }
    }
  });

  router.put("/avatar", upload.single("avatar"), async (request, response) => {
    try {
      if (!request.file) {
        response.status(400).json({ error: "Imagem é obrigatória." });
        return;
      }
      const user = await getUserAuth(request.userId);
      if (user) {
        const newAvatar = await updateAvatar(request.file, request.userId);
        response.status(200).json(newAvatar);
      }
    } catch (error: any) {
      switch (error.message) {
        case "E2":
          response.status(400).json({
            error: "A imagem deve ser um arquivo PNG ou JPG.",
          });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
      }
    }
  });

  router.put("/update", validateRequestBody(updateValidation), async (request, response) => {
    try {
      const { cpf } = request.body;
      if (cpf) {
        response.status(400).json({ error: "O CPF não pode ser atualizado." });
        return;
      }
      const user = await getUserAuth(request.userId);
      if (user) {
        const updatedUser = await updateUser(request.body, request.userId);
        response.status(200).json(updatedUser);
      }
    } catch (error: any) {
      switch (error.message) {
        case "E4":
          response.status(400).json({
            error: "Usuário não encontrado.",
          });
          break;
        case "E6":
          response.status(403).json({
            error: "Esta conta foi desativada e não pode ser utilizada.",
          });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
      }
    }
  });

  router.delete("/deactivate", async (request, response) => {
    try {
      const user = await getUserAuth(request.userId);
      if (user) {
        await deactivate(request.userId);
        response.status(200).json({ message: "Conta desativada com sucesso." });
      }
    } catch (error: any) {
      switch (error.message) {
        case "E6":
          response.status(403).json({
            error: "Esta conta foi desativada e não pode ser utilizada.",
          });
          break;

        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  server.use("/user", router);
};

export default userController;
