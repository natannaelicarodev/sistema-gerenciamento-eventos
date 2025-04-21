import { NextRequest, NextResponse } from 'next/server';
import participantesService from '../../server/services/participantesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventoId = searchParams.get('eventoId');
    
    if (eventoId) {
      const participantes = await participantesService.findByEventoId(parseInt(eventoId));
      return NextResponse.json(participantes);
    }
    
    const participantes = await participantesService.findAll();
    return NextResponse.json(participantes);
  } catch (error) {
    console.error('Erro na rota de participantes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar participantes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const participante = await participantesService.create(data);
    return NextResponse.json(participante, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar participante:', error);
    return NextResponse.json(
      { error: 'Erro ao criar participante' },
      { status: 500 }
    );
  }
}
