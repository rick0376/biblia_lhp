import { prisma } from "../lib/prisma";
import { buscarVersiculos } from "../lib/biblia-api";

// Lista de livros da Bíblia
const livros = [
  { name: "Gênesis", slug: "genesis", testament: "Antigo", order: 1 },
  { name: "Êxodo", slug: "exodo", testament: "Antigo", order: 2 },
  { name: "Levítico", slug: "levitico", testament: "Antigo", order: 3 },
  { name: "Números", slug: "numeros", testament: "Antigo", order: 4 },
  { name: "Deuteronômio", slug: "deuteronomio", testament: "Antigo", order: 5 },
  { name: "Josué", slug: "josue", testament: "Antigo", order: 6 },
  { name: "Juízes", slug: "juizes", testament: "Antigo", order: 7 },
  { name: "Rute", slug: "rute", testament: "Antigo", order: 8 },
  { name: "1 Samuel", slug: "1-samuel", testament: "Antigo", order: 9 },
  { name: "2 Samuel", slug: "2-samuel", testament: "Antigo", order: 10 },
  { name: "1 Reis", slug: "1-reis", testament: "Antigo", order: 11 },
  { name: "2 Reis", slug: "2-reis", testament: "Antigo", order: 12 },
  { name: "1 Crônicas", slug: "1-cronicas", testament: "Antigo", order: 13 },
  { name: "2 Crônicas", slug: "2-cronicas", testament: "Antigo", order: 14 },
  { name: "Esdras", slug: "esdras", testament: "Antigo", order: 15 },
  { name: "Neemias", slug: "neemias", testament: "Antigo", order: 16 },
  { name: "Ester", slug: "ester", testament: "Antigo", order: 17 },
  { name: "Jó", slug: "jo", testament: "Antigo", order: 18 },
  { name: "Salmos", slug: "salmos", testament: "Antigo", order: 19 },
  { name: "Provérbios", slug: "proverbios", testament: "Antigo", order: 20 },
  { name: "Eclesiastes", slug: "eclesiastes", testament: "Antigo", order: 21 },
  { name: "Cânticos", slug: "canticos", testament: "Antigo", order: 22 },
  { name: "Isaías", slug: "isaias", testament: "Antigo", order: 23 },
  { name: "Jeremias", slug: "jeremias", testament: "Antigo", order: 24 },
  { name: "Lamentações", slug: "lamentacoes", testament: "Antigo", order: 25 },
  { name: "Ezequiel", slug: "ezequiel", testament: "Antigo", order: 26 },
  { name: "Daniel", slug: "daniel", testament: "Antigo", order: 27 },
  { name: "Oseias", slug: "oseias", testament: "Antigo", order: 28 },
  { name: "Joel", slug: "joel", testament: "Antigo", order: 29 },
  { name: "Amós", slug: "amos", testament: "Antigo", order: 30 },
  { name: "Obadias", slug: "obadias", testament: "Antigo", order: 31 },
  { name: "Jonas", slug: "jonas", testament: "Antigo", order: 32 },
  { name: "Miqueias", slug: "miqueias", testament: "Antigo", order: 33 },
  { name: "Naum", slug: "naum", testament: "Antigo", order: 34 },
  { name: "Habacuque", slug: "habacuque", testament: "Antigo", order: 35 },
  { name: "Sofonias", slug: "sofonias", testament: "Antigo", order: 36 },
  { name: "Ageu", slug: "ageu", testament: "Antigo", order: 37 },
  { name: "Zacarias", slug: "zacarias", testament: "Antigo", order: 38 },
  { name: "Malaquias", slug: "malaquias", testament: "Antigo", order: 39 },

  { name: "Mateus", slug: "mateus", testament: "Novo", order: 40 },
  { name: "Marcos", slug: "marcos", testament: "Novo", order: 41 },
  { name: "Lucas", slug: "lucas", testament: "Novo", order: 42 },
  { name: "João", slug: "joao", testament: "Novo", order: 43 },
  { name: "Atos", slug: "atos", testament: "Novo", order: 44 },
  { name: "Romanos", slug: "romanos", testament: "Novo", order: 45 },
  { name: "1 Coríntios", slug: "1-corintios", testament: "Novo", order: 46 },
  { name: "2 Coríntios", slug: "2-corintios", testament: "Novo", order: 47 },
  { name: "Gálatas", slug: "galatas", testament: "Novo", order: 48 },
  { name: "Efésios", slug: "efesios", testament: "Novo", order: 49 },
  { name: "Filipenses", slug: "filipenses", testament: "Novo", order: 50 },
  { name: "Colossenses", slug: "colossenses", testament: "Novo", order: 51 },
  {
    name: "1 Tessalonicenses",
    slug: "1-tessalonicenses",
    testament: "Novo",
    order: 52,
  },
  {
    name: "2 Tessalonicenses",
    slug: "2-tessalonicenses",
    testament: "Novo",
    order: 53,
  },
  { name: "1 Timóteo", slug: "1-timoteo", testament: "Novo", order: 54 },
  { name: "2 Timóteo", slug: "2-timoteo", testament: "Novo", order: 55 },
  { name: "Tito", slug: "tito", testament: "Novo", order: 56 },
  { name: "Filemom", slug: "filemom", testament: "Novo", order: 57 },
  { name: "Hebreus", slug: "hebreus", testament: "Novo", order: 58 },
  { name: "Tiago", slug: "tiago", testament: "Novo", order: 59 },
  { name: "1 Pedro", slug: "1-pedro", testament: "Novo", order: 60 },
  { name: "2 Pedro", slug: "2-pedro", testament: "Novo", order: 61 },
  { name: "1 João", slug: "1-joao", testament: "Novo", order: 62 },
  { name: "2 João", slug: "2-joao", testament: "Novo", order: 63 },
  { name: "3 João", slug: "3-joao", testament: "Novo", order: 64 },
  { name: "Judas", slug: "judas", testament: "Novo", order: 65 },
  { name: "Apocalipse", slug: "apocalipse", testament: "Novo", order: 66 },
];

