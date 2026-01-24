import { prisma } from "../../../lib/prisma";
import styles from "./styles.module.scss";
import CapitulosClient from "../../components/CapitulosClient";

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
        include: { _count: { select: { verses: true } } },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!livro) return <h1>Livro não encontrado</h1>;

  const chapters = livro.chapters.map((c) => ({
    id: c.id,
    number: c.number,
    versesCount: c._count.verses,
  }));

  return (
    <main className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>{livro.name}</h1>
          <p className={styles.subtitle}>
            Selecione um capítulo para abrir os versículos.
          </p>
        </div>

        <span className={styles.badge}>{chapters.length} capítulos</span>
      </div>

      <CapitulosClient slug={livro.slug} chapters={chapters} />
    </main>
  );
}
