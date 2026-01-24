import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import styles from "./styles.module.scss";
import CapitulosClient from "../../components/CapitulosClient"; // se estiver usando

type ChapterItem = {
  id: number;
  number: number;
  _count: { verses: number };
};

export default async function LivroPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const livro = await prisma.book.findUnique({
    where: { slug },
    include: {
      chapters: {
        where: { verses: { some: {} } }, // não mostrar vazios
        include: { _count: { select: { verses: true } } },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!livro) return <h1>Livro não encontrado</h1>;

  // se você usa client component:
  const chapters = (livro.chapters as ChapterItem[]).map((c) => ({
    id: c.id,
    number: c.number,
    versesCount: c._count.verses,
  }));

  return (
    <main className={styles.container}>
      <Link
        href="/livros"
        className={styles.backLink}
        aria-label="Voltar para livros"
      >
        <span className={styles.backIcon}>←</span>
        <span className={styles.backText}>Voltar</span>
      </Link>

      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{livro.name}</h1>
          <p className={styles.subtitle}>Escolha um capítulo</p>
        </div>

        <span className={styles.badge}>{chapters.length} capítulos</span>
      </div>

      <CapitulosClient slug={livro.slug} chapters={chapters} />
    </main>
  );
}
