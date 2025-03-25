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
  ];

  for (const type of activityTypesData) {
    await prisma.activityType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }

  console.log("✅ Tipos de atividades criados");

  // 🔹 Criando Achievements (Conquistas)
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
  ];

  for (const achievement of achievementsData) {
    await prisma.achievement.upsert({
      where: { id: achievement.name },
      update: {},
      create: achievement,
    });
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@email.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@email.com",
      cpf: "123.456.789-00",
      password: hashedPassword,
    },
  });

  const activityTypes = await prisma.activityType.findMany();
  if (activityTypes.length > 0) {
    const preferencesData = activityTypes.slice(0, 2).map((type) => ({
      userId: user.id,
      typeId: type.id,
    }));

    await prisma.preference.createMany({
      data: preferencesData,
      skipDuplicates: true,
    });
  }

  const achievements = await prisma.achievement.findMany();
  if (achievements.length > 0) {
    const userAchievementsData = achievements
      .slice(0, 2)
      .map((achievement) => ({
        userId: user.id,
        achievementId: achievement.id,
      }));

    await prisma.userAchievement.createMany({
      data: userAchievementsData,
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
