import { prisma } from "../lib/prisma";

async function main() {
  // Atualiza um por um sem quebrar se algum não existir
  await prisma.book.updateMany({
    where: { slug: "esdras" },
    data: { order: 15 },
  });
  await prisma.book.updateMany({
    where: { slug: "ester" },
    data: { order: 17 },
  });
  await prisma.book.updateMany({
    where: { slug: "jonas" },
    data: { order: 32 },
  });
  await prisma.book.updateMany({
    where: { slug: "miqueias" },
    data: { order: 33 },
  });
  await prisma.book.updateMany({
    where: { slug: "efesios" },
    data: { order: 49 },
  });

  // AQUI: slug correto é filemom (igual seu seed)
  await prisma.book.updateMany({
    where: { slug: "filemom" },
    data: { order: 57 },
  });

  console.log("✅ Orders atualizados (incluindo filemom=57).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
