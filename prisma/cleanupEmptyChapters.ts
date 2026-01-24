import { prisma } from "../lib/prisma";

async function main() {
  console.log("🧹 Apagando capítulos sem versículos...");

  // Primeiro apaga capítulos sem versículos
  const chapters = await prisma.chapter.deleteMany({
    where: {
      verses: { none: {} }, // nenhum versículo ligado
    },
  });

  console.log(`✅ Capítulos apagados: ${chapters.count}`);

  console.log("🎉 Cleanup concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
