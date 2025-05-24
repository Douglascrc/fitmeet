import { Router } from "express";
import authGuard from "../middlewares/auth-guard";
import upload from "../multer/multer";
import * as activityService from "../services/activity-service";
import userStatus from "../middlewares/userStatus";

/* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/no-unused-vars */
const activityController = (app: Router) => {
  const router = Router();
  router.use(authGuard);
  router.use(userStatus);

  router.get("/", async (request, response) => {
    try {
      const query = { ...request.query, userId: request.userId };
      const result = await activityService.listActivities(query);
      response.status(200).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado" });
    }
  });

  router.get("/types", async (request, response) => {
    try {
      const result = await activityService.getActivityTypes();
      response.status(200).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado" });
    }
  });

  router.get("/:id/participants", async (request, response) => {
    try {
      const activityId = request.params.id;
      const activity = await activityService.getActivityById(activityId);
      if (!activity) {
        response.status(404).json({ error: "Atividade não encontrada." });
      }
      const result = await activityService.getParticipantsByActivityId(request.userId, activityId);
      response.status(201).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado." });
    }
  });

  router.get("/all", async (request, response) => {
    try {
      const query = { ...request.query, userId: request.userId };
      const result = await activityService.listActivities(query);
      response.status(200).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado" });
    }
  });

  router.get("/user/creator", async (request, response) => {
    try {
      const query = { ...request.query, userId: request.userId };
      const result = await activityService.listActivities(query);
      response.status(200).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado" });
    }
  });

  router.get("/user/creator/all", async (request, response) => {
    try {
      const query = { ...request.query, userId: request.userId };
      const result = await activityService.listActivities(query);
      response.status(200).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado" });
    }
  });

  router.get("/user/participant", async (request, response) => {
    try {
      const query = { ...request.query, userId: request.userId };
      const result = await activityService.listActivities(query);
      response.status(200).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado" });
    }
  });

  router.get("/user/participant/all", async (request, response) => {
    try {
      const query = { ...request.query, userId: request.userId };
      const result = await activityService.listActivities(query);
      response.status(200).json(result);
    } catch (error: any) {
      response.status(500).json({ error: "Erro inesperado" });
    }
  });

  router.post("/:id/subscribe", async (request, response) => {
    try {
      const activityId = request.params.id;
      const activity = await activityService.getActivityById(activityId);
      if (!activity) {
        response.status(404).json({ error: "Atividade não encontrada." });
      }
      const result = await activityService.subscribeActivity(request.userId, activityId);
      response.status(201).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E7":
          response.status(409).json({ error: "Você já se registrou nesta atividade." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
      }
    }
  });

  router.post("/new", upload.single("image"), async (request, response) => {
    try {
      if (!request.file) {
        response.status(400).json({ error: "Imagem é obrigatória." });
        return;
      }
      const result = await activityService.createActivity(
        request.userId,
        request.body,
        request.file
      );
      response.status(201).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E2":
          response.status(400).json({ error: "A imagem deve ser um arquivo PNG ou JPG" });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
      }
    }
  });

  router.put("/:id/update", upload.single("image"), async (request, response) => {
    try {
      const activityId = request.params.id;
      const activity = await activityService.getActivityById(activityId);
      if (!activity) {
        response.status(404).json({ error: "Atividade não encontrada." });
      }
      const result = await activityService.updateActivity(
        request.userId,
        activityId,
        request.body,
        request.file
      );
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E2":
          response.status(400).json({ error: "A imagem deve ser um arquivo PNG ou JPG" });
          break;
        case "E14":
          response.status(403).json({ error: "Apenas o criador da atividade pode editá-la." });
          break;
        case "Informe latitude e longitude juntos.":
          response.status(400).json({ error: "Informe latitude e longitude juntos." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.put(":id/conclude", async (request, response) => {
    try {
      const activityId = request.params.id;
      const activity = await activityService.getActivityById(activityId);
      if (!activity) {
        response.status(404).json({ error: "Atividade não encontrada." });
      }
      await activityService.concludeActivity(request.userId, activityId);
      response.status(200).json({ message: "Atividade concluída com sucesso." });
    } catch (error: any) {
      switch (error.message) {
        case "E17":
          response.status(403).json({ error: "Apenas o criador da atividade pode concluí-la." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.put("/:id/approve", async (request, response) => {
    try {
      const activityId = request.params.id;
      await activityService.approveParticipant(request.body, activityId, request.userId);
      response.status(200).json({ message: "Solicitação de participação aprovada com sucesso." });
    } catch (error: any) {
      switch (error.message) {
        case "E16":
          response.status(403).json({ error: "Apenas o criador da atividade pode aprovar." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.put("/:id/check-in", async (request, response) => {
    try {
      const activityId = request.params.id;
      const activity = await activityService.getActivityById(activityId);

      if (!activity) {
        response.status(404).json({ error: "Atividade não encontrada." });
      }
      const { confirmationCode } = request.body;
      const result = await activityService.checkInActivity(
        request.userId,
        activityId,
        confirmationCode
      );
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E11":
          response
            .status(409)
            .json({ error: "Você já confirmou sua participação nesta atividade." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.delete(":id/unsubscribe", async (request, response) => {
    try {
      const activityId = request.params.id;
      await activityService.unsubscribeActivity(request.userId, activityId);
      response.status(200).json({ message: "Atividade cancelada com sucesso." });
    } catch (error: any) {
      switch (error.message) {
        case "E8":
          response.status(404).json({ error: "Atividade não encontrada." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.delete("/:id/delete", async (request, response) => {
    try {
      const activityId = request.params.id;
      const activity = await activityService.getActivityById(activityId);
      if (!activity) {
        response.status(404).json({ error: "Atividade não encontrada." });
      }
      await activityService.deleteActivity(request.userId, activityId);
      response.status(200).json({ message: "Atividade excluída com sucesso." });
    } catch (error: any) {
      switch (error.message) {
        case "E6":
          response.status(403).json({
            error: "Esta conta foi desativada e não pode ser utilizada.",
          });
          break;
        case "E20":
          response.status(404).json({ error: "Atividade não encontrada." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  app.use("/activities", router);
};
export default activityController;
