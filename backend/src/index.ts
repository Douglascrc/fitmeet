import "dotenv/config";
import express from "express";
import cors from "cors";
import userController from "./controllers/user-controller";
import authController from "./auth/auth-controller";

export const server = express();

server.use(express.json());
server.use(cors());

userController(server);
authController(server);

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
