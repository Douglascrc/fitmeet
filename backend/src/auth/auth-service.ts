import bcrypt from "bcryptjs";
import {
  createUserRepository,
  getUserRepository,
} from "../repositories/user-repository";
import userData from "../types/user-creation";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

export async function singIn(data: userData) {
  if (!data.email || !data.password) {
    throw new Error("E1");
  }
  const user = await getUserRepository(data);
  if (!user) {
    throw new Error("E4");
  }
  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) throw new Error("E5");

  const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "30min" });

  return {
    token: token,
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    avatar: user.avatar,
    xp: user.xp,
    level: user.level,
    achievements:
      user.achievements?.map((item) => ({
        name: item.achievement.name,
        criterion: item.achievement.criterion,
      })) || [],
  };
}

export async function registerService(data: {
  name: string;
  email: string;
  password: string;
  cpf: string;
}) {
  if (!data.email || !data.cpf || !data.password || !data.name) {
    throw new Error("E1");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;

  const user = await getUserRepository(data);
  if (user?.email === data.email || user?.cpf === data.cpf) {
    throw new Error("E3");
  }

  return await createUserRepository(data);
}
