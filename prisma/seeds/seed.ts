// prisma/seed.ts
import { prisma } from "../lib/prisma";
import { buscarVersiculos } from "../lib/biblia-api";

const livros = [{ name: "Jó", slug: "jo", testament: "Antigo", order: 18 }];

async function main() {
  console.log("🚀 Iniciando seed (Jó)");

  for (const livro of livros) {
    console.log(`\n📘 Livro: ${livro.name}`);

    const book = await prisma.book.upsert({
      where: { slug: livro.slug },
      update: {
        name: livro.name,
        testament: livro.testament,
        order: livro.order,
      },
      create: livro,
    });

    for (let cap = 1; ; cap++) {
      const versiculos = await buscarVersiculos(livro.name, cap);

      if (versiculos === null) {
        console.error(`❌ Falha ao buscar ${livro.name} cap ${cap}`);
        break;
      }

      if (versiculos.length === 0) {
        console.log(
          `🛑 Fim dos capítulos em ${livro.name}. Último: ${cap - 1}`,
        );
        break;
      }

      const chapter = await prisma.chapter.upsert({
        where: { bookId_number: { bookId: book.id, number: cap } },
        update: {},
        create: { bookId: book.id, number: cap },
      });

      for (const v of versiculos) {
        await prisma.verse.upsert({
          where: {
            chapterId_number: { chapterId: chapter.id, number: v.number },
          },
          update: { text: v.text },
          create: { chapterId: chapter.id, number: v.number, text: v.text },
        });
      }

      console.log(
        `✅ ${livro.name} cap ${cap} (${versiculos.length} versículos)`,
      );
    }
  }

  console.log("\n🎉 Seed concluído!");
}

main()
  .catch((e) => {
    console.error("💥 Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
