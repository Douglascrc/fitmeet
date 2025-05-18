import "dotenv/config";
import "./services/app-insights";
import express from "express";
import cors from "cors";
import userController from "./controllers/user-controller";
import authController from "./auth/auth-controller";
import activityController from "./controllers/activity-controller";
import { createContainer } from "./services/blob-service";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

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
createContainer();
userController(server);
authController(server);
activityController(server);

const port = process.env.PORT;

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
