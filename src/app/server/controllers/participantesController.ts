import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ParticipanteData {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  evento_id: number;
}

export class ParticipantesController {
  async findAll() {
    try {
      return await prisma.participante.findMany({
        include: {
          evento: true,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
      throw new Error('Não foi possível buscar os participantes');
    }
  }

  async findByEventoId(eventoId: number) {
    try {
      return await prisma.participante.findMany({
        where: {
          evento_id: eventoId,
        },
        include: {
          checkins: true,
        },
      });
    } catch (error) {
      console.error(`Erro ao buscar participantes do evento ${eventoId}:`, error);
      throw new Error('Não foi possível buscar os participantes do evento');
    }
  }

  async findById(id: number) {
    try {
      const participante = await prisma.participante.findUnique({
        where: { id },
        include: {
          evento: true,
          checkins: true,
        },
      });

      if (!participante) {
        throw new Error('Participante não encontrado');
      }

      return participante;
    } catch (error) {
      console.error(`Erro ao buscar participante com ID ${id}:`, error);
      throw new Error('Não foi possível buscar o participante');
    }
  }

  async create(data: ParticipanteData) {
    try {
      const evento = await prisma.evento.findUnique({
        where: { id: data.evento_id },
      });

      if (!evento) {
        throw new Error('Evento não encontrado');
      }

      const participantesCount = await prisma.participante.count({
        where: { evento_id: data.evento_id },
      });

      if (participantesCount >= evento.capacidade) {
        throw new Error('Evento sem vagas disponíveis');
      }

      return await prisma.participante.create({
        data,
      });
    } catch (error) {
      console.error('Erro ao criar participante:', error);
      throw new Error('Não foi possível criar o participante');
    }
  }

  async update(id: number, data: ParticipanteData) {
    try {
      return await prisma.participante.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`Erro ao atualizar participante com ID ${id}:`, error);
      throw new Error('Não foi possível atualizar o participante');
    }
  }

  async delete(id: number) {
    try {
      return await prisma.participante.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Erro ao excluir participante com ID ${id}:`, error);
      throw new Error('Não foi possível excluir o participante');
    }
  }
}

export default new ParticipantesController();
