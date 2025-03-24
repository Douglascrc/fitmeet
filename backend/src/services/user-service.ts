import {
  getByIdRepository,
  createUserRepository,
  deactivateRepository,
  getUserRepository,
} from "../repository/user-repository";
import userData from "../types/user-creation";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const jwtSecret = process.env.JWT_SECRET!;

export async function registerService(data: {
  name: string;
  email: string;
  password: string;
  cpf: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;
  return await createUserRepository(data);
}

export async function getById(id: string) {
  return await getByIdRepository(id);
}

export async function registerUser(data: userData) {
  // const { name, email, cpf, password } = data;

  return await createUserRepository(data);
}

export async function logIn(data: userData) {
  const user = await getUserRepository(data);
  if (!user) throw new Error("E4"); // Código do erro do desafio

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) throw new Error("E5");

  const token = jwt.sign(data, jwtSecret, { expiresIn: "30min" });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;

  return { ...userWithoutPassword, token };
}

export async function deactivate(id: string) {
  return await deactivateRepository(id);
}
