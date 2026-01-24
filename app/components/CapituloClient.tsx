"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../livros/[slug]/[capitulo]/styles.module.scss";

type Versiculo = { number: number; text: string };

export default function CapituloClient({
  versiculos,
  livro,
  capitulo,
  slug,
}: {
  versiculos: Versiculo[];
  livro: string;
  capitulo: number;
  slug: string;
}) {
  const [q, setQ] = useState("");
  const [ativo, setAtivo] = useState<number>(
    () => versiculos?.[0]?.number ?? 1,
  );

  // filtra versículos por texto ou número
  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return versiculos;

    const num = Number(s.replace(/[^\d]/g, ""));
    if (Number.isFinite(num) && num > 0) {
      return versiculos.filter((v) => v.number === num);
    }
    return versiculos.filter((v) => v.text.toLowerCase().includes(s));
  }, [q, versiculos]);

  // ao carregar: destacar o primeiro versículo (ou o 1)
  useEffect(() => {
    const el = document.getElementById(`v-${ativo}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ativo]);

  return (
    <div className={styles.container}>
      <Link
        href={`/livros/${slug}`}
        className={styles.backLink}
        aria-label="Voltar para capítulos"
      >
        <span className={styles.backIcon}>←</span>
        <span className={styles.backText}>Voltar</span>
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>
          {livro} {capitulo}
        </h1>
        <span className={styles.badge}>{versiculos.length} versículos</span>
      </div>

      <input
        className={styles.search}
        placeholder="Buscar versículo (número ou texto)..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={styles.verseNav}>
        {filtrados.map((v) => (
          <button
            key={v.number}
            className={`${styles.verseBtn} ${
              ativo === v.number ? styles.activeBtn : ""
            }`}
            onClick={() => {
              setAtivo(v.number);
              document
                .getElementById(`v-${v.number}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            {v.number}
          </button>
        ))}
      </div>

      <ol className={styles.verses}>
        {filtrados.map((v) => (
          <li
            key={v.number}
            id={`v-${v.number}`}
            className={`${styles.verseCard} ${
              ativo === v.number ? styles.active : ""
            }`}
          >
            <span className={styles.verseNumber}>{v.number}</span>
            <span className={styles.verseText}>{v.text}</span>
          </li>
        ))}
      </ol>

      {filtrados.length === 0 && (
        <p className={styles.empty}>Nenhum versículo encontrado.</p>
      )}
    </div>
  );
}
