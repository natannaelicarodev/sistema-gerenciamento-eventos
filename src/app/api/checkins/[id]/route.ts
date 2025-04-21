import { NextRequest, NextResponse } from 'next/server';
import checkinsService from '../../../server/services/checkinsService';

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

    const checkin = await checkinsService.findById(id);
    return NextResponse.json(checkin);
  } catch (error) {
    console.error(`Erro ao buscar checkin com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar checkin' },
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

    await checkinsService.delete(id);
    return NextResponse.json({ message: 'Checkin excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir checkin com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao excluir checkin' },
      { status: 500 }
    );
  }
}
