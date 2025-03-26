import {
  createPreferenceRepository,
  deactivateRepository,
  deletaActivitiesRepository,
  getActivityTypesByIds,
  getPreferencesRepository,
  getUserAuthRepository,
  updateAvatarRepository,
  updateUserRepository,
} from "../repositories/user-repository";
import userData from "../types/user-creation";

export async function getUserAuth(userId: string) {
  const user = await getUserAuthRepository(userId);
  if (user?.deletedAt != null) {
    throw new Error("E6");
  }
  return user;
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
  const user = await getUserAuth(userId);
  const preferences = await getPreferencesRepository(userId);
  if (user?.deletedAt != null) {
    throw new Error("E6");
  }
  const formatted = preferences.map((pref) => ({
    typeId: pref.type.id,
    typeName: pref.type.name,
    typeDescription: pref.type.description,
  }));

  return formatted;
}

export async function updateAvatar(avatar: string, userId: string) {
  return await updateAvatarRepository(avatar, userId);
}

export async function updateUser(data: userData, userId: string) {
  const { cpf } = data;
  if (cpf) {
    console.error("O usuário não pode editar seu CPF");
  }

  return await updateUserRepository(data, userId);
}
