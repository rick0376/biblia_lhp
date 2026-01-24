import { prisma } from "../../../../lib/prisma";
import { buscarVersiculos } from "../../../../lib/biblia-api";
import CapituloClient from "../../../components/CapituloClient";

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ slug: string; capitulo: string }>;
}) {
  const { slug, capitulo } = await params;
  const numeroCapitulo = Number(capitulo);

  const chapter = await prisma.chapter.findFirst({
    where: {
      number: numeroCapitulo,
      book: { slug },
    },
    include: {
      book: true,
      verses: { orderBy: { number: "asc" } },
    },
  });

  if (!chapter) return <h1>Capítulo não encontrado</h1>;

  const versiculos =
    chapter.verses.length > 0
      ? chapter.verses.map((v) => ({ number: v.number, text: v.text }))
      : ((await buscarVersiculos(slug, chapter.number)) ?? []);

  return (
    <CapituloClient
      key={`${slug}-${chapter.number}`}
      livro={chapter.book.name}
      capitulo={chapter.number}
      versiculos={versiculos}
    />
  );
}
