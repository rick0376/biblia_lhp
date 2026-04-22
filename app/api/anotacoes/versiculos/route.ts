//app/api/anotacoes/versiculos/route.ts

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

    const body = (await req.json()) as {
      verseId?: number;
      content?: string;
    };

    const verseId = Number(body.verseId);
    const content = String(body.content ?? "").trim();

    if (!Number.isFinite(verseId) || verseId <= 0) {
      return NextResponse.json({ error: "verseId inválido" }, { status: 400 });
    }

    if (content.length === 0) {
      await prisma.verseNote.deleteMany({
        where: {
          visitorId,
          verseId,
        },
      });

      return NextResponse.json({ noteContent: null });
    }

    const note = await prisma.verseNote.upsert({
      where: {
        visitorId_verseId: {
          visitorId,
          verseId,
        },
      },
      update: { content },
      create: {
        visitorId,
        verseId,
        content,
      },
      select: { content: true },
    });

    return NextResponse.json({ noteContent: note.content });
  } catch (error) {
    console.error("Erro anotação versículo:", error);

    return NextResponse.json(
      { error: "Erro ao salvar anotação do versículo" },
      { status: 500 },
    );
  }
}
