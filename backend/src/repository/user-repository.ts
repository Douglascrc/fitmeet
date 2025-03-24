import prisma from "../prisma/prisma-client";
import userData from "../types/user-creation";

export async function getAllRepository() {
  return await prisma.user.findMany();
}

export async function getByIdRepository(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function updateRepository(data: userData, id: string) {
  return await prisma.user.update({
    data,
    where: {
      id,
    },
  });
}

export async function deactivateRepository(id: string) {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}

export async function getUserRepository({ email, cpf }: userData) {
  return await prisma.user.findUnique({
    where: {
      email,
      cpf,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      cpf: true,
      avatar: true,
      xp: true,
      level: true,
      achievements: true,
    },
  });
}

export async function createUserRepository(data: userData) {
  return await prisma.user.create({
    data,
  });
}
