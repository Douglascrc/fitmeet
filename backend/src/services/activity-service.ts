import { randomBytes } from "crypto";
import * as activityRepository from "../repositories/activity-repository";
import prisma from "../prisma-orm/prisma-client";
import activityData from "../types/activity-creation";
import { uploadImage } from "./s3-service";
import { addExperience } from "./user-service";
import { grantAchievement } from "./user-achievements-service";

const XP_FOR_CHECKIN = 10;
const XP_FOR_CREATOR = 20;

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
    throw new Error("Tipo de atividade inválido.");
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
      throw new Error("Endereço inválido.");
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
  addExperience(userId, XP_FOR_CREATOR);

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
  activityId: string,
  data: Partial<activityData>,
  file?: Express.Multer.File
) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);

  if (activity?.creatorId !== userId) {
    throw new Error("E14"); // Apenas o criador da atividade pode editá-la.
  }
  if (file && !["image/png", "image/jpeg"].includes(file.mimetype)) {
    throw new Error("E2");
  }

  if (data.typeId) {
    const typeExists = await activityRepository.findActivityTypeById(data.typeId);
    if (!typeExists) {
      throw new Error("Tipo de atividade inválido.");
    }
  }

  // Se quiser tratar os campos de endereço, exija que ambos sejam enviados
  if (data.latitude !== undefined || data.longitude !== undefined) {
    if (data.latitude === undefined || data.longitude === undefined) {
      throw new Error("Informe latitude e longitude juntos.");
    }
    // Converte para número caso venha como string
    const latitude = typeof data.latitude === "string" ? Number(data.latitude) : data.latitude;
    const longitude = typeof data.longitude === "string" ? Number(data.longitude) : data.longitude;
    await activityRepository.upsertActivityAddressRepository({
      activityId: activity.id,
      latitude,
      longitude,
    });
  }

  const updatedFields = {
    title: data.title ?? activity.title,
    description: data.description ?? activity.description,
    typeId: data.typeId ?? activity.typeId,
    scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : activity.scheduledDate,
    private:
      data.private !== undefined
        ? typeof data.private === "string"
          ? data.private === "true"
          : data.private
        : activity.private,
    image: file ? await uploadImage(file) : activity.image,
  };

  const updatedActivity = await activityRepository.updateActivity(activityId, updatedFields);
  const creator = await activityRepository.findCreatorById(activity.creatorId);
  // Recupera o endereço atualizado para retornar os valores reais atuais
  const currentAddress = await activityRepository.getActivityAddress(activity.id);

  return {
    id: updatedActivity.id,
    title: updatedActivity.title,
    description: updatedActivity.description,
    type: updatedActivity.typeId,
    address: {
      latitude: currentAddress?.latitude,
      longitude: currentAddress?.longitude,
    },
    scheduledDate: updatedActivity.scheduledDate,
    createdAt: updatedActivity.createdAt,
    completedAt: updatedActivity.completedAt,
    private: updatedActivity.private,
    creator: {
      id: updatedActivity.creatorId,
      name: creator?.name || "",
      avatar: creator?.avatar || "",
    },
  };
}

export async function approveParticipant(
  data: { approved: boolean; participantId: string },
  activityId: string,
  userId: string
) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("Atividade não encontrada.");
  }
  if (!activity.private) {
    throw new Error("atividades públicas não requerem aprovação de participantes");
  }
  if (activity.creatorId !== userId) {
    throw new Error("E16");
  }

  const updatedParticipant = await activityRepository.updateActivityParticipant(activityId, data);
  return updatedParticipant;
}

export async function subscribeActivity(userId: string, activityId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);
  if (!activity) {
    throw new Error("Atividade não encontrada.");
  }

  const participant = await activityRepository.getActivityParticipantRepository(activityId, userId);
  if (participant) {
    throw new Error("E7"); // Você já está inscrito nesta atividade.
  }

  const newParticipant = await activityRepository.subscribeActivityRepository(userId, activityId);

  return {
    id: newParticipant.id,
    subscriptionStatus: newParticipant.approved,
    confirmedAt: newParticipant.confirmedAt,
    activityId: newParticipant.activityId,
    userId: newParticipant.userId,
  };
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

  if (activity?.confirmationCode !== confirmationCode) {
    throw new Error("E10");
  }
  if (activity.completedAt) {
    throw new Error("E13"); // Não é possível confirmar presença em uma atividade concluída
  }

  const participant = await activityRepository.getActivityParticipantRepository(activityId, userId);

  if (!activity.private) {
    await activityRepository.subscribeActivityRepository(userId, activityId);
    return;
  }
  if (participant?.confirmedAt) {
    throw new Error("E11"); // Você já confirmou sua participação nesta atividade.
  }
  if (!participant?.approved && !activity.private) {
    throw new Error("E9"); // . Apenas participantes aprovados na atividade podem fazer check-in.
  }
  await activityRepository.updateActivityParticipantRepository(activityId, userId);

  await addExperience(userId, XP_FOR_CHECKIN);
  await addExperience(activity.creatorId, XP_FOR_CREATOR);

  await grantAchievement("Primeiro Check-in", userId);
  await grantAchievement("Criador de Atividades", activity.creatorId);

  return { message: "Participação confirmada." };
}

export async function getActivityTypes() {
  const activityTypes = await activityRepository.getAllActivityTypes();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return activityTypes.map((type: any) => ({
    id: type.id,
    name: type.name,
    description: type.description,
    image: type.image,
  }));
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

export async function getActivityById(activityId: string) {
  return await activityRepository.getActivityByIdRepository(activityId);
}

export async function concludeActivity(activityId: string, userId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);

  if (activity?.creatorId !== userId) {
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

  if (participant?.confirmedAt) {
    throw new Error("E11"); // Voce já confirmou sua participação nessa atividade.
  }
  if (participant?.userId !== userId) {
    throw new Error("Você não está inscrito nesta atividade.");
  }
  await activityRepository.deleteActivityRepository(activityId, userId);
}

export async function deleteActivity(activityId: string, userId: string) {
  const activity = await activityRepository.getActivityByIdRepository(activityId);

  if (activity?.creatorId !== userId) {
    throw new Error("E15"); // Apenas o criador da atividade pode excluí-la.
  }
  await activityRepository.deleteActivityById(activityId, userId);
}
