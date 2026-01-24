// lib/biblia-api.ts

export type Versiculo = {
  number: number;
  text: string;
};

type ApiVersesResponse = {
  verses?: { number: number; text: string }[];
};

const mapaLivros: Record<string, string> = {
  salmos: "sl",
  isaias: "is",
  jeremias: "jr",
};

const BASE_URL = "https://www.abibliadigital.com.br/api";

function authHeaders(): Record<string, string> {
  const token = process.env.BIBLIA_API_TOKEN;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function buscarVersiculos(
  slug: string,
  capitulo: number,
): Promise<Versiculo[] | null> {
  const livroApi = mapaLivros[slug.toLowerCase()];
  if (!livroApi) {
    console.error(`Livro ${slug} não encontrado no mapa.`);
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/verses/acf/${livroApi}/${capitulo}`, {
      headers: authHeaders(),
      cache: "no-store",
    });

    // 404 normalmente significa que o capítulo não existe
    if (res.status === 404) return [];

    if (!res.ok) {
      console.error(
        `Erro HTTP ${res.status} ao buscar ${slug} cap ${capitulo}`,
      );
      return null;
    }

    const data: ApiVersesResponse = await res.json();

    if (!data.verses || !Array.isArray(data.verses)) return [];

    return data.verses.map((v) => ({ number: v.number, text: v.text }));
  } catch (e) {
    console.error(`Erro ao buscar ${slug} cap ${capitulo}:`, e);
    return null;
  }
}
