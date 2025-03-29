import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export default function validateRequestBody(schema: ZodSchema) {
  return function requestBodyValidator(request: Request, response: Response, next: NextFunction) {
    try {
      schema.parse(request.body);
      next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error instanceof ZodError) {
        response.status(400).json({ error: "Informe os campos obrigatórios corretamente." });
        return;
      } else if (error instanceof Error) {
        response.status(400).json({ error: "Algum ou alguns campos inválidos" });
        return;
      }
    }
  };
}
