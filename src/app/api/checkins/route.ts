import { NextRequest, NextResponse } from 'next/server';
import checkinsService from '../../server/services/checkinsService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventoId = searchParams.get('eventoId');
    const participanteId = searchParams.get('participanteId');
    
    if (eventoId) {
      const checkins = await checkinsService.findByEventoId(parseInt(eventoId));
      return NextResponse.json(checkins);
    }
    
    if (participanteId) {
      const checkins = await checkinsService.findByParticipanteId(parseInt(participanteId));
      return NextResponse.json(checkins);
    }
    
    const checkins = await checkinsService.findAll();
    return NextResponse.json(checkins);
  } catch (error) {
    console.error('Erro na rota de checkins:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar checkins' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { participanteId, eventoId, tipo } = data;
    
    if (!participanteId || !eventoId) {
      return NextResponse.json(
        { error: 'Participante ID e Evento ID são obrigatórios' },
        { status: 400 }
      );
    }
    
    if (tipo === 'checkout') {
      const checkin = await checkinsService.realizarCheckout(participanteId, eventoId);
      return NextResponse.json(checkin);
    } else {
      const checkin = await checkinsService.realizarCheckin(participanteId, eventoId);
      return NextResponse.json(checkin);
    }
  } catch (error) {
    console.error('Erro ao processar checkin/checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao processar checkin/checkout' },
      { status: 500 }
    );
  }
}
