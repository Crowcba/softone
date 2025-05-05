import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type VisitaWithRelations = Prisma.VisitaGetPayload<{
  include: {
    local: true;
    prescritor: true;
  }
}>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Data não fornecida' },
        { status: 400 }
      );
    }

    const visits = await prisma.visita.findMany({
      where: {
        data: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        }
      },
      include: {
        local: true,
        prescritor: true
      },
      orderBy: {
        horario: 'asc'
      }
    });

    const formattedVisits = visits.map((visit: VisitaWithRelations) => ({
      id: visit.id,
      title: visit.titulo,
      description: visit.descricao,
      date: visit.data,
      time: visit.horario,
      location: visit.local.localDeAtendimentoOrigemDestino,
      prescriber: visit.prescritor.nomeProfissional,
      status: visit.status
    }));

    return NextResponse.json({ success: true, data: formattedVisits });
  } catch (error) {
    console.error('Erro ao buscar visitas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar visitas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, date, time, locationId, prescriberId } = body;

    const visit = await prisma.visita.create({
      data: {
        titulo: title,
        descricao: description,
        data: new Date(date),
        horario: time,
        idLocal: locationId,
        idPrescritor: prescriberId,
        status: 'pending'
      },
      include: {
        local: true,
        prescritor: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: visit.id,
        title: visit.titulo,
        description: visit.descricao,
        date: visit.data,
        time: visit.horario,
        location: visit.local.localDeAtendimentoOrigemDestino,
        prescriber: visit.prescritor.nomeProfissional,
        status: visit.status
      }
    });
  } catch (error) {
    console.error('Erro ao criar visita:', error);
    return NextResponse.json(
      { error: 'Erro ao criar visita' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    const visit = await prisma.visita.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        local: true,
        prescritor: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: visit.id,
        title: visit.titulo,
        description: visit.descricao,
        date: visit.data,
        time: visit.horario,
        location: visit.local.localDeAtendimentoOrigemDestino,
        prescriber: visit.prescritor.nomeProfissional,
        status: visit.status
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar visita:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar visita' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    await prisma.visita.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar visita:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar visita' },
      { status: 500 }
    );
  }
} 