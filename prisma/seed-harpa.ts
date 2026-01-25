import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";

type HarpaJsonRoot = Record<string, unknown>;

type HarpaJsonHino = {
  hino: string; // "1 - Chuvas de Graça"
  coro?: string; // html com <br>
  verses: Record<string, string>; // {"1":"...", "2":"..."}
};

function normalizeHtml(text: string): string {
  return text
    .replaceAll("<br>", "\n")
    .replaceAll("<br/>", "\n")
    .replaceAll("<br />", "\n")
    .replaceAll("&nbsp;", " ")
    .trim();
}

function parseHinoTitle(hinoField: string): { number: number; title: string } {
  // aceita "1 - Título" / "1- Título" / "1 – Título"
  const m = hinoField.match(/^\s*(\d+)\s*[-–]\s*(.+?)\s*$/);
  if (!m) {
    // fallback: tenta pegar só o número no começo
    const n = Number(hinoField.trim().split(/\s+/)[0]);
    if (!Number.isFinite(n))
      throw new Error(`Formato inválido em "hino": ${hinoField}`);
    return {
      number: n,
      title:
        hinoField.replace(String(n), "").replace("-", "").trim() || `Hino ${n}`,
    };
  }
  return { number: Number(m[1]), title: m[2] };
}

function loadHarpa(): HarpaJsonHino[] {
  const filePath = path.join(process.cwd(), "data", "harpa", "harpa.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: unknown = JSON.parse(raw);

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error(
      "harpa.json precisa ser um objeto { '1': {...}, '2': {...} }",
    );
  }

  const root = data as HarpaJsonRoot;

  const items: HarpaJsonHino[] = [];

  for (const [key, value] of Object.entries(root)) {
    if (key === "-1") continue; // metadados
    if (typeof value !== "object" || value === null || Array.isArray(value))
      continue;

    const obj = value as Record<string, unknown>;

    if (typeof obj.hino !== "string") continue;
    if (
      typeof obj.verses !== "object" ||
      obj.verses === null ||
      Array.isArray(obj.verses)
    )
      continue;

    items.push({
      hino: obj.hino,
      coro: typeof obj.coro === "string" ? obj.coro : undefined,
      verses: obj.verses as Record<string, string>,
    });
  }

  // ordena por número extraído do campo "hino"
  items.sort(
    (a, b) => parseHinoTitle(a.hino).number - parseHinoTitle(b.hino).number,
  );

  return items;
}

async function main() {
  console.log("🎵 Iniciando seed da Harpa (formato objeto)");

  const hinos = loadHarpa();
  console.log(`📦 Total de itens lidos: ${hinos.length}`);

  for (const h of hinos) {
    const { number, title } = parseHinoTitle(h.hino);

    const hymn = await prisma.hymn.upsert({
      where: { number },
      update: { title },
      create: { number, title },
    });

    // limpa versos antigos pra não duplicar
    await prisma.hymnVerse.deleteMany({
      where: { hymnId: hymn.id },
    });

    const versesToInsert: { hymnId: number; number: number; text: string }[] =
      [];

    // coro vira verso 0 (pra aparecer separado, se você quiser)
    if (h.coro) {
      versesToInsert.push({
        hymnId: hymn.id,
        number: 0,
        text: normalizeHtml(h.coro),
      });
    }

    // versos 1..N
    const entries = Object.entries(h.verses)
      .map(([k, v]) => ({ n: Number(k), text: String(v) }))
      .filter((x) => Number.isFinite(x.n))
      .sort((a, b) => a.n - b.n);

    for (const v of entries) {
      versesToInsert.push({
        hymnId: hymn.id,
        number: v.n,
        text: normalizeHtml(v.text),
      });
    }

    if (versesToInsert.length) {
      await prisma.hymnVerse.createMany({
        data: versesToInsert,
      });
    }

    console.log(
      `✅ Hino ${number} - ${title} (${versesToInsert.length} partes)`,
    );
  }

  console.log("🎉 Harpa importada completa!");
}

main()
  .catch((e) => {
    console.error("💥 Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
