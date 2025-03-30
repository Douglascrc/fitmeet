import prisma from "../prisma-orm/prisma-client";
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

export async function getActivityAddress(activityId: string) {
  return await prisma.activityAddress.findUnique({
    where: { activityId },
  });
}

export async function getAllActivityTypes() {
  return await prisma.activityType.findMany({});
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

export async function upsertActivityAddressRepository(data: {
  activityId: string;
  latitude: number;
  longitude: number;
}) {
  return await prisma.activityAddress.upsert({
    where: { activityId: data.activityId },
    update: {
      latitude: data.latitude,
      longitude: data.longitude,
    },
    create: {
      activityId: data.activityId,
      latitude: data.latitude,
      longitude: data.longitude,
    },
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

export async function getActivityParticipantRepository(activityId: string, userId: string) {
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

export async function deleteActivityRepository(activityId: string, userId: string) {
  return await prisma.activity.delete({
    where: {
      id: activityId,
      creatorId: userId,
    },
  });
}

export async function updateActivityParticipantRepository(activityId: string, userId: string) {
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

export async function updateActivity(activityId: string, updatedFields: Partial<Activity>) {
  return await prisma.activity.update({
    where: { id: activityId },
    data: updatedFields,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whereClause: any;
  orderBy: "createdAt";
  order: "asc" | "desc";
  skip: number;
  take: number;
}) {
  const { whereClause, orderBy, order, skip, take } = params;
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

export async function listParticipantsByActivityRepository(activityId: string) {
  return await prisma.activityParticipant.findMany({
    where: { activityId },
    include: {
      user: { select: { name: true, avatar: true } },
    },
  });
}

export async function subscribeActivityRepository(userId: string, activityId: string) {
  return await prisma.activityParticipant.create({
    data: {
      userId,
      activityId,
    },
  });
}
