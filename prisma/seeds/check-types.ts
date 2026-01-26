// prisma/check-types.ts
import { Prisma } from "@prisma/client";

type X = Prisma.HymnUpdateInput;
// se chorus existir, você consegue referenciar sem erro:
const ok: X = { chorus: "teste" };

console.log("OK");
