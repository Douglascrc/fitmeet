import "dotenv/config";
import express from "express";
import cors from "cors";
import userController from "./controllers/user-controller";
import authController from "./auth/auth-controller";
import activityController from "./controllers/activity-controller";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use((req, res, next) => {
  if (req.method === "GET") return next();
  return express.json()(req, res, next);
});

userController(apiRouter);
authController(apiRouter);
activityController(apiRouter);

app.use("/api", apiRouter);

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerFile = YAML.load(swaggerPath);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
