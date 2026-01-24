// lib/biblia-api.ts

export type Versiculo = { number: number; text: string };

type ApiBooksItem = {
  name: string;
  abbrev?: { pt?: string; en?: string };
};

type ApiVersesResponse = {
  verses?: { number: number; text: string }[];
};

const BASE_URL = "https://www.abibliadigital.com.br/api";

function authHeaders(): Record<string, string> {
  const token = process.env.BIBLIA_API_TOKEN;
  if (!token) throw new Error("BIBLIA_API_TOKEN não definido no .env");
  return { Authorization: `Bearer ${token}` };
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const cacheAbbrev = new Map<string, string>(); // chave (name normalizado) -> abbrev.pt

async function getAbbrevPTByName(nomeLivro: string): Promise<string | null> {
  const key = normalize(nomeLivro);
  if (cacheAbbrev.has(key)) return cacheAbbrev.get(key)!;

  const res = await fetch(`${BASE_URL}/books`, {
    headers: authHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Erro HTTP ${res.status} ao buscar lista de livros`);
    return null;
  }

  const data = (await res.json()) as ApiBooksItem[];

  const found = data.find((b) => normalize(b.name) === key);
  const ab = found?.abbrev?.pt;

  if (!ab) {
    console.error(`Livro "${nomeLivro}" não encontrado na lista da API`);
    return null;
  }

  cacheAbbrev.set(key, ab);
  return ab;
}

export async function buscarVersiculos(
  nomeLivro: string,
  capitulo: number,
): Promise<Versiculo[] | null> {
  const abbrevPt = await getAbbrevPTByName(nomeLivro);

  if (!abbrevPt) return null;

  const url = `${BASE_URL}/verses/acf/${encodeURIComponent(abbrevPt)}/${capitulo}`;

  try {
    const res = await fetch(url, {
      headers: authHeaders(),
      cache: "no-store",
    });

    if (res.status === 404) return []; // capítulo não existe

    if (!res.ok) {
      console.error(
        `Erro HTTP ${res.status} ao buscar ${nomeLivro} cap ${capitulo}`,
      );
      return null;
    }

    const data = (await res.json()) as ApiVersesResponse;
    const verses = data.verses ?? [];

    return verses.map((v) => ({ number: v.number, text: v.text }));
  } catch (e) {
    console.error(`Erro ao buscar ${nomeLivro} cap ${capitulo}:`, e);
    return null;
  }
}
