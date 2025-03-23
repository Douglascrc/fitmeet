import {
  getAllRepository,
  getByIdRepository,
  createUserRepository,
  deactivateRepository,
} from "../repository/user-repository";
import userData from "../types/user-creation";

export async function getAll() {
  return await getAllRepository();
}

export async function getById(id: string) {
  return await getByIdRepository(id);
}

export async function create(data: userData) {
  return await createUserRepository(data);
}

export async function deactivate(id: string) {
  return await deactivateRepository(id);
}
