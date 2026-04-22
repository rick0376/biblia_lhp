//app/api/marcacoes/versiculos/route.ts

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type MarkColor = "YELLOW" | "BLUE" | "GREEN";

function isValidColor(value: unknown): value is MarkColor {
  return value === "YELLOW" || value === "BLUE" || value === "GREEN";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      verseId?: number;
      color?: MarkColor;
    };

    const verseId = Number(body.verseId);
    const color = body.color;

    if (!Number.isFinite(verseId) || verseId <= 0) {
      return NextResponse.json({ error: "verseId inválido" }, { status: 400 });
    }

    if (!isValidColor(color)) {
      return NextResponse.json({ error: "color inválida" }, { status: 400 });
    }

    const existing = await prisma.verseMark.findUnique({
      where: { verseId },
      select: { id: true, color: true },
    });

    if (existing && existing.color === color) {
      await prisma.verseMark.delete({
        where: { verseId },
      });

      return NextResponse.json({ markColor: null });
    }

    const mark = await prisma.verseMark.upsert({
      where: { verseId },
      update: { color },
      create: { verseId, color },
      select: { color: true },
    });

    return NextResponse.json({ markColor: mark.color });
  } catch (error) {
    console.error("Erro real da marcação:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao alternar marcação do versículo",
      },
      { status: 500 },
    );
  }
}
