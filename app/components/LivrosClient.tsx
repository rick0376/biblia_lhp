"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Livro = { id: number; name: string; slug: string };

export default function LivrosClient({
  livros,
  styles,
}: {
  livros: Livro[];
  styles: Record<string, string>;
}) {
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return livros;
    return livros.filter(
      (l) =>
        l.name.toLowerCase().includes(s) || l.slug.toLowerCase().includes(s),
    );
  }, [q, livros]);

  return (
    <>
      <input
        className={styles.search}
        placeholder="Buscar livro..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={styles.grid}>
        {filtrados.map((l) => (
          <Link key={l.id} href={`/livros/${l.slug}`} className={styles.card}>
            {l.name}
          </Link>
        ))}
      </div>

      {filtrados.length === 0 && (
        <p className={styles.empty}>Nenhum livro encontrado.</p>
      )}
    </>
  );
}
