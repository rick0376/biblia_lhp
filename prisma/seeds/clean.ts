//prisma/clean.ts

import { prisma } from "../lib/prisma";

async function limparSomenteAlgunsLivros() {
  const slugs = ["jo"];

  console.log("Apagando somente:", slugs.join(", "));

  // 1) Verses desses livros
  await prisma.verse.deleteMany({
    where: {
      chapter: {
        book: {
          slug: { in: slugs },
        },
      },
    },
  });

  // 2) Chapters desses livros
  await prisma.chapter.deleteMany({
    where: {
      book: {
        slug: { in: slugs },
      },
    },
  });

  // 3) Books
  await prisma.book.deleteMany({
    where: {
      slug: { in: slugs },
    },
  });

  console.log("Remoção concluída.");
}

limparSomenteAlgunsLivros()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
