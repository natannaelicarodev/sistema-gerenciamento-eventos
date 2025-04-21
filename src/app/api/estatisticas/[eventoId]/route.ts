import { NextRequest, NextResponse } from 'next/server';
import eventosService from '../../../server/services/eventosService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return console.log(params.id)
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const stats = await eventosService.getEventoStats(id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error(`Erro ao buscar estatísticas do evento com ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas do evento' },
      { status: 500 }
    );
  }
}
