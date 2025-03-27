import prisma from "../prisma/prisma-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function create(data: any) {
  await prisma.userAchievement.create({
    data,
  });
}

export async function findAchievementsByUserId(userId: string) {
  return await prisma.userAchievement.findMany({
    where: {
      userId,
    },
    include: {
      achievement: true,
    },
  });
}

export async function findByAchievementIdAndUserId(
  achievementId: string,
  userId: string
) {
  return await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId,
      },
    },
  });
}
