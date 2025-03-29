import { Router, Express } from "express";
import authGuard from "../middlewares/auth-guard";
import upload from "../multer/multer";
import * as activityService from "../services/activity-service";
import userStatus from "../middlewares/userStatus";

/* eslint-disable @typescript-eslint/no-explicit-any */
const activityController = (server: Express) => {
  const router = Router();
  router.use(authGuard);
  router.use(userStatus);

  router.get("/", async (request, response) => {
    try {
      const result = await activityService.listActivities(request.query);
      response.status(200).json(result);
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

  router.get("/types", async (request, response) => {
    try {
      const result = await activityService.getActivityTypes();
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E6":
          response.status(403).json({
            error: "Esta conta foi desativada e não pode ser utilizada.", // É obrigatorio o campo imagem no banco?
          });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.get("/:id/participants", async (request, response) => {
    try {
      const activityId = request.params.id;
      const result = await activityService.getParticipantsByActivityId(request.userId, activityId);
      response.status(201).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E20":
          response.status(404).json({ error: "Atividade não encontrada." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado." });
      }
    }
  });

  router.get("/all", async (request, response) => {
    try {
      const result = await activityService.listActivities(request.query);
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.get("/user/creator", async (request, response) => {
    try {
      const result = await activityService.listActivities(request.query);
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.get("/user/creator/all", async (request, response) => {
    try {
      const result = await activityService.listActivities(request.query);
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.get("/user/participant", async (request, response) => {
    try {
      const result = await activityService.listActivities(request.query);
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.get("/user/participant/all", async (request, response) => {
    try {
      const result = await activityService.listActivities(request.query);
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.post("/:id/subscribe", async (request, response) => {
    try {
      const activityId = request.params.id;
      const result = await activityService.subscribeActivity(request.userId, activityId);
      response.status(201).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E14":
          response.status(400).json({ error: "Atividade já foi inscrita." });
          break;
        case "E13":
          response.status(404).json({ error: "Atividade não encontrada." });
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

  router.put("/:id/update", upload.single("image"), async (request, response) => {
    try {
      const activityId = request.params.id;
      const result = await activityService.updateActivity(
        request.userId,
        request.body,
        activityId,
        request.file
      );
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E2":
          response.status(400).json({ error: "A imagem deve ser um arquivo PNG ou JPG" });
          break;
        case "E7":
          response.status(403).json({ error: "Acesso negado." });
          break;
        case "E8":
          response.status(404).json({ error: "Atividade não encontrada." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.put(":id/conclude", async (request, response) => {
    try {
      const activityId = request.params.id;
      await activityService.concludeActivity(request.userId, activityId);
      response.status(200).json({ message: "Atividade concluída com sucesso." });
    } catch (error: any) {
      switch (error.message) {
        case "E17":
          response.status(403).json({ error: "Apenas o criador da atividade pode concluí-la." });
          break;
        case "E8":
          response.status(404).json({ error: "Atividade não encontrada." });
          break;
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.put("/:id/approve", async (request, response) => {
    try {
      const activityId = request.params.id;
      await activityService.approveParticipant(request.body, activityId);
      response.status(200).json({ message: "Solicitação de participação aprovada com sucesso." });
    } catch (error: any) {
      switch (error.message) {
        default:
          response.status(500).json({ error: "Erro inesperado" });
      }
    }
  });

  router.put("/:id/check-in", async (request, response) => {
    try {
      const activityId = request.params.id;
      const { confirmationCode } = request.body;
      const result = await activityService.checkInActivity(
        request.userId,
        activityId,
        confirmationCode
      );
      response.status(200).json(result);
    } catch (error: any) {
      switch (error.message) {
        case "E10":
          response.status(400).json({ error: "Código inválido." });
          break;
        case "E9":
          response.status(403).json({ error: "Participação não aprovada." });
          break;
        case "E11":
          response.status(409).json({ error: "Check-in já realizado." });
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

  server.use("/activities", router);
};
export default activityController;
