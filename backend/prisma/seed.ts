import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { uploadImage } from "../src/services/s3-service";
import fs from "fs";
import path from "path";
import { createActivity } from "../src/services/activity-service";

const prisma = new PrismaClient();

export async function main() {
  console.log("🌱 Populando o banco de dados...");

  const assetsDir = path.join(process.cwd(), "public", "assets");

  const activityTypesMeta = [
    { name: "Futebol", description: "Futebol", fileName: "futebol.jpg" },
    { name: "Música", description: "Eventos musicais", fileName: "musica.jpg" },
    { name: "Tecnologia", description: "Workshops e palestras", fileName: "tecnologia.jpg" },
    {
      name: "Basquete",
      description: "Partidas amistosas ou competitivas",
      fileName: "basquete.jpg",
    },
    { name: "Vôlei", description: "Partidas de vôlei", fileName: "volei.jpg" },
    {
      name: "Caminhada",
      description: "Caminhadas em parques ou trilhas",
      fileName: "caminhada.jpg",
    },
  ];

  const activityTypesData = await Promise.all(
    activityTypesMeta.map(async ({ name, description, fileName }) => {
      const imagePath = path.join(assetsDir, fileName);
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Imagem não encontrada: ${fileName}`);
      }
      const file = {
        originalname: fileName,
        buffer: fs.readFileSync(imagePath),
        mimetype: fileName.endsWith(".jpg") ? "image/png" : "image/jpeg",
      } as Express.Multer.File;
      const image = await uploadImage(file);
      return { name, description, image };
    })
  );

  for (const type of activityTypesData) {
    await prisma.activityType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }
  console.log("Tipos de atividades criados");

  const achievementsData = [
    {
      name: "Convidado",
      criterion: "Faça check-in em uma atividade pela primeira vez.",
    },
    {
      name: "Fine, I'll do it myself",
      criterion: "Crie uma atividade pela primeira vez.",
    },
    { name: "Anfitrião", criterion: "Conclua uma atividade pela primeira vez." },
    { name: "Explorador", criterion: "Participou de 5 atividades diferentes" },
    { name: "Nível Up", criterion: "Alcançou o nível 5" },
    { name: "Jogador", criterion: "Alcançou o nível 10" },
  ];

  for (const achievement of achievementsData) {
    await prisma.achievement.upsert({
      where: { id: achievement.name },
      update: {},
      create: achievement,
    });
  }
  console.log("Achievements criados");

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const hashedPassword2 = await bcrypt.hash("admin12", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@email.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@email.com",
      cpf: "12345678900",
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "admin2@email.com" },
    update: {},
    create: {
      name: "Administrador2",
      email: "admin2@email.com",
      cpf: "12345669900",
      password: hashedPassword2,
    },
  });
  console.log("Usuários criados");

  const activityTypes = await prisma.activityType.findMany();
  if (activityTypes.length > 0) {
    const preferencesData = activityTypes.slice(0, 2).map((type) => ({
      userId: user.id,
      typeId: type.id,
    }));

    const preferencesDataforUser2 = activityTypes.slice(0, 2).map((type) => ({
      userId: user2.id,
      typeId: type.id,
    }));

    await prisma.preference.createMany({
      data: [...preferencesData, ...preferencesDataforUser2],
      skipDuplicates: true,
    });
  }

  const activityTypes2 = await prisma.activityType.findMany();
  if (activityTypes2.length > 0) {
    const sampleActivities = [
      {
        title: "Partida amistosa de basquete",
        description: "Uma atividade de esportes",
        typeId: activityTypes2[3].id,
        scheduledDate: new Date().toISOString(),
        private: false,
        image: "sport-basquete.jpg",
        address: { latitude: -23.55, longitude: -46.63 },
      },
      {
        title: "Show de violão",
        description: "Uma atividade de música",
        typeId: activityTypes2[1].id,
        scheduledDate: new Date().toISOString(),
        private: true,
        image: "show-violao.jpg",
        address: { latitude: -22.9, longitude: -43.2 },
      },
    ];

    for (const a of sampleActivities) {
      const imagePath = path.join(assetsDir, a.image);
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Imagem não encontrada: ${a.image}`);
      }
      const file = {
        originalname: a.image,
        buffer: fs.readFileSync(imagePath),
        mimetype: a.image.endsWith(".jpg") ? "image/jpeg" : "image/png",
      } as Express.Multer.File;

      await createActivity(
        user.id,
        {
          title: a.title,
          description: a.description,
          typeId: a.typeId,
          scheduledDate: a.scheduledDate,
          private: a.private,
          latitude: a.address.latitude,
          longitude: a.address.longitude,
        },
        file
      );
    }
    console.log("Atividades criadas");
  }

  const achievements = await prisma.achievement.findMany();
  if (achievements.length > 0) {
    const userAchievementsData = achievements.slice(0, 2).map((achievement) => ({
      userId: user.id,
      achievementId: achievement.id,
    }));

    const userAchievementsDataforUser2 = achievements.slice(2, 4).map((achievement) => ({
      userId: user2.id,
      achievementId: achievement.id,
    }));

    await prisma.userAchievement.createMany({
      data: [...userAchievementsData, ...userAchievementsDataforUser2],
      skipDuplicates: true,
    });
  }
  console.log("Seed finalizado com sucesso!");

  console.log("Banco de dados populado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
