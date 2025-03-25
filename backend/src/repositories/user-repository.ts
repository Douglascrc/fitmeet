import prisma from "../prisma/prisma-client";
import userData from "../types/user-creation";

export async function getUserAuthRepository(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      avatar: true,
      xp: true,
      level: true,
      achievements: true,
      deletedAt: true,
    },
  });
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
  return await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function getUserRepository({ email, cpf }: userData) {
  return await prisma.user.findUnique({
    where: {
      email,
      cpf,
    },
    include: {
      achievements: {
        include: {
          achievement: {
            select: { name: true, criterion: true },
          },
        },
      },
    },
  });
}

export async function createUserRepository(data: userData) {
  return await prisma.user.create({
    data,
  });
}
