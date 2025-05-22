import { createBucket } from "../services/s3-service";

async function init() {
  try {
    console.log("Iniciando criação do bucket...");
    await createBucket();
    console.log("Bucket criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar bucket:", error);
    process.exit(1);
  }
}

init();
