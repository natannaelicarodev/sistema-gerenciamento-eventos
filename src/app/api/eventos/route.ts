import { NextRequest, NextResponse } from 'next/server';
import eventosService from '../../server/services/eventosService';
import eventosController from '@/app/server/controllers/eventosController';

export async function GET(request: NextRequest) {
  try {
    const eventos = await eventosController.findAll();
    return NextResponse.json(eventos);
  } catch (error) {
    console.error('Erro na rota de eventos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar eventos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const evento = await eventosService.create(data);
    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
}
