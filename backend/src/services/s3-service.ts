import { CreateBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs/promises";

const bucketName = process.env.BUCKET_NAME!;

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function createBucket() {
  await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
  console.log("Bucket criado com sucesso.");
  await uploadDefaultAvatar();
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
  return `${process.env.S3_ENDPOINT}/${bucketName}/${file.originalname}`;
}
