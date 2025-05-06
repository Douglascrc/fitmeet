import { z } from "zod";

const userValidation = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  cpf: z
    .string({
      required_error: "CPF/CNPJ é obrigatório.",
    })
    .regex(/^\d+$/, "CPF deve conter apenas números.")
    .refine(
      (cpf) => cpf.length === 11,
      "CPF deve conter exatamente 11 dígitos."
    ),
});

export default userValidation;
