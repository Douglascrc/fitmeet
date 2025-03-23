import { Express, Router } from "express";
import { create, getAll, getById } from "../services/user-service";

const userController = (server: Express) => {
  const router = Router();

  router.get("/", async (request, response) => {
    const users = await getAll();
    response.status(200).json(users);
  });

  router.get("/:id", async (request, response) => {
    const user = await getById(request.params.id);
    response.status(200).json(user);
  });

  router.post("/create", async (request, response) => {
    const newUser = await create(request.body);
    response.status(201).json(newUser);
  });

  server.use("/users", router);
};

export default userController;
