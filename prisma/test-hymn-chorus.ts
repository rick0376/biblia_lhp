import { prisma } from "../lib/prisma";

async function main() {
  await prisma.hymn.create({
    data: { number: 9999, title: "Teste", chorus: "coro" },
  });

  const h = await prisma.hymn.findUnique({ where: { number: 9999 } });
  console.log(h);

  await prisma.hymn.delete({ where: { number: 9999 } });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
