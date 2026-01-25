"use client";

type Verse = {
  id: number;
  type: "VERSE" | "CHORUS";
  number: number;
  text: string;
};

export default function HinoClient({
  verses,
  styles,
}: {
  verses: Verse[];
  styles: Record<string, string>;
}) {
  return (
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
  );
}
