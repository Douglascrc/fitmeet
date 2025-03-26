import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Populando o banco de dados...");

  const activityTypesData = [
    { name: "Esportes", description: "Atividades esportivas" },
    { name: "Música", description: "Eventos musicais" },
    {
      name: "Tecnologia",
      description: "Workshops e palestras sobre tecnologia",
    },
    { name: "Artes Visuais", description: "Exposições e oficinas de arte" },
    {
      name: "Teatro",
      description: "Apresentações teatrais e oficinas de interpretação",
    },
    { name: "Culinária", description: "Workshops e eventos gastronômicos" },
    {
      name: "Viagens",
      description: "Palestras e eventos sobre destinos turísticos",
    },
    {
      name: "Literatura",
      description: "Clubes de leitura e lançamentos de livros",
    },
    { name: "Moda", description: "Desfiles e workshops de estilo" },
  ];

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
      name: "Primeiro Check-in",
      criterion: "Fez check-in em uma atividade pela primeira vez",
    },
    {
      name: "Criador de Atividades",
      criterion: "Criou uma atividade pela primeira vez",
    },
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
        title: "Nadar 100m rasos",
        description: "Uma atividade de esportes",
        typeId: activityTypes2[0].id,
        confirmationCode: "ABC123",
        scheduledDate: new Date("2025-03-20T18:00:00Z"),
        private: false,
        creatorId: user.id,
        address: { latitude: -23.55, longitude: -46.63 },
      },
      {
        title: "Tocar violão",
        description: "Uma atividade de música",
        typeId: activityTypes2[1].id,
        confirmationCode: "DEF456",
        scheduledDate: new Date("2025-04-15T20:00:00Z"),
        private: true,
        creatorId: user2.id,
        address: { latitude: -22.9, longitude: -43.2 },
      },
    ];

    for (const a of sampleActivities) {
      await prisma.activity.create({
        data: {
          title: a.title,
          description: a.description,
          typeId: a.typeId,
          confirmationCode: a.confirmationCode,
          scheduledDate: a.scheduledDate,
          private: a.private,
          creatorId: a.creatorId,
          address: {
            create: {
              latitude: a.address.latitude,
              longitude: a.address.longitude,
            },
          },
        },
      });
    }
    console.log("Atividades criadas");
  }

  const achievements = await prisma.achievement.findMany();
  if (achievements.length > 0) {
    const userAchievementsData = achievements
      .slice(0, 2)
      .map((achievement) => ({
        userId: user.id,
        achievementId: achievement.id,
      }));

    const userAchievementsDataforUser2 = achievements
      .slice(2, 4)
      .map((achievement) => ({
        userId: user2.id,
        achievementId: achievement.id,
      }));

    await prisma.userAchievement.createMany({
      data: [...userAchievementsData, ...userAchievementsDataforUser2],
      skipDuplicates: true,
    });
  }
  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
