import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user-service";

export default async function userStatusGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Autenticação necessária." });
      return;
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }
    if (user.deletedAt !== null) {
      res.status(403).json({
        error: "Esta conta foi desativada e não pode ser utilizada.",
      });
      return;
    }
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Erro interno." });
  }
}
