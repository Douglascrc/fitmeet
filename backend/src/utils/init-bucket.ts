import { createBucket } from "../services/s3-service";

async function init() {
  try {
    await createBucket();
  } catch (error) {
    console.error("Erro ao criar bucket:", error);
    process.exit(1);
  }
}

init();
