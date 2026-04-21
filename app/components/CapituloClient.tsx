//app/components/CapituloClient.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../livros/[slug]/[capitulo]/styles.module.scss";

type Versiculo = {
  id: number;
  number: number;
  text: string;
  isFavorite: boolean;
};

type Version = "acf" | "ara" | "nvi" | "kja";

export default function CapituloClient({
  versiculos,
  livro,
  capitulo,
  slug,
  version,
}: {
  versiculos: Versiculo[];
  livro: string;
  capitulo: number;
  slug: string;
  version: Version;
}) {
  const [q, setQ] = useState("");
  const [ativo, setAtivo] = useState<number>(
    () => versiculos?.[0]?.number ?? 1,
  );
  const [favoritos, setFavoritos] = useState<Record<number, boolean>>(
    Object.fromEntries(versiculos.map((v) => [v.id, v.isFavorite])),
  );
  const [carregando, setCarregando] = useState<Record<number, boolean>>({});

  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return versiculos;

    const num = Number(s.replace(/[^\d]/g, ""));
    if (Number.isFinite(num) && num > 0) {
      return versiculos.filter((v) => v.number === num);
    }
    return versiculos.filter((v) => v.text.toLowerCase().includes(s));
  }, [q, versiculos]);

  useEffect(() => {
    const el = document.getElementById(`v-${ativo}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ativo]);

  async function toggleFavorito(verseId: number) {
    try {
      setCarregando((prev) => ({ ...prev, [verseId]: true }));

      const res = await fetch("/api/favoritos/versiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verseId }),
      });

      if (!res.ok) return;

      const data = (await res.json()) as { isFavorite: boolean };

      setFavoritos((prev) => ({
        ...prev,
        [verseId]: data.isFavorite,
      }));
    } finally {
      setCarregando((prev) => ({ ...prev, [verseId]: false }));
    }
  }

  return (
    <div className={styles.container}>
      <Link
        href={`/livros/${slug}?v=${version}#top`}
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

        <span className={styles.badge}>
          {versiculos.length} versículos • {version.toUpperCase()}
        </span>
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
        {filtrados.map((v) => {
          const isFavorite = Boolean(favoritos[v.id]);
          const isLoading = Boolean(carregando[v.id]);

          return (
            <li
              key={v.id}
              id={`v-${v.number}`}
              className={`${styles.verseCard} ${
                ativo === v.number ? styles.active : ""
              }`}
            >
              <div className={styles.verseTop}>
                <div className={styles.verseMeta}>
                  <span className={styles.verseNumber}>{v.number}</span>

                  <button
                    type="button"
                    onClick={() => toggleFavorito(v.id)}
                    disabled={isLoading}
                    className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteBtnActive : ""}`}
                  >
                    {isLoading ? "..." : isFavorite ? "★" : "☆"}
                  </button>
                </div>
              </div>

              <span className={styles.verseText}>{v.text}</span>
            </li>
          );
        })}
      </ol>

      {filtrados.length === 0 && (
        <p className={styles.empty}>Nenhum versículo encontrado.</p>
      )}
    </div>
  );
}
