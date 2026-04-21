//app/components/HinoClient.tsx

"use client";

import { useState } from "react";

type Verse = {
  id: number;
  type: string;
  number: number;
  text: string;
};

export default function HinoClient({
  hymnId,
  hymnNumber,
  hymnTitle,
  isFavorite,
  verses,
  styles,
}: {
  hymnId: number;
  hymnNumber: number;
  hymnTitle: string;
  isFavorite: boolean;
  verses: Verse[];
  styles: Record<string, string>;
}) {
  const [favorito, setFavorito] = useState(isFavorite);
  const [carregando, setCarregando] = useState(false);

  async function toggleFavorito() {
    try {
      setCarregando(true);

      const res = await fetch("/api/favoritos/hinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hymnId }),
      });

      if (!res.ok) return;

      const data = (await res.json()) as { isFavorite: boolean };
      setFavorito(data.isFavorite);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontWeight: 600,
          }}
        >
          Hino {hymnNumber} • {hymnTitle}
        </div>

        <button
          type="button"
          onClick={toggleFavorito}
          disabled={carregando}
          style={{
            border: "1px solid rgba(245, 189, 64, 0.35)",
            background: favorito
              ? "linear-gradient(135deg, #f6e27a, #f0b90b)"
              : "rgba(255,255,255,0.04)",
            color: favorito ? "#1b1b1b" : "#f6d36a",
            borderRadius: "999px",
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {carregando
            ? "..."
            : favorito
              ? "★ Hino favorito"
              : "☆ Favoritar hino"}
        </button>
      </div>

      <ol className={styles.list}>
        {verses.map((v) => (
          <li key={v.id} className={styles.card}>
            {v.type === "VERSE" && (
              <>
                <div className={styles.badge}>Estrofe {v.number}</div>
                <pre className={styles.text}>{v.text}</pre>
              </>
            )}

            {v.type === "CHORUS" && (
              <div className={styles.chorusBox}>
                <div className={styles.chorusBadge}>Coro</div>
                <pre className={styles.chorusText}>{v.text}</pre>
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
