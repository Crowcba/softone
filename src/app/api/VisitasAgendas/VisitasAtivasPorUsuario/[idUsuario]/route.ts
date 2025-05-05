import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { idUsuario: string } }
) {
  try {
    const { idUsuario } = params;

    if (!idUsuario) {
      return NextResponse.json(
        { error: 'ID de usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar visitas ativas do usuário
    const visitasAtivas = await prisma.visita.findMany({
      where: {
        idPrescritor: parseInt(idUsuario),
        status: 'ATIVA', // ou outro status que indique que a visita está ativa
      },
      include: {
        prescritor: true,
        local: true,
      },
    });

    return NextResponse.json(visitasAtivas);
  } catch (error) {
    console.error('Erro ao buscar visitas ativas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar visitas ativas' },
      { status: 500 }
    );
  }
} 