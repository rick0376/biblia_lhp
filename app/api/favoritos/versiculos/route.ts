//app/api/favoritos/versiculos/route.ts

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getVisitorId } from "../../../../lib/visitor";

export async function POST(req: Request) {
  try {
    const visitorId = await getVisitorId();

    if (!visitorId) {
      return NextResponse.json(
        { error: "visitor_id não encontrado" },
        { status: 400 },
      );
    }

    const body = (await req.json()) as { verseId?: number };
    const verseId = Number(body.verseId);

    if (!Number.isFinite(verseId) || verseId <= 0) {
      return NextResponse.json({ error: "verseId inválido" }, { status: 400 });
    }

    const existing = await prisma.favoriteVerse.findUnique({
      where: {
        visitorId_verseId: {
          visitorId,
          verseId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.favoriteVerse.delete({
        where: {
          visitorId_verseId: {
            visitorId,
            verseId,
          },
        },
      });

      return NextResponse.json({ isFavorite: false });
    }

    await prisma.favoriteVerse.create({
      data: {
        visitorId,
        verseId,
      },
    });

    return NextResponse.json({ isFavorite: true });
  } catch (error) {
    console.error("Erro favorito versículo:", error);

    return NextResponse.json(
      { error: "Erro ao alternar favorito do versículo" },
      { status: 500 },
    );
  }
}
