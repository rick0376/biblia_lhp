import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import styles from "./styles.module.scss";

export default async function HinoPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const n = Number(numero);

  if (!Number.isFinite(n)) return <h1>Hino inválido</h1>;

  const hino = await prisma.hymn.findUnique({
    where: { number: n },
    include: { verses: { orderBy: { number: "asc" } } },
  });

  if (!hino) return <h1>Hino não encontrado</h1>;

  return (
    <main className={styles.container}>
      <header className={styles.headerRow}>
        <Link href="/harpa" className={styles.backBtn} aria-label="Voltar">
          ←
        </Link>

        <div>
          <h1 className={styles.title}>
            {hino.number}. {hino.title}
          </h1>
          <p className={styles.subtitle}>{hino.verses.length} estrofes</p>
        </div>
      </header>

      <ol className={styles.list}>
        {hino.verses.map((v) => (
          <li key={v.number} className={styles.card}>
            <div className={styles.badge}>Estrofe {v.number}</div>
            <pre className={styles.text}>{v.text}</pre>
          </li>
        ))}
      </ol>
    </main>
  );
}
