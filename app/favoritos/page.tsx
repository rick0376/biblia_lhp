//app/favoritos/page.tsx

import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getVisitorId } from "../../lib/visitor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FavoritosPage() {
  const visitorId = await getVisitorId();

  if (!visitorId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "32px 20px",
          background: "var(--page-background)",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
              color: "var(--accent-text)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← Voltar
          </Link>
          <p>Nenhum identificador local encontrado.</p>
        </div>
      </main>
    );
  }

  const [versiculos, hinos] = await Promise.all([
    prisma.favoriteVerse.findMany({
      where: { visitorId },
      orderBy: { createdAt: "desc" },
      include: {
        verse: {
          include: {
            translation: true,
            chapter: {
              include: {
                book: true,
              },
            },
          },
        },
      },
    }),
    prisma.favoriteHymn.findMany({
      where: { visitorId },
      orderBy: { createdAt: "desc" },
      include: {
        hymn: true,
      },
    }),
  ]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        background: "var(--page-background)",
        color: "var(--text-primary)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            color: "var(--accent-text)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Voltar
        </Link>

        <h1
          style={{
            fontSize: 42,
            marginBottom: 8,
            background: "var(--accent-gradient)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Favoritos
        </h1>

        <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>
          Seus versículos e hinos salvos neste navegador.
        </p>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 28, marginBottom: 16 }}>
            Versículos favoritos ({versiculos.length})
          </h2>

          {versiculos.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhum versículo favorito ainda.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {versiculos.map((item) => {
                const verse = item.verse;
                const chapter = verse.chapter;
                const book = chapter.book;
                const version = verse.translation.code;

                return (
                  <Link
                    key={item.id}
                    href={`/livros/${book.slug}/${chapter.number}?v=${version}#v-${verse.number}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      border: "1px solid var(--surface-border)",
                      borderRadius: 18,
                      padding: 18,
                      background: "var(--surface-1)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        marginBottom: 10,
                        color: "var(--accent-text)",
                      }}
                    >
                      {book.name} {chapter.number}:{verse.number} •{" "}
                      {version.toUpperCase()}
                    </div>
                    <div style={{ lineHeight: 1.7 }}>{verse.text}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontSize: 28, marginBottom: 16 }}>
            Hinos favoritos ({hinos.length})
          </h2>

          {hinos.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              Nenhum hino favorito ainda.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {hinos.map((item) => (
                <Link
                  key={item.id}
                  href={`/harpa/${item.hymn.number}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid var(--surface-border)",
                    borderRadius: 18,
                    padding: 18,
                    background: "var(--surface-1)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      color: "var(--accent-text)",
                    }}
                  >
                    {item.hymn.number}. {item.hymn.title}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
