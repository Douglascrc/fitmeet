import {
  deactivateRepository,
  getUserAuthRepository,
} from "../repositories/user-repository";

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
