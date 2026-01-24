import { prisma } from "../../lib/prisma";
import styles from "./styles.module.scss";
import LivrosClient from "../components/LivrosClient";

export default async function Livros() {
  const livros = await prisma.book.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { chapters: true } },
    },
    orderBy: { order: "asc" },
  });

  // normaliza para o client
  const livrosFormatados = livros.map((l) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
    chaptersCount: l._count.chapters,
  }));

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Livros da Bíblia</h1>
          <p className={styles.subtitle}>
            Escolha um livro para ver os capítulos e versículos.
          </p>
        </div>
      </div>

      <LivrosClient livros={livrosFormatados} />
    </main>
  );
}
