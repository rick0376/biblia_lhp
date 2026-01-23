import Link from "next/link";
import { prisma } from "../lib/prisma";
import styles from "./styles.module.scss";

export default async function Home() {
  const booksCount = await prisma.book.count();

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <span className={`${styles.corner} ${styles.cornerTL}`} />
        <span className={`${styles.corner} ${styles.cornerTR}`} />
        <span className={`${styles.corner} ${styles.cornerBL}`} />
        <span className={`${styles.corner} ${styles.cornerBR}`} />

        <div className={styles.inner}>
          <div className={styles.headerRow}>
            <span className={styles.badge}>📜 Leitura • Estudo • Pesquisa</span>
            <span className={styles.badge}>✨ ACF • LHPSYSTEMS</span>
          </div>

          <h1 className={styles.title}>Bíblia Sagrada - LHP</h1>

          <div className={styles.ornament} />

          <p className={styles.subtitle}>
            Uma experiência limpa e rápida para navegar por livros, capítulos e
            versículos. Use a busca em cada página para encontrar o que precisa
            em segundos.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Livros no banco</div>
              <div className={styles.statValue}>{booksCount}</div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statLabel}>Modo</div>
              <div className={styles.statValue}>Leitura</div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statLabel}>Tema</div>
              <div className={styles.statValue}>Dourado</div>
            </div>
          </div>

          <div className={styles.actions}>
            <Link className={styles.primaryBtn} href="/livros">
              Abrir livros →
            </Link>

            <Link className={styles.secondaryBtn} href="/livros/apocalipse">
              Ir para Apocalipse
            </Link>
          </div>

          <div className={styles.footerHint}>
            Dica: depois podemos adicionar favoritos, marcações e modo noturno.
          </div>
        </div>
      </section>
    </main>
  );
}
