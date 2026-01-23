"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../livros/[slug]/[capitulo]/styles.module.scss";

type Versiculo = { number: number; text: string };

export default function CapituloClient({
  versiculos,
  livro,
  capitulo,
}: {
  versiculos: Versiculo[];
  livro: string;
  capitulo: number;
}) {
  const [q, setQ] = useState("");
  const [ativo, setAtivo] = useState<number>(() => capitulo);

  // quando trocar de capítulo (navegação), reseta o versículo ativo
  useEffect(() => {
    setAtivo(capitulo);
  }, [capitulo]);

  // scroll pro versículo ativo
  useEffect(() => {
    const el = document.getElementById(`v-${ativo}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ativo]);

  // busca por número ou texto
  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return versiculos;

    // se digitou número, filtra por número também
    const numStr = s.replace(/[^\d]/g, "");
    const num = Number(numStr);

    return versiculos.filter((v) => {
      const matchNumero = numStr ? v.number === num : false;
      const matchTexto = v.text.toLowerCase().includes(s);
      return matchNumero || matchTexto;
    });
  }, [q, versiculos]);

  return (
    <div className={styles.container}>
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
        {versiculos.map((v) => (
          <button
            key={v.number}
            type="button"
            className={`${styles.verseBtn} ${
              ativo === v.number ? styles.activeBtn : ""
            }`}
            onClick={() => setAtivo(v.number)}
          >
            {v.number}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <p className={styles.empty}>Nenhum versículo encontrado.</p>
      ) : (
        <ol className={styles.verses}>
          {filtrados.map((v) => (
            <li
              key={v.number}
              id={`v-${v.number}`}
              className={`${styles.verseCard} ${
                ativo === v.number ? styles.active : ""
              }`}
              onClick={() => setAtivo(v.number)}
            >
              <span className={styles.verseNumber}>{v.number}</span>
              <span className={styles.verseText}>{v.text}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
