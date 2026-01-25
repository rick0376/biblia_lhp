import { prisma } from "../lib/prisma";

async function main() {
  const nums = [1, 2];

  console.log("🧹 Removendo hinos de teste:", nums.join(", "));

  // apaga versos primeiro
  await prisma.hymnVerse.deleteMany({
    where: {
      hymn: { number: { in: nums } },
    },
  });

  // apaga hinos
  await prisma.hymn.deleteMany({
    where: { number: { in: nums } },
  });

  console.log("✅ Removidos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
