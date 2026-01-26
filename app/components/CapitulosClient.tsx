"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "../livros/[slug]/styles.module.scss";

type ChapterItem = {
  id: number;
  number: number;
  versesCount: number;
};

export default function CapitulosClient({
  slug,
  chapters,
}: {
  slug: string;
  chapters: ChapterItem[];
}) {
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return chapters;

    const numStr = s.replace(/[^\d]/g, "");
    const num = Number(numStr);

    if (!numStr || !Number.isFinite(num) || num <= 0) return chapters;

    return chapters.filter((c) => c.number === num);
  }, [q, chapters]);

  return (
    <>
      <input
        className={styles.search}
        placeholder="Buscar capítulo (ex: 5)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        inputMode="numeric"
      />

      <div className={styles.grid}>
        {filtrados.map((c) => (
          <Link
            key={c.id}
            href={`/livros/${slug}/${c.number}#v-${c.number}`}
            className={styles.card}
          >
            <div className={styles.cardTitle}>Capítulo {c.number}</div>
            <div className={styles.count}>{c.versesCount} versículos</div>
          </Link>
        ))}
      </div>

      {filtrados.length === 0 && (
        <p className={styles.empty}>Nenhum capítulo encontrado.</p>
      )}
    </>
  );
}
