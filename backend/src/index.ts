import "dotenv/config";
import express from "express";
import cors from "cors";
import userController from "./controllers/user-controller";
import authController from "./auth/auth-controller";
import activityController from "./controllers/activity-controller";
import { createBucket } from "./services/s3-service";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { main } from "../prisma/seed";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerFile = YAML.load(swaggerPath);

export const server = express();

server.use((req, res, next) => {
  if (req.method === "GET") {
    return next();
  }
  return express.json()(req, res, next);
});

server.use(cors());
createBucket();
userController(server);
authController(server);
activityController(server);

const port = process.env.PORT;

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
