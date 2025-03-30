import bcrypt from "bcryptjs";
import {
  createPreferenceRepository,
  deactivateRepository,
  deletaActivitiesRepository,
  getActivityTypesByIds,
  getPreferencesRepository,
  getUserAuthRepository,
  updateAvatarById,
  updateUserRepository,
  updateUserXP,
} from "../repositories/user-repository";
import userData from "../types/user-creation";
import { uploadImage } from "./s3-service";

export async function getUserById(userId: string) {
  const user = await getUserAuthRepository(userId);
  if (!user) {
    throw new Error("E4");
  }
  return user;
}
export async function getUserAuth(userId: string) {
  const user = await getUserAuthRepository(userId);
  if (!user) {
    throw new Error("E4");
  }
  if (user.deletedAt != null) {
    throw new Error("E6");
  }
  return {
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

export async function deactivate(userId: string) {
  const user = await getUserAuthRepository(userId);
  if (user?.deletedAt != null) {
    throw new Error("E6");
  }
  return await deactivateRepository(userId);
}

export async function definePreferences(userId: string, typeIds: string[]) {
  const validActivityTypes = await getActivityTypesByIds(typeIds);

  if (!validActivityTypes || validActivityTypes.length === 0) {
    throw new Error("Id");
  }

  await deletaActivitiesRepository(validActivityTypes, userId);
  const newPreferences = validActivityTypes.map((v) => ({
    userId,
    typeId: v.id,
  }));

  await createPreferenceRepository(newPreferences);

  return validActivityTypes;
}

export async function getPreferences(userId: string) {
  const user = await getUserAuthRepository(userId);
  const preferences = await getPreferencesRepository(userId);
  if (!user) {
    throw new Error("E4");
  }
  if (user.deletedAt != null) {
    throw new Error("E6");
  }
  const formatted = preferences.map((pref) => ({
    typeId: pref.type.id,
    typeName: pref.type.name,
    typeDescription: pref.type.description,
  }));

  return formatted;
}

export async function updateAvatar(avatar: Express.Multer.File, userId: string) {
  const user = await getUserAuthRepository(userId);
  if (!user) {
    throw new Error("E4");
  }
  if (!["image/png", "image/jpeg"].includes(avatar.mimetype)) {
    throw new Error("E2");
  }

  const imageUrl = await uploadImage(avatar);

  const updatedUser = await updateAvatarById(imageUrl, userId);
  console.log(imageUrl);

  return {
    avatar: updatedUser.avatar,
  };
}

export async function updateUser(data: userData, userId: string) {
  const user = await getUserAuthRepository(userId);
  if (!user) {
    throw new Error("E4");
  }

  const isSamePassword = await bcrypt.compare(data.password, user.password);
  if (!isSamePassword) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
  }

  return await updateUserRepository(data, userId);
}

export async function addExperience(userId: string, xpToAdd: number) {
  const user = await getUserAuthRepository(userId);
  if (!user) {
    throw new Error("E4"); // Usuário não encontrado
  }

  let totalXp = user.xp + xpToAdd;
  let newLevel = user.level;
  while (totalXp >= newLevel * 100) {
    totalXp -= newLevel * 100;
    newLevel++;
  }

  const newXp = user.xp + xpToAdd;

  return await updateUserXP(userId, newXp, newLevel);
}
