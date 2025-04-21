import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface EventoData {
  id?: number;
  nome: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local: string;
  capacidade: number;
}

export class EventosController {
  async findAll() {
    try {
      return await prisma.evento.findMany({
        orderBy: {
          data: 'asc',
        },
      });
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw new Error('Não foi possível buscar os eventos');
    }
  }

  async findById(id: number) {
    try {
      const evento = await prisma.evento.findUnique({
        where: { id },
        include: {
          participantes: true,
          checkins: true,
        },
      });

      if (!evento) {
        throw new Error('Evento não encontrado');
      }

      return evento;
    } catch (error) {
      console.error(`Erro ao buscar evento com ID ${id}:`, error);
      throw new Error('Não foi possível buscar o evento');
    }
  }

  async create(data: EventoData) {
    try {
      return await prisma.evento.create({
        data,
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw new Error('Não foi possível criar o evento');
    }
  }

  async update(id: number, data: EventoData) {
    try {
      return await prisma.evento.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`Erro ao atualizar evento com ID ${id}:`, error);
      throw new Error('Não foi possível atualizar o evento');
    }
  }

  async delete(id: number) {
    try {
      return await prisma.evento.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Erro ao excluir evento com ID ${id}:`, error);
      throw new Error('Não foi possível excluir o evento');
    }
  }

  async getEventoStats(id: number) {
    try {
      const evento = await prisma.evento.findUnique({
        where: { id },
        include: {
          participantes: true,
          checkins: true,
        },
      });

      if (!evento) {
        throw new Error('Evento não encontrado');
      }

      const totalParticipantes = evento.participantes.length;
      const totalCheckins = evento.checkins.filter(c => c.status === 'presente' || c.status === 'saiu').length;
      const presentesAgora = evento.checkins.filter(c => c.status === 'presente').length;
      const sairam = evento.checkins.filter(c => c.status === 'saiu').length;
      const vagasDisponiveis = evento.capacidade - totalParticipantes;

      return {
        nome: evento.nome,
        data: evento.data,
        local: evento.local,
        capacidade: evento.capacidade,
        totalParticipantes,
        totalCheckins,
        presentesAgora,
        sairam,
        vagasDisponiveis,
        taxaOcupacao: Math.round((totalParticipantes / evento.capacidade) * 100),
        taxaPresenca: totalParticipantes > 0 ? Math.round((totalCheckins / totalParticipantes) * 100) : 0,
      };
    } catch (error) {
      console.error(`Erro ao buscar estatísticas do evento com ID ${id}:`, error);
      throw new Error('Não foi possível buscar as estatísticas do evento');
    }
  }
}

export default new EventosController();
