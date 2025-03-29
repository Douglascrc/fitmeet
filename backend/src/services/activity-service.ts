import { randomBytes } from "crypto";
import * as activityRepository from "../repositories/activity-repository";
import prisma from "../prisma-orm/prisma-client";
import activityData from "../types/activity-creation";
import { uploadImage } from "./s3-service";

export async function createActivity(
  userId: string,
  data: activityData,
  file: Express.Multer.File
) {
  if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
    throw new Error("E2");
  }
  const typeExists = await activityRepository.findActivityTypeById(data.typeId);
  if (!typeExists) {
    throw new Error("E_INVALID_TYPE");
  }

  const imageUrl = await uploadImage(file);

  const confirmationCode = randomBytes(3).toString("hex").toUpperCase();

  const scheduledDate = new Date(data.scheduledDate);

  if (typeof data.private === "string") {
    data.private = data.private === "true";
  }

  if (typeof data.latitude === "string") {
    try {
      data.latitude = JSON.parse(data.latitude);
      data.longitude =
        typeof data.longitude === "string" ? JSON.parse(data.longitude) : data.longitude;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("INVALID_ADDRESS");
    }
  }

  const activity = await activityRepository.createActivityRepository({
    title: data.title,
    description: data.description,
    typeId: data.typeId,
    confirmationCode,
    image: imageUrl,
    scheduledDate,
    private: data.private,
    creatorId: userId,
  });

  await activityRepository.createActivityAddressRepository({
    activityId: activity.id,
    latitude: data.latitude,
    longitude: data.longitude,
  });

  const creator = await activityRepository.findCreatorById(userId);

  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.typeId,
    address: {
      latitude: data.latitude,
      longitude: data.longitude,
    },
    scheduledDate: activity.scheduledDate,
    createdAt: activity.createdAt,
    completedAt: activity.completedAt,
    private: activity.private,
    creator: {
      id: activity.creatorId,
      name: creator?.name || "",
      avatar: creator?.avatar || "",
    },
  };
}

export async function updateActivity(
  userId: string,
  data: activityData,
  activityId: string,
  file?: Express.Multer.File
) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("E20");
  }
  if (activity.creatorId !== userId) {
    throw new Error("E14"); // Apenas o criador da atividade pode editá-la.
  }
  if (file && !["image/png", "image/jpeg"].includes(file.mimetype)) {
    throw new Error("E2");
  }
  const typeExists = await activityRepository.findActivityTypeById(data.typeId);
  if (!typeExists) {
    throw new Error("E_INVALID_TYPE");
  }
}
export async function approveParticipant(
  data: { approved: boolean; participantId: string },
  activityId: string
) {
  const activityParticipant = await activityRepository.updateActivityParticipant(activityId, data);
  if (!activityParticipant) {
    throw new Error("Participante não encontrado.");
  }
}

export async function subscribeActivity(userId: string, activityId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("E10");
  }

  const participant = await activityRepository.getActivityParticipantRepository(activityId, userId);

  if (participant) {
    throw new Error("Participação já solicitada.");
  }

  await prisma.activityParticipant.create({
    data: {
      activityId,
      userId,
    },
  });

  return participant;
}

export async function getParticipantsByActivityId(userId: string, activityId: string) {
  const activityParticipant = await activityRepository.getActivityParticipantRepository(
    userId,
    activityId
  );
  if (!activityParticipant) {
    throw new Error("E20");
  }

  if (activityParticipant.userId !== userId) {
    throw new Error("E21"); // Este não participa desta atividade.
  }
  return {
    id: activityParticipant.id,
    userId: activityParticipant.userId,
    name: activityParticipant.userId,
    subscripitionStatus: activityParticipant.approved,
    avatar: activityParticipant.user.avatar,
    confirmatedAt: activityParticipant.confirmedAt,
  };
}

export async function createParticipant(userId: string, activityId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("E10"); // Código inválido.
  }

  const participant = await activityRepository.getActivityParticipantRepository(activityId, userId);
  if (participant) {
    throw new Error("E8");
  }

  await prisma.activityParticipant.create({
    data: {
      activityId,
      userId,
    },
  });

  return participant;
}

export async function checkInActivity(
  userId: string,
  activityId: string,
  confirmationCode: string
) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity || activity.confirmationCode !== confirmationCode) {
    throw new Error("E10");
  }
  console.log("Código recebido:", confirmationCode);
  console.log("Código esperado:", activity.confirmationCode);

  const participant = await activityRepository.getActivityParticipantRepository(activityId, userId);

  if (participant) {
    if (participant.confirmedAt) {
      throw new Error("E11"); // Check-in já realizado.
    }
    if (!participant.approved) {
      throw new Error("E9"); // Participação não aprovada.
    }
    await activityRepository.updateActivityParticipantRepository(activityId, userId);
    return { message: "Participação confirmada." };
  } else {
    throw new Error("E10"); // Código inválido ou participação não cadastrada.
  }
}

export async function getActivityTypes() {
  const activityTypes = await activityRepository.getAllActivityTypes();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    id: activityTypes[0],
    name: activityTypes[1],
    description: activityTypes[2],
    image: activityTypes[3],
  };
}

export async function listActivities(query: {
  type?: string;
  orderBy?: string;
  order?: string;
  page?: string;
  pageSize?: string;
}) {
  const orderBy = (query.orderBy as "createdAt") || "createdAt";
  const order = (query.order as "asc" | "desc") || "asc";
  const page = query.page ? parseInt(query.page, 10) : 0;
  const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
  const skip = page * pageSize;
  const { activities, totalActivities } = await activityRepository.listActivitiesRepository({
    typeId: query.type,
    orderBy,
    order,
    skip,
    take: pageSize,
  });

  return {
    page,
    pageSize,
    totalActivities,
    activities: activities.map((act) => ({
      id: act.id,
      title: act.title,
      description: act.description,
      type: act.type.name,
      image: act.image,
      confirmationCode: act.confirmationCode,
      scheduledDate: act.scheduledDate,
      createdAt: act.createdAt,
      completedAt: act.completedAt,
      private: act.private,
      creator: act.creatorId,
    })),
  };
}

export async function concludeActivity(activityId: string, userId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("E8");
  }
  if (activity.creatorId !== userId) {
    throw new Error("E17");
  }
  await activityRepository.concludeActivityRepository(activityId);
}

export async function unsubscribeActivity(userId: string, activityId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("E20");
  }
  const participant = await activityRepository.getActivityParticipantRepository(activityId, userId);

  if (!participant) {
    throw new Error("E21"); // Participante não encontrado.
  }
  if (participant.confirmedAt) {
    throw new Error("E11"); // Voce já confirmou sua participação nessa atividade.
  }
  if (participant.userId !== userId) {
    throw new Error("E15");
  }
  await activityRepository.deleteActivityRepository(activityId, userId);
}

export async function deleteActivity(activityId: string, userId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("E20");
  }
  await activityRepository.deleteActivityById(activityId, userId);
}
