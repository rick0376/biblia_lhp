import { prisma } from "../lib/prisma";

async function main() {
  console.log("🧹 Limpando Harpa Cristã...");

  // Apaga primeiro os versos (por segurança)
  await prisma.hymnVerse.deleteMany({});
  await prisma.hymn.deleteMany({});

  console.log("✅ Harpa Cristã removida do banco.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
