import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  BucketLocationConstraint,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const region = process.env.AWS_REGION || "us-east-2";
const bucketName = process.env.BUCKET_NAME || "douglascamposfitmeet";
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

console.log(`Tentando configurar bucket com config: {
  region: '${region}',
  bucketName: '${bucketName}',
  hasAccessKey: ${Boolean(accessKey)},
  hasSecretKey: ${Boolean(secretKey)}
}`);

if (!accessKey || !secretKey) {
  throw new Error("AWS credentials are not properly configured.");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

async function configureBucketPublicAccess(bucketName: string) {
  try {
    await s3Client.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false,
        },
      })
    );

    const bucketPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      })
    );

    console.log("Acesso público configurado com sucesso");
  } catch (error) {
    console.error("Erro ao configurar acesso público:", error);
    throw error;
  }
}

export async function createBucket() {
  try {
    console.log(`Verificando se o bucket '${bucketName}' já existe...`);
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`O bucket '${bucketName}' já existe.`);
    await configureBucketPublicAccess(bucketName);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "NotFound" ||
        err.message.includes("NoSuchBucket") ||
        err.message.includes("NotFound"))
    ) {
      console.log(`O bucket '${bucketName}' não existe, tentando criar...`);
      try {
        await s3Client.send(
          new CreateBucketCommand({
            Bucket: bucketName,
            CreateBucketConfiguration: {
              LocationConstraint: region as BucketLocationConstraint,
            },
          })
        );

        console.log("Bucket criado, configurando acesso público...");
        await configureBucketPublicAccess(bucketName);

        console.log("Tentando fazer upload do avatar...");
        await uploadDefaultAvatar();
      } catch (createErr) {
        if (createErr instanceof Error) {
          console.error(`Erro ao criar bucket: ${createErr.name} - ${createErr.message}`);
        } else {
          console.error(`Erro ao criar bucket: ${String(createErr)}`);
        }

        if (
          (createErr instanceof Error && createErr.name === "BucketAlreadyExists") ||
          (createErr instanceof Error && createErr.name === "BucketAlreadyOwnedByYou")
        ) {
          console.log("O bucket já existe, continuando...");
        } else {
          throw createErr;
        }
      }
    } else {
      if (err instanceof Error) {
        console.error(`Erro ao verificar bucket: ${err.name} - ${err.message}`);
      } else {
        console.error(`Erro ao verificar bucket: ${String(err)}`);
      }
      throw err;
    }
  }
}

export async function uploadDefaultAvatar() {
  try {
    console.log("Iniciando upload do avatar padrão...");
    const defaultImagePath = path.join(process.cwd(), "src", "tests", "mocks", "avatar.png");

    console.log("Procurando arquivo em:", defaultImagePath);
    if (!fs.existsSync(defaultImagePath)) {
      console.error("Arquivo não encontrado!");
      return;
    }

    console.log("Arquivo encontrado, lendo conteúdo...");
    const fileContent = fs.readFileSync(defaultImagePath);

    console.log("Enviando para S3...");
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: "avatar.png",
        Body: fileContent,
        ContentType: "image/png",
      })
    );

    console.log("Avatar padrão enviado com sucesso!");
  } catch (uploadErr) {
    console.error("Erro detalhado ao enviar avatar:", {
      name: uploadErr instanceof Error ? uploadErr.name : "Unknown",
      message: uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
    });
    throw uploadErr;
  }
}

export async function uploadImage(file: Express.Multer.File) {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    console.log(`Imagem ${file.originalname} enviada para o bucket.`);
    return `https://${bucketName}.s3.${region}.amazonaws.com/${file.originalname}`;
  } catch (uploadErr) {
    console.error(
      "Erro ao enviar imagem:",
      uploadErr instanceof Error ? uploadErr.message : String(uploadErr)
    );
    throw uploadErr;
  }
}
