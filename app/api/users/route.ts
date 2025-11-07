import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, telefone, cpf, idade, endereco, role, clientIds } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Nome, email e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        telefone,
        cpf,
        idade,
        endereco,
        role,
      },
    });

    if (role === "CONSULTOR" && clientIds && clientIds.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: {
            in: clientIds,
          },
        },
        data: {
          consultorId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, telefone, cpf, idade, endereco, role, clientIds } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 }
      );
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        telefone,
        cpf,
        idade,
        endereco,
        role,
      },
    });

    if (role === "CONSULTOR" && clientIds) {
      await prisma.user.updateMany({
        where: {
          consultorId: user.id,
        },
        data: {
          consultorId: null,
        },
      });

      if (clientIds.length > 0) {
        await prisma.user.updateMany({
          where: {
            id: {
              in: clientIds,
            },
          },
          data: {
            consultorId: user.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao deletar usuário" },
      { status: 500 }
    );
  }
}
