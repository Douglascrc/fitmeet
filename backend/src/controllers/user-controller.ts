import { Express, Router } from "express";
import authGuard from "../middlewares/auth-guard";
import { deactivate, getUserAuth } from "../services/user-service";

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
    response.json();
  });

  router.post("/preferencs/define", async (request, response) => {
    response.json(201);
  });

  router.put("/avatar", async (request, response) => {
    response.json();
  });

  router.put("/update", async (request, response) => {
    response.json();
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
