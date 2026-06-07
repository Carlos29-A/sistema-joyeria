import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Iniciando seed...");

  const adminExists = await prisma.user.findFirst({
    where: { role: "administrador" },
  });

  if (!adminExists) {
    const passwordHash = await bcrypt.hash("admin123", 12);

    await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@joyeria.pe",
        passwordHash,
        role: "administrador",
      },
    });

    console.log("✅ Administrador creado: admin@joyeria.pe / admin123");
  } else {
    console.log("ℹ️  Ya existe un administrador.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
