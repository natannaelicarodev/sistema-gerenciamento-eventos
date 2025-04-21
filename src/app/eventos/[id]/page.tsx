'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EventoDetalhesProps {
  params: {
    id: string;
  };
}

interface Evento {
  id: number;
  nome: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local: string;
  capacidade: number;
  participantes: any[];
  checkins: any[];
}

interface EventoStats {
  nome: string;
  data: string;
  local: string;
  capacidade: number;
  totalParticipantes: number;
  totalCheckins: number;
  presentesAgora: number;
  sairam: number;
  vagasDisponiveis: number;
  taxaOcupacao: number;
  taxaPresenca: number;
}

export default function EventoDetalhes({ params }: EventoDetalhesProps) {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [stats, setStats] = useState<EventoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'detalhes' | 'participantes' | 'checkins'>('detalhes');

  // Paginação para participantes
  const [currentPageParticipantes, setCurrentPageParticipantes] = useState(1);
  const cardsPerPage = 4;

  useEffect(() => {
    const fetchEvento = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/eventos/${params.id}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar evento');
        }
        const data = await response.json();
        setEvento(data);

        return console.log(params.id)
        // Buscar estatísticas
        // const statsResponse = await fetch(`/api/estatisticas/${params.id}`);
        // if (!statsResponse.ok) {
        //   throw new Error('Falha ao carregar estatísticas');
        // }
        // const statsData = await statsResponse.json();
        // setStats(statsData);
      } catch (err) {
        setError('Erro ao carregar dados do evento. Tente novamente mais tarde.');
        console.error('Erro ao buscar evento:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [params.id]);

  // Função para formatar a data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (participante: any) => {
    const checkins = evento?.checkins.filter(c => c.participante_id === participante.id) || [];

    if (checkins.length === 0) {
      return <span className="badge badge-warning">Pendente</span>;
    }

    const ultimoCheckin = checkins[0];
    if (ultimoCheckin.status === 'presente') {
      return <span className="badge badge-success">Presente</span>;
    } else if (ultimoCheckin.status === 'saiu') {
      return <span className="badge badge-info">Saiu</span>;
    } else {
      return <span className="badge badge-warning">Pendente</span>;
    }
  };

  // Lógica de paginação para participantes
  const indexOfLastParticipante = currentPageParticipantes * cardsPerPage;
  const indexOfFirstParticipante = indexOfLastParticipante - cardsPerPage;
  const currentParticipantes = evento?.participantes.slice(indexOfFirstParticipante, indexOfLastParticipante) || [];
  const totalPagesParticipantes = evento?.participantes ? Math.max(1, Math.ceil(evento.participantes.length / cardsPerPage)) : 1;

  const goToPageParticipantes = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesParticipantes) {
      setCurrentPageParticipantes(pageNumber);
    }
  };

  const nextPageParticipantes = () => {
    if (currentPageParticipantes < totalPagesParticipantes) {
      setCurrentPageParticipantes(currentPageParticipantes + 1);
    }
  };

  const prevPageParticipantes = () => {
    if (currentPageParticipantes > 1) {
      setCurrentPageParticipantes(currentPageParticipantes - 1);
    }
  };

  // Gerar array de números de página para exibição
  const getPageNumbersParticipantes = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Número máximo de botões numéricos a exibir

    if (totalPagesParticipantes <= maxPageButtons) {
      // Se o total de páginas for menor que o máximo, mostrar todos
      for (let i = 1; i <= totalPagesParticipantes; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Caso contrário, mostrar um subconjunto com a página atual no centro
      let startPage = Math.max(1, currentPageParticipantes - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;

      if (endPage > totalPagesParticipantes) {
        endPage = totalPagesParticipantes;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com gradiente inspirado na logo */}
      <header className="navbar bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-lg">
        <Link href="/eventos" className="text-white hover:text-gray-200">
          ← Voltar
        </Link>
        <h1 className="navbar-title text-white font-bold">Detalhes do Evento</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </header>

      {/* Main Content */}
      <main className="flex-grow container-mobile py-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="card bg-red-50 border border-red-200 mb-4">
            <div className="card-body text-red-700">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline text-red-600 border-red-300 mt-2"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : evento ? (
          <>
            <div className="card mb-6">
              <div className="card-body">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{evento.nome}</h2>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="mr-1">📅</span> {formatarData(evento.data)}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">⏰</span> {evento.hora_inicio} - {evento.hora_fim}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📍</span> {evento.local}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">👥</span> {evento.capacidade} pessoas
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-2 font-medium text-center ${activeTab === 'participantes' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('participantes')}
              >
                Participantes
              </button>
              <button
                className={`flex-1 py-2 font-medium text-center ${activeTab === 'checkins' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('checkins')}
              >
                Check-ins
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'detalhes' && stats && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="card bg-blue-50 border border-blue-100">
                    <div className="card-body text-center">
                      <p className="text-sm text-blue-700">Participantes</p>
                      <h3 className="text-2xl font-bold text-blue-800">{stats.totalParticipantes}</h3>
                      <p className="text-xs text-blue-600">de {stats.capacidade}</p>
                    </div>
                  </div>
                  <div className="card bg-green-50 border border-green-100">
                    <div className="card-body text-center">
                      <p className="text-sm text-green-700">Presentes Agora</p>
                      <h3 className="text-2xl font-bold text-green-800">{stats.presentesAgora}</h3>
                      <p className="text-xs text-green-600">{stats.totalParticipantes > 0 ? Math.round((stats.presentesAgora / stats.totalParticipantes) * 100) : 0}% dos participantes</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="card bg-purple-50 border border-purple-100">
                    <div className="card-body text-center">
                      <p className="text-sm text-purple-700">Total Check-ins</p>
                      <h3 className="text-2xl font-bold text-purple-800">{stats.totalCheckins}</h3>
                      <p className="text-xs text-purple-600">{stats.taxaPresenca}% de presença</p>
                    </div>
                  </div>
                  <div className="card bg-yellow-50 border border-yellow-100">
                    <div className="card-body text-center">
                      <p className="text-sm text-yellow-700">Saíram</p>
                      <h3 className="text-2xl font-bold text-yellow-800">{stats.sairam}</h3>
                      <p className="text-xs text-yellow-600">{stats.totalCheckins > 0 ? Math.round((stats.sairam / stats.totalCheckins) * 100) : 0}% dos check-ins</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Ocupação</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${stats.taxaOcupacao}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{stats.taxaOcupacao}% ocupado</span>
                      <span>{stats.vagasDisponiveis} vagas disponíveis</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'participantes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Participantes ({evento.participantes.length})</h3>
                </div>

                {evento.participantes.length === 0 ? (
                  <div className="card bg-gray-50 border border-gray-200">
                    <div className="card-body text-center py-6">
                      <p className="text-gray-600 mb-4">Nenhum participante registrado.</p>
                      <Link href={`/participantes/novo?eventoId=${evento.id}`} className="btn btn-primary">
                        Adicionar Participante
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {currentParticipantes.map((participante) => (
                        <div className="card hover:shadow-lg transition-shadow duration-300">
                          <div className="card-body">
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-semibold text-gray-800">{participante.nome}</h4>
                              {getStatusBadge(participante)}
                            </div>
                            <div className="grid grid-cols-1 gap-1 text-sm text-gray-600 mt-2">
                              <div className="flex items-center">
                                <span className="mr-1">📧</span> {participante.email}
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">📱</span> {participante.telefone}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Controles de Paginação para Participantes */}
                    <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center justify-center w-full">
                          <button
                            onClick={prevPageParticipantes}
                            disabled={currentPageParticipantes === 1}
                            className="px-4 py-2 bg-blue-500 text-white rounded-l-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                            aria-label="Página anterior"
                          >
                            ←
                          </button>

                          {/* Botões numéricos */}
                          <div className="flex">
                            {getPageNumbersParticipantes().map(number => (
                              <button
                                key={number}
                                onClick={() => goToPageParticipantes(number)}
                                className={`px-4 py-2 border-t border-b ${currentPageParticipantes === number
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'bg-white text-blue-500 hover:bg-blue-50'
                                  }`}
                              >
                                {number}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={nextPageParticipantes}
                            disabled={currentPageParticipantes === totalPagesParticipantes}
                            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                            aria-label="Próxima página"
                          >
                            →
                          </button>
                        </div>

                        <div className="text-sm text-gray-600">
                          Mostrando {indexOfFirstParticipante + 1}-{Math.min(indexOfLastParticipante, evento.participantes.length)} de {evento.participantes.length} participantes
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'checkins' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Check-ins ({evento.checkins.length})</h3>
                  <Link href={`/checkins/novo?eventoId=${evento.id}`} className="btn btn-primary btn-sm">
                    + Novo Check-in
                  </Link>
                </div>

                {evento.checkins.length === 0 ? (
                  <div className="card bg-gray-50 border border-gray-200">
                    <div className="card-body text-center py-6">
                      <p className="text-gray-600 mb-4">Nenhum check-in registrado.</p>
                      <Link href={`/checkins/novo?eventoId=${evento.id}`} className="btn btn-primary">
                        Registrar Check-in
                      </Link>
                    </div>
                  </div>
                ) : (
                  evento.checkins.map((checkin) => {
                    const participante = evento.participantes.find(p => p.id === checkin.participante_id);
                    return (
                      <div className="card" key={checkin.id}>
                        <div className="card-body">
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {participante ? participante.nome : `Participante #${checkin.participante_id}`}
                            </h4>
                            {checkin.status === 'presente' ? (
                              <span className="badge badge-success">Presente</span>
                            ) : checkin.status === 'saiu' ? (
                              <span className="badge badge-info">Saiu</span>
                            ) : (
                              <span className="badge badge-warning">Pendente</span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-1 text-sm text-gray-600 mt-2">
                            <div className="flex items-center">
                              <span className="mr-1">⏰</span> Entrada: {new Date(checkin.hora_entrada).toLocaleString('pt-BR')}
                            </div>
                            {checkin.hora_saida && (
                              <div className="flex items-center">
                                <span className="mr-1">🚪</span> Saída: {new Date(checkin.hora_saida).toLocaleString('pt-BR')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        ) : (
          <div className="card bg-gray-50 border border-gray-200 mb-4">
            <div className="card-body text-center py-8">
              <p className="text-gray-600 mb-4">Evento não encontrado.</p>
              <Link href="/eventos" className="btn btn-primary">
                Voltar para Eventos
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link href="/" className="bottom-nav-item">
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">Início</span>
        </Link>
        <Link href="/eventos" className="bottom-nav-item active">
          <span className="bottom-nav-icon">📅</span>
          <span className="bottom-nav-label">Eventos</span>
        </Link>
        <Link href="/participantes" className="bottom-nav-item">
          <span className="bottom-nav-icon">👥</span>
          <span className="bottom-nav-label">Participantes</span>
        </Link>
        <Link href="/checkins" className="bottom-nav-item">
          <span className="bottom-nav-icon">✓</span>
          <span className="bottom-nav-label">Check-ins</span>
        </Link>
      </nav>
    </div>
  );
}
