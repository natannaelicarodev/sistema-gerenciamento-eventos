import { NextRequest, NextResponse } from 'next/server';
import participantesService from '../../../server/services/participantesService';

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

    const participante = await participantesService.findById(id);
    return NextResponse.json(participante);
  } catch (error) {
    console.error(`Erro ao buscar participante com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar participante' },
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
    const participante = await participantesService.update(id, data);
    return NextResponse.json(participante);
  } catch (error) {
    console.error(`Erro ao atualizar participante com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao atualizar participante' },
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

    await participantesService.delete(id);
    return NextResponse.json({ message: 'Participante excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir participante com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao excluir participante' },
      { status: 500 }
    );
  }
}
