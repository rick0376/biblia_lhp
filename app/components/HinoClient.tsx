"use client";

import { useMemo, useState } from "react";

type Verse = { number: number; text: string };

export default function HinoClient({
  verses,
  styles,
}: {
  verses: Verse[];
  styles: Record<string, string>;
}) {
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return verses;

    // se digitou número, filtra por estrofe
    const num = Number(s.replace(/[^\d]/g, ""));
    if (Number.isFinite(num) && num > 0) {
      return verses.filter((v) => v.number === num);
    }

    // busca por texto
    return verses.filter((v) => v.text.toLowerCase().includes(s));
  }, [q, verses]);

  return (
    <>
      <input
        className={styles.search}
        placeholder="Buscar estrofe (ex: 2) ou palavra..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <ol className={styles.list}>
        {filtrados.map((v) => (
          <li key={v.number} className={styles.card}>
            <div className={styles.badge}>Estrofe {v.number}</div>
            <pre className={styles.text}>{v.text}</pre>
          </li>
        ))}
      </ol>

      {filtrados.length === 0 && (
        <p className={styles.empty}>Nada encontrado.</p>
      )}
    </>
  );
}
