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

let bucketInitializationPromise: Promise<void> | null = null;

async function initializeBucket() {
  if (bucketInitializationPromise) {
    return bucketInitializationPromise;
  }

  bucketInitializationPromise = createBucket()
    .then(() => {
      console.log("Bucket criado com sucesso!");
    })
    .catch((err) => {
      console.error("Erro ao criar bucket:", err);
      throw err;
    });

  return bucketInitializationPromise;
}

const app = express();

app.use(cors());
app.use((req, res, next) => {
  if (req.method === "GET") return next();
  return express.json()(req, res, next);
});

initializeBucket();

userController(app);
authController(app);
activityController(app);

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerFile = YAML.load(swaggerPath);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
