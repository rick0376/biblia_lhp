import { prisma } from "../../lib/prisma";
import styles from "./styles.module.scss";
import LivrosClient from "../components/LivrosClient";
import Link from "next/link";

export default async function Livros() {
  const livros = await prisma.book.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      testament: true,
      _count: { select: { chapters: true } },
    },
    orderBy: { order: "asc" },
  });

  type LivroRow = (typeof livros)[number];

  const livrosFormatados = livros.map((l: LivroRow) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
    testament: l.testament,
    chaptersCount: l._count.chapters,
  }));

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <Link href="/" className={styles.backBtn} aria-label="Voltar">
            ←
          </Link>

          <div>
            <h1 className={styles.title}>Livros da Bíblia</h1>
            <p className={styles.subtitle}>
              Selecione um livro para ver capítulos e versículos.
            </p>
          </div>
        </div>
      </div>

      <LivrosClient livros={livrosFormatados} />
    </main>
  );
}
