import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

export default function authGuard(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  try {
    if (!authHeader) {
      response.status(401).json({ error: "Autenticação necessária" });
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    request.userId = decoded.id;
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    response.status(401).json({ error: "Token inválido" });
    return;
  }
}
