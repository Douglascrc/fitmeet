import prisma from "../prisma/prisma-client";
import { ActivityType, Prisma } from "@prisma/client";
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

export async function getActivityTypesByIds(typeIds: string[]) {
  return await prisma.activityType.findMany({
    where: { id: { in: typeIds } },
  });
}

export async function getPreferencesRepository(userId: string) {
  const preferences = await prisma.preference.findMany({
    where: { userId },
    include: {
      type: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
  return preferences;
}

export async function updateAvatarRepository(avatar: string, id: string) {
  return await prisma.user.update({
    where: { id },
    data: { avatar },
  });
}

export async function updateUserRepository(data: userData, id: string) {
  return await prisma.user.update({
    data,
    where: {
      id,
    },
  });
}

export async function deletaActivitiesRepository(
  validActivityTypes: ActivityType[],
  userId: string
) {
  return await prisma.preference.deleteMany({
    where: {
      userId,
      typeId: { notIn: validActivityTypes.map((v) => v.id) },
    },
  });
}
export async function createPreferenceRepository(
  newPreferences: Prisma.PreferenceCreateManyInput[]
) {
  return await prisma.preference.createMany({
    data: newPreferences,
    skipDuplicates: true,
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
