import { prisma } from "../lib/prisma";

async function main() {
  await prisma.book.updateMany({
    where: { slug: { in: ["salmos", "isaias", "jeremias"] } },
    data: {}, // só pra garantir que existe; vamos atualizar um por um abaixo
  });

  await prisma.book.update({ where: { slug: "salmos" }, data: { order: 19 } });
  await prisma.book.update({ where: { slug: "isaias" }, data: { order: 23 } });
  await prisma.book.update({
    where: { slug: "jeremias" },
    data: { order: 24 },
  });

  console.log(
    "✅ Order atualizado no banco para: salmos=19, isaias=23, jeremias=24",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