async function main() {
  console.log("Iniciando a importação dos livros...");

  for (const livro of livros) {
    console.log(`Processando o livro: ${livro.name}`);

    const book = await prisma.book.upsert({
      where: { slug: livro.slug },
      update: {},
      create: {
        name: livro.name,
        slug: livro.slug,
        testament: livro.testament,
        order: livro.order,
      },
    });

    console.log(`Livro ${livro.name} processado com sucesso!`);

    // Populando capítulos
    for (let i = 1; i <= 50; i++) {
      console.log(`Processando o capítulo ${i} do livro ${livro.name}`);

      const chapter = await prisma.chapter.upsert({
        where: {
          bookId_number: { bookId: book.id, number: i },
        },
        update: {},
        create: {
          bookId: book.id,
          number: i,
        },
      });

      console.log(
        `Capítulo ${i} do livro ${livro.name} processado com sucesso!`,
      );

      try {
        // Chamando a função com os 3 parâmetros (slug, capítulo, versão ACF)
        const versiculos = await buscarVersiculos(livro.slug, i);
        console.log(
          `Buscando versículos do capítulo ${i} do livro ${livro.name}`,
        );

        if (versiculos && versiculos.length > 0) {
          for (const versiculo of versiculos) {
            await prisma.verse.create({
              data: {
                chapterId: chapter.id,
                number: versiculo.number,
                text: versiculo.text,
              },
            });
          }
          console.log(
            `Versículos do capítulo ${i} do livro ${livro.name} foram inseridos com sucesso!`,
          );
        } else {
          console.log(
            `Nenhum versículo encontrado para o capítulo ${i} do livro ${livro.name}.`,
          );
        }
      } catch (error) {
        console.error(
          `Erro ao buscar versículos para o capítulo ${i} do livro ${livro.name}:`,
          error,
        );
      }
    }
  }

  console.log("Importação concluída!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
