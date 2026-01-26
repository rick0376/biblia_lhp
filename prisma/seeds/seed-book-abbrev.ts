import { prisma } from "../lib/prisma";

const ABBREV: Record<string, string> = {
  Gênesis: "Gn",
  Êxodo: "Êx",
  Levítico: "Lv",
  Números: "Nm",
  Deuteronômio: "Dt",
  Josué: "Js",
  Juízes: "Jz",
  Rute: "Rt",
  "1 Samuel": "1Sm",
  "2 Samuel": "2Sm",
  "1 Reis": "1Rs",
  "2 Reis": "2Rs",
  "1 Crônicas": "1Cr",
  "2 Crônicas": "2Cr",
  Esdras: "Ed",
  Neemias: "Ne",
  Ester: "Et",
  Jó: "Jó",
  Salmos: "Sl",
  Provérbios: "Pv",
  Eclesiastes: "Ec",
  Cantares: "Ct",
  Isaías: "Is",
  Jeremias: "Jr",
  Lamentações: "Lm",
  Ezequiel: "Ez",
  Daniel: "Dn",
  Oseias: "Os",
  Joel: "Jl",
  Amós: "Am",
  Obadias: "Ob",
  Jonas: "Jn",
  Miqueias: "Mq",
  Naum: "Na",
  Habacuque: "Hc",
  Sofonias: "Sf",
  Ageu: "Ag",
  Zacarias: "Zc",
  Malaquias: "Ml",

  Mateus: "Mt",
  Marcos: "Mc",
  Lucas: "Lc",
  João: "Jo",
  Atos: "At",
  Romanos: "Rm",
  "1 Coríntios": "1Co",
  "2 Coríntios": "2Co",
  Gálatas: "Gl",
  Efésios: "Ef",
  Filipenses: "Fp",
  Colossenses: "Cl",
  "1 Tessalonicenses": "1Ts",
  "2 Tessalonicenses": "2Ts",
  "1 Timóteo": "1Tm",
  "2 Timóteo": "2Tm",
  Tito: "Tt",
  Filemom: "Fm",
  Hebreus: "Hb",
  Tiago: "Tg",
  "1 Pedro": "1Pe",
  "2 Pedro": "2Pe",
  "1 João": "1Jo",
  "2 João": "2Jo",
  "3 João": "3Jo",
  Judas: "Jd",
  Apocalipse: "Ap",
};

async function main() {
  const books = await prisma.book.findMany();

  for (const book of books) {
    const abbr = ABBREV[book.name];
    if (!abbr) {
      console.log(`⚠️ Sem abreviação para: ${book.name}`);
      continue;
    }

    const newName = `${abbr} - ${book.name}`;

    await prisma.book.update({
      where: { id: book.id },
      data: { name: newName },
    });

    console.log(`✅ ${book.name} → ${newName}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
