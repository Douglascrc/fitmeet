import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs/promises";

const bucketName = process.env.BUCKET_NAME!;
const region = process.env.AWS_REGION!;
const credentials = {
  accessKeyId: process.env.ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
};

const clientConfig: S3ClientConfig = { region, credentials };

if (process.env.NODE_ENV !== "production") {
  clientConfig.endpoint = process.env.S3_ENDPOINT;
  clientConfig.forcePathStyle = true;
}

const s3 = new S3Client(clientConfig);

export async function createBucket() {
  try {
    console.log("Tentando criar bucket com config:", {
      region,
      bucketName,
      hasAccessKey: !!process.env.ACCESS_KEY,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    });

    await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log("Bucket criado com sucesso.");
    await uploadDefaultAvatar();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Detalhes do erro:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      if (error.name === "BucketAlreadyExists") {
        console.log("Bucket já existe, continuando...");
        return;
      }
      throw error;
    }
    console.error("Erro desconhecido:", error);
    throw new Error("Erro desconhecido ao criar bucket");
  }
}

export async function uploadDefaultAvatar() {
  try {
    const filePath = path.join(process.cwd(), "src", "tests", "mocks", "avatar.png");
    const fileBuffer = await fs.readFile(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Key: "avatar.png",
      Body: fileBuffer,
      ContentType: "image/png",
    };
    await s3.send(new PutObjectCommand(uploadParams));
    console.log("Imagem padrão (avatar.png) enviada para o bucket.");
  } catch (error) {
    console.error("Erro ao enviar a imagem padrão:", error);
  }
}

export async function uploadImage(file: Express.Multer.File) {
  const uploadParams = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return process.env.NODE_ENV === "production"
    ? `https://${bucketName}.s3.${region}.amazonaws.com/${file.originalname}`
    : `${process.env.S3_ENDPOINT}/${bucketName}/${file.originalname}`;
}
