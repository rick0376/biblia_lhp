//app/api/favoritos/hinos/route.ts

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

    const body = (await req.json()) as { hymnId?: number };
    const hymnId = Number(body.hymnId);

    if (!Number.isFinite(hymnId) || hymnId <= 0) {
      return NextResponse.json({ error: "hymnId inválido" }, { status: 400 });
    }

    const existing = await prisma.favoriteHymn.findUnique({
      where: {
        visitorId_hymnId: {
          visitorId,
          hymnId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.favoriteHymn.delete({
        where: {
          visitorId_hymnId: {
            visitorId,
            hymnId,
          },
        },
      });

      return NextResponse.json({ isFavorite: false });
    }

    await prisma.favoriteHymn.create({
      data: {
        visitorId,
        hymnId,
      },
    });

    return NextResponse.json({ isFavorite: true });
  } catch (error) {
    console.error("Erro favorito hino:", error);

    return NextResponse.json(
      { error: "Erro ao alternar favorito do hino" },
      { status: 500 },
    );
  }
}
