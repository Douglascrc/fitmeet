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

let bucketInitialized = false;
let bucketInitializationPromise: Promise<void> | null = null;

async function initializeBucket() {
  if (bucketInitializationPromise) {
    return bucketInitializationPromise;
  }

  bucketInitializationPromise = createBucket()
    .then(() => {
      console.log("Bucket criado com sucesso!");
      bucketInitialized = true;
    })
    .catch((err) => {
      console.error("Erro ao criar bucket:", err);
      // Não falhe completamente, apenas registre o erro
    });

  return bucketInitializationPromise;
}

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerFile = YAML.load(swaggerPath);

const app = express();

app.use((req, res, next) => {
  if (req.method === "GET") {
    return next();
  }
  return express.json()(req, res, next);
});

app.use(cors());
userController(app);
authController(app);
activityController(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

initializeBucket();
export default app;
