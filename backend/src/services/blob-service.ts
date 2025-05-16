import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import path from "path";
import fs from "fs/promises";

// Configurações do Azure Blob Storage
const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
const accountKey = process.env.AZURE_STORAGE_KEY!;
const containerName = process.env.AZURE_CONTAINER_NAME!;

// Criar cliente do Blob Storage
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient(containerName);

export async function createContainer() {
  try {
    await containerClient.createIfNotExists({
      access: "blob",
    });
    console.log("Container criado com sucesso.");
    await uploadDefaultAvatar();
  } catch (error) {
    console.error("Erro ao criar container:", error);
  }
}

export async function uploadDefaultAvatar() {
  try {
    const filePath = path.join(process.cwd(), "src", "tests", "mocks", "avatar.png");
    const fileBuffer = await fs.readFile(filePath);

    const blobClient = containerClient.getBlockBlobClient("avatar.png");
    await blobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: "image/png" },
    });

    console.log("Imagem padrão (avatar.png) enviada para o container.");
  } catch (error) {
    console.error("Erro ao enviar a imagem padrão:", error);
  }
}

export async function uploadImage(file: Express.Multer.File) {
  try {
    const blobName = `${Date.now()}-${file.originalname}`;
    const blobClient = containerClient.getBlockBlobClient(blobName);

    await blobClient.upload(file.buffer, file.buffer.length, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return blobClient.url;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    throw error;
  }
}
