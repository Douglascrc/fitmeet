import prisma from "../prisma/prisma-client";
import { Activity } from "@prisma/client";

export async function createActivityRepository(data: {
  title: string;
  description: string;
  typeId: string;
  confirmationCode: string;
  image?: string;
  scheduledDate: Date;
  private: boolean;
  creatorId: string;
}): Promise<Activity> {
  return await prisma.activity.create({
    data,
  });
}

export async function findActivityTypeById(id: string) {
  return await prisma.activityType.findUnique({
    where: { id },
  });
}

export async function findCreatorById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, avatar: true },
  });
}

export async function createActivityAddressRepository(data: {
  activityId: string;
  latitude: number;
  longitude: number;
  userId?: string;
}) {
  return await prisma.activityAddress.create({
    data,
  });
}

export async function getActivityByIdRepository(id: string) {
  return await prisma.activity.findUnique({
    where: { id },
  });
}

export async function getActivityParticipantRepository(
  activityId: string,
  userId: string
) {
  return await prisma.activityParticipant.findUnique({
    where: {
      activityId_userId: { activityId, userId },
    },
    include: {
      user: { select: { name: true, avatar: true } },
    },
  });
}

export async function concludeActivityRepository(activityId: string) {
  return await prisma.activity.update({
    where: { id: activityId },
    data: { completedAt: new Date() },
  });
}

export async function deleteActivityRepository(
  activityId: string,
  userId: string
) {
  return await prisma.activity.delete({
    where: {
      id: activityId,
      creatorId: userId,
    },
  });
}

export async function updateActivityParticipantRepository(
  activityId: string,
  userId: string
) {
  return await prisma.activityParticipant.update({
    where: {
      activityId_userId: { activityId, userId },
    },
    data: { confirmedAt: new Date() },
  });
}

export async function updateActivityParticipant(
  activityId: string,
  data: { approved: boolean; participantId: string }
) {
  return await prisma.activityParticipant.update({
    where: { activityId_userId: { activityId, userId: data.participantId } },
    data: { approved: data.approved },
  });
}

export async function deleteActivityById(userId: string, activityId: string) {
  return await prisma.activity.delete({
    where: { id: activityId, creatorId: userId },
  });
}

export async function listActivities(params: {
  userId: string;
  orderBy: "createdAt";
  order: "asc" | "desc";
  skip: number;
  take: number;
}) {
  const { userId, orderBy, order, skip, take } = params;
  const [activities, totalActivities] = await Promise.all([
    prisma.activity.findMany({
      where: { creatorId: userId },
      orderBy: { [orderBy]: order },
      skip,
      take,
      include: {
        type: { select: { name: true } },
        creator: { select: { name: true, avatar: true } },
      },
    }),
    prisma.activity.count({ where: { creatorId: userId } }),
  ]);
  return { activities, totalActivities };
}

export async function listActivitiesRepository(params: {
  typeId?: string;
  orderBy: "createdAt";
  order: "asc" | "desc";
  skip: number;
  take: number;
}) {
  const { typeId, orderBy, order, skip, take } = params;
  const whereClause = typeId ? { typeId } : {};
  const [activities, totalActivities] = await Promise.all([
    prisma.activity.findMany({
      where: whereClause,
      orderBy: { [orderBy]: order },
      skip,
      take,
      include: {
        type: { select: { name: true } },
        creator: { select: { name: true, avatar: true } },
      },
    }),
    prisma.activity.count({ where: whereClause }),
  ]);
  return { activities, totalActivities };
}
