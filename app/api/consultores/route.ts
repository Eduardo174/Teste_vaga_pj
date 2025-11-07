import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const consultores = await prisma.user.findMany({
      where: {
        role: "CONSULTOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(consultores);
  } catch (error) {
    console.error("Erro ao buscar consultores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar consultores" },
      { status: 500 }
    );
  }
}
