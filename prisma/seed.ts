// prisma/seed.ts

import { prisma } from "../lib/prisma";
import { buscarVersiculos } from "../lib/biblia-api";

const livros = [
  { name: "Salmos", slug: "salmos", testament: "Antigo", order: 19 },
  { name: "Isaías", slug: "isaias", testament: "Antigo", order: 23 },
  { name: "Jeremias", slug: "jeremias", testament: "Antigo", order: 24 },
];

async function main() {
  console.log("🚀 Iniciando seed da Bíblia");

  for (const livro of livros) {
    console.log(`\n📘 Livro: ${livro.name}`);

    const book = await prisma.book.upsert({
      where: { slug: livro.slug },
      update: {},
      create: livro,
    });

    // vai incrementando capítulos até não existir mais
    for (let cap = 1; ; cap++) {
      const versiculos = await buscarVersiculos(livro.slug, cap);

      // null = erro real (token, rede, etc.)
      if (versiculos === null) {
        console.error(
          `❌ Falha ao buscar versículos de ${livro.slug} cap ${cap}`,
        );
        break;
      }

      // [] = capítulo não existe (ou acabou)
      if (versiculos.length === 0) {
        console.log(
          `🛑 Fim dos capítulos em ${livro.name}. Último cap válido: ${cap - 1}`,
        );
        break;
      }

      const chapter = await prisma.chapter.upsert({
        where: {
          bookId_number: {
            bookId: book.id,
            number: cap,
          },
        },
        update: {},
        create: {
          bookId: book.id,
          number: cap,
        },
      });

      for (const v of versiculos) {
        await prisma.verse.upsert({
          where: {
            chapterId_number: {
              chapterId: chapter.id,
              number: v.number,
            },
          },
          update: {
            text: v.text,
          },
          create: {
            chapterId: chapter.id,
            number: v.number,
            text: v.text,
          },
        });
      }

      console.log(
        `✅ ${livro.name} cap ${cap} importado (${versiculos.length} versículos)`,
      );
    }
  }

  console.log("\n🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("💥 Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
