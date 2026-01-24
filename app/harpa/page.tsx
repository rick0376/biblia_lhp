import Link from "next/link";
import { prisma } from "../../lib/prisma";
import styles from "./styles.module.scss";

export default async function HarpaPage() {
  const hinos = await prisma.hymn.findMany({
    select: { number: true, title: true, _count: { select: { verses: true } } },
    orderBy: { number: "asc" },
  });

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <Link href="/" className={styles.backBtn} aria-label="Voltar">
            ←
          </Link>

          <div>
            <h1 className={styles.title}>Harpa Cristã</h1>
            <p className={styles.subtitle}>
              Selecione um hino para ver as estrofes.
            </p>
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        {hinos.map((h) => (
          <Link
            key={h.number}
            href={`/harpa/${h.number}`}
            className={styles.card}
          >
            <div className={styles.cardTitle}>
              {h.number}. {h.title}
            </div>
            <div className={styles.count}>{h._count.verses} estrofes</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
