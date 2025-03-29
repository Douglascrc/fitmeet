import prisma from "../prisma-orm/prisma-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createMany(data: any[]) {
  await prisma.achievement.createMany({
    data,
  });
}

export async function findByName(name: string) {
  return await prisma.achievement.findUniqueOrThrow({
    where: {
      name,
    },
  });
}

export async function getCount() {
  return await prisma.achievement.count();
}
