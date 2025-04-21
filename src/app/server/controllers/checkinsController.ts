import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CheckinData {
  id?: number;
  participante_id: number;
  evento_id: number;
  hora_entrada?: Date;
  hora_saida?: Date | null;
  status: 'pendente' | 'presente' | 'saiu';
}

export class CheckinsController {
  async findAll() {
    try {
      return await prisma.checkin.findMany({
        include: {
          participante: true,
          evento: true,
        },
        orderBy: {
          hora_entrada: 'desc',
        },
      });
    } catch (error) {
      console.error('Erro ao buscar checkins:', error);
      throw new Error('Não foi possível buscar os checkins');
    }
  }

  async findByEventoId(eventoId: number) {
    try {
      return await prisma.checkin.findMany({
        where: {
          evento_id: eventoId,
        },
        include: {
          participante: true,
        },
        orderBy: {
          hora_entrada: 'desc',
        },
      });
    } catch (error) {
      console.error(`Erro ao buscar checkins do evento ${eventoId}:`, error);
      throw new Error('Não foi possível buscar os checkins do evento');
    }
  }

  async findByParticipanteId(participanteId: number) {
    try {
      return await prisma.checkin.findMany({
        where: {
          participante_id: participanteId,
        },
        include: {
          evento: true,
        },
        orderBy: {
          hora_entrada: 'desc',
        },
      });
    } catch (error) {
      console.error(`Erro ao buscar checkins do participante ${participanteId}:`, error);
      throw new Error('Não foi possível buscar os checkins do participante');
    }
  }

  async findById(id: number) {
    try {
      const checkin = await prisma.checkin.findUnique({
        where: { id },
        include: {
          participante: true,
          evento: true,
        },
      });

      if (!checkin) {
        throw new Error('Checkin não encontrado');
      }

      return checkin;
    } catch (error) {
      console.error(`Erro ao buscar checkin com ID ${id}:`, error);
      throw new Error('Não foi possível buscar o checkin');
    }
  }

  async realizarCheckin(participanteId: number, eventoId: number) {
    try {
      // Verificar se o participante existe e pertence ao evento
      const participante = await prisma.participante.findFirst({
        where: {
          id: participanteId,
          evento_id: eventoId,
        },
      });

      if (!participante) {
        throw new Error('Participante não encontrado ou não pertence a este evento');
      }

      // Verificar se já existe um checkin ativo
      const checkinExistente = await prisma.checkin.findFirst({
        where: {
          participante_id: participanteId,
          evento_id: eventoId,
          status: {
            in: ['pendente', 'presente'],
          },
        },
      });

      if (checkinExistente) {
        if (checkinExistente.status === 'presente') {
          throw new Error('Participante já realizou check-in neste evento');
        }
        
        // Atualizar checkin pendente
        return await prisma.checkin.update({
          where: { id: checkinExistente.id },
          data: {
            hora_entrada: new Date(),
            status: 'presente',
          },
          include: {
            participante: true,
            evento: true,
          },
        });
      }

      // Criar novo checkin
      return await prisma.checkin.create({
        data: {
          participante_id: participanteId,
          evento_id: eventoId,
          hora_entrada: new Date(),
          status: 'presente',
        },
        include: {
          participante: true,
          evento: true,
        },
      });
    } catch (error) {
      console.error(`Erro ao realizar checkin para participante ${participanteId} no evento ${eventoId}:`, error);
      throw new Error('Não foi possível realizar o check-in');
    }
  }

  async realizarCheckout(participanteId: number, eventoId: number) {
    try {
      // Buscar checkin ativo
      const checkinAtivo = await prisma.checkin.findFirst({
        where: {
          participante_id: participanteId,
          evento_id: eventoId,
          status: 'presente',
        },
      });

      if (!checkinAtivo) {
        throw new Error('Não há check-in ativo para este participante neste evento');
      }

      // Atualizar para checkout
      return await prisma.checkin.update({
        where: { id: checkinAtivo.id },
        data: {
          hora_saida: new Date(),
          status: 'saiu',
        },
        include: {
          participante: true,
          evento: true,
        },
      });
    } catch (error) {
      console.error(`Erro ao realizar checkout para participante ${participanteId} no evento ${eventoId}:`, error);
      throw new Error('Não foi possível realizar o check-out');
    }
  }

  async delete(id: number) {
    try {
      return await prisma.checkin.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Erro ao excluir checkin com ID ${id}:`, error);
      throw new Error('Não foi possível excluir o checkin');
    }
  }
}

export default new CheckinsController();
