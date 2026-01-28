import { prisma } from "../../../../lib/prisma";
import CapituloClient from "../../../components/CapituloClient";

type Version = "acf" | "ara" | "nvi";

function normalizeVersion(v?: string): Version {
  if (v === "acf" || v === "ara" || v === "nvi") return v;
  return "acf";
}

export default async function CapituloPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; capitulo: string }>;
  searchParams?: Promise<{ v?: string }>;
}) {
  const { slug, capitulo } = await params;
  const { v } = (await searchParams) ?? {};
  const version = normalizeVersion(v);

  const numeroCapitulo = Number(capitulo);
  if (!Number.isFinite(numeroCapitulo) || numeroCapitulo <= 0) {
    return <h1>Capítulo inválido</h1>;
  }

  const translation = await prisma.translation.findUnique({
    where: { code: version },
    select: { id: true },
  });

  if (!translation) return <h1>Tradução não encontrada</h1>;

  const chapter = await prisma.chapter.findFirst({
    where: {
      number: numeroCapitulo,
      book: { slug },
      verses: { some: { translationId: translation.id } },
    },
    include: {
      book: true,
      verses: {
        where: { translationId: translation.id },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!chapter) return <h1>Capítulo não encontrado</h1>;

  return (
    <CapituloClient
      slug={slug}
      livro={chapter.book.name}
      capitulo={chapter.number}
      versiculos={chapter.verses.map((vv) => ({
        number: vv.number,
        text: vv.text,
      }))}
      version={version}
    />
  );
}
