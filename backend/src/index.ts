import "dotenv/config";
import express from "express";
import cors from "cors";
import userController from "./controllers/user-controller";
import authController from "./auth/auth-controller";
import activityController from "./controllers/activity-controller";
import { createBucket } from "./services/s3-service";

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

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
