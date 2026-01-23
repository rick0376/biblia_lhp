// Mapeamento completo de todos os livros da Bíblia para códigos abreviados na API
const mapaLivros: Record<string, string> = {
  genesis: "gn",
  exodo: "ex",
  levitico: "lv",
  numeros: "nm",
  deuteronomio: "dt",
  josue: "js",
  juizes: "jz",
  rute: "rt",
  "1-samuel": "1sm",
  "2-samuel": "2sm",
  "1-reis": "1rs",
  "2-reis": "2rs",
  "1-cronicas": "1cr",
  "2-cronicas": "2cr",
  esdras: "esd",
  neemias: "ne",
  ester: "est",
  jo: "jo",
  salmos: "sl",
  proverbios: "pv",
  eclesiastes: "ec",
  canticos: "ct",
  isaias: "is",
  jeremias: "jr",
  lamentacoes: "lm",
  ezequiel: "ez",
  daniel: "dn",
  oseias: "os",
  joel: "jl",
  amos: "am",
  obadias: "ob",
  jonas: "jon",
  miqueias: "miq",
  naum: "na",
  habacuque: "hb",
  sofonias: "sf",
  ageu: "ag",
  zacarias: "zc",
  malaquias: "ml",

  mateus: "mt",
  marcos: "mc",
  lucas: "lc",
  joao: "jo",
  atos: "at",
  romanos: "rm",
  "1-corintios": "1co",
  "2-corintios": "2co",
  galatas: "gl",
  efezios: "ef",
  filipenses: "fp",
  colossenses: "cl",
  "1-tessalonicenses": "1ts",
  "2-tessalonicenses": "2ts",
  "1-timoteo": "1tm",
  "2-timoteo": "2tm",
  tito: "tt",
  filemom: "fl",
  hebreus: "hb",
  tiago: "tg",
  "1-pedro": "1pe",
  "2-pedro": "2pe",
  "1-joao": "1jo",
  "2-joao": "2jo",
  "3-joao": "3jo",
  judas: "jd",
  apocalipse: "ap",
};

// Função para buscar os versículos de um capítulo de um livro
export async function buscarVersiculos(slug: string, capitulo: number) {
  const livroApi = mapaLivros[slug.toLowerCase()];

  // Se o livro não for encontrado no mapa, retorna null
  if (!livroApi) return null;

  // Fazendo a requisição para a API da Bíblia Digital
  const res = await fetch(
    `https://www.abibliadigital.com.br/api/verses/acf/${livroApi}/${capitulo}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.BIBLIA_API_TOKEN}`,
      },
    },
  );

  // Se a resposta não for OK, retorna null
  if (!res.ok) return null;

  // Processa e retorna os versículos
  const data = await res.json();
  return data.verses as { number: number; text: string }[];
}

// Função para buscar o número de capítulos de um livro
export async function buscarNumeroCapitulos(slug: string) {
  const livroApi = mapaLivros[slug.toLowerCase()];

  if (!livroApi) return null;

  const res = await fetch(
    `https://www.abibliadigital.com.br/api/book/${livroApi}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.BIBLIA_API_TOKEN}`,
      },
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.total_chapters; // Retorna o número total de capítulos do livro
}
