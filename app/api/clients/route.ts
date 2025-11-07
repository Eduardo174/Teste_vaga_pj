import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const consultorId = searchParams.get("consultorId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {
      role: "CLIENT",
    };

    if (consultorId && consultorId !== "") {
      where.consultorId = consultorId;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      where.createdAt = {
        gte: start,
        lte: end,
      };
    }

    const clients = await prisma.user.findMany({
      where,
      include: {
        consultor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const totalLast7Days = await prisma.user.count({
      where: {
        role: "CLIENT",
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const totalClients = await prisma.user.count({
      where: {
        role: "CLIENT",
      },
    });

    return NextResponse.json({
      clients,
      totalLast7Days,
      totalClients,
      total: clients.length,
    });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}
