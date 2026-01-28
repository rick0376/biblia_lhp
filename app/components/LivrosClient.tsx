"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "../livros/styles.module.scss";

type Version = "acf" | "ara" | "nvi";

type Livro = {
  id: number;
  name: string;
  slug: string;
  testament: string;
  chaptersCount: number;
};

function normalizarTestamento(t: string) {
  const s = (t || "").toLowerCase();
  if (s.includes("novo")) return "Novo";
  return "Antigo";
}

export default function LivrosClient({
  livros,
  version,
}: {
  livros?: Livro[];
  version: Version;
}) {
  const [q, setQ] = useState("");

  // ✅ estabiliza a referência (para não mudar deps toda render)
  const livrosSafe = useMemo<Livro[]>(
    () => (Array.isArray(livros) ? livros : []),
    [livros],
  );

  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return livrosSafe;

    return livrosSafe.filter(
      (l) =>
        l.name.toLowerCase().includes(s) || l.slug.toLowerCase().includes(s),
    );
  }, [q, livrosSafe]);

  const antigo = useMemo(
    () =>
      filtrados.filter((l) => normalizarTestamento(l.testament) === "Antigo"),
    [filtrados],
  );

  const novo = useMemo(
    () => filtrados.filter((l) => normalizarTestamento(l.testament) === "Novo"),
    [filtrados],
  );

  return (
    <>
      <input
        className={styles.search}
        placeholder="Buscar livro..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Antigo Testamento</h2>
          <span className={styles.sectionBadge}>{antigo.length}</span>
        </div>

        <div className={styles.sectionDivider}>
          <div className={styles.grid}>
            {antigo.map((l) => (
              <Link
                key={l.id}
                href={`/livros/${l.slug}?v=${version}`}
                className={styles.card}
              >
                <div className={styles.cardTitle}>{l.name}</div>
                <div className={styles.count}>{l.chaptersCount} capítulos</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Novo Testamento</h2>
          <span className={styles.sectionBadge}>{novo.length}</span>
        </div>

        <div className={styles.sectionDivider}>
          <div className={styles.grid}>
            {novo.map((l) => (
              <Link
                key={l.id}
                href={`/livros/${l.slug}?v=${version}`}
                className={styles.card}
              >
                <div className={styles.cardTitle}>{l.name}</div>
                <div className={styles.count}>{l.chaptersCount} capítulos</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {filtrados.length === 0 && (
        <p className={styles.empty}>Nenhum livro encontrado.</p>
      )}
    </>
  );
}
