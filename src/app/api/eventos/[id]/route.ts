import { NextRequest, NextResponse } from 'next/server';
import eventosService from '../../../server/services/eventosService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const evento = await eventosService.findById(id);
    return NextResponse.json(evento);
  } catch (error) {
    console.error(`Erro ao buscar evento com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar evento' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const evento = await eventosService.update(id, data);
    return NextResponse.json(evento);
  } catch (error) {
    console.error(`Erro ao atualizar evento com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao atualizar evento' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    await eventosService.delete(id);
    return NextResponse.json({ message: 'Evento excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir evento com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao excluir evento' },
      { status: 500 }
    );
  }
}
