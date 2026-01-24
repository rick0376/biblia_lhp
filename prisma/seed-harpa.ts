import { prisma } from "../lib/prisma";
import { harpaHinos } from "../data/harpa/harpa";

async function seedHarpa() {
  console.log("🎵 Iniciando seed da Harpa Cristã");

  for (const hino of harpaHinos) {
    const hymn = await prisma.hymn.upsert({
      where: { number: hino.number },
      update: {
        title: hino.title,
      },
      create: {
        number: hino.number,
        title: hino.title,
      },
    });

    for (let i = 0; i < hino.verses.length; i++) {
      await prisma.hymnVerse.upsert({
        where: {
          hymnId_number: {
            hymnId: hymn.id,
            number: i + 1,
          },
        },
        update: {
          text: hino.verses[i],
        },
        create: {
          hymnId: hymn.id,
          number: i + 1,
          text: hino.verses[i],
        },
      });
    }

    console.log(`✅ Hino ${hino.number} - ${hino.title}`);
  }

  console.log("🎉 Harpa importada com sucesso!");
}

seedHarpa()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
