'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Participante {
  evento: any;
  id: number;
  nome: string;
  email: string;
  telefone: string;
  evento_id: number;
  checkins?: any[];
}

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventoId, setEventoId] = useState<string>('');
  const [eventos, setEventos] = useState<any[]>([]);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 4;

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('/api/eventos');
        if (!response.ok) {
          throw new Error('Falha ao carregar eventos');
        }
        const data = await response.json();
        setEventos(data);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const fetchParticipantes = async () => {
      setLoading(true);
      try {
        const url = eventoId 
          ? `/api/participantes?eventoId=${eventoId}` 
          : '/api/participantes';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Falha ao carregar participantes');
        }
        const data = await response.json();
        setParticipantes(data);
        // Resetar para a primeira página quando mudar o filtro
        setCurrentPage(1);
      } catch (err) {
        setError('Erro ao carregar participantes. Tente novamente mais tarde.');
        console.error('Erro ao buscar participantes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantes();
  }, [eventoId]);

  const handleEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventoId(e.target.value);
  };

  const getStatusBadge = (participante: Participante) => {
    if (!participante.checkins || participante.checkins.length === 0) {
      return <span className="badge badge-warning">Pendente</span>;
    }
    
    const ultimoCheckin = participante.checkins[0];
    if (ultimoCheckin.status === 'presente') {
      return <span className="badge badge-success">Presente</span>;
    } else if (ultimoCheckin.status === 'saiu') {
      return <span className="badge badge-info">Saiu</span>;
    } else {
      return <span className="badge badge-warning">Pendente</span>;
    }
  };

  // Lógica de paginação
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentParticipantes = participantes.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.max(1, Math.ceil(participantes.length / cardsPerPage));

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Gerar array de números de página para exibição
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Número máximo de botões numéricos a exibir
    
    if (totalPages <= maxPageButtons) {
      // Se o total de páginas for menor que o máximo, mostrar todos
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Caso contrário, mostrar um subconjunto com a página atual no centro
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  const getEventoNome = (participante: any) => {
    // Se o participante já tem o objeto evento completo
    if (participante.evento?.nome) {
      return participante.evento.nome;
    }
    
    // Se estamos filtrando por um evento específico
    if (eventoId && participante.evento_id.toString() === eventoId) {
      // Encontre o evento selecionado na lista de eventos
      const eventoSelecionado = eventos.find(e => e.id.toString() === eventoId);
      return eventoSelecionado ? eventoSelecionado.nome : `ID: ${participante.evento_id}`;
    }
    
    // Caso contrário, tente encontrar o evento na lista de todos os eventos
    const eventoEncontrado = eventos.find(e => e.id === participante.evento_id);
    return eventoEncontrado ? eventoEncontrado.nome : `ID: ${participante.evento_id}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com gradiente inspirado na logo */}
      <header className="navbar bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-lg">
        <Link href="/" className="text-white hover:text-gray-200">
          ← Voltar
        </Link>
        <h1 className="navbar-title text-white font-bold">Participantes</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </header>

      {/* Main Content */}
      <main className="flex-grow container-mobile py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Lista de Participantes</h2>
        </div>

        <div className="card mb-6">
          <div className="card-body">
            <label htmlFor="evento" className="label">Filtrar por Evento</label>
            <select 
              id="evento" 
              className="input mb-2 text-gray-800" 
              value={eventoId} 
              onChange={handleEventoChange}
              style={{ color: '#1f2937' }}
            >
              <option value="" className="text-gray-800">Todos os eventos</option>
              {eventos.map(evento => (
                <option key={evento.id} value={evento.id} className="text-gray-800">
                  {evento.nome}
                </option>
              ))}
            </select>
            <style jsx>{`
              select option {
                color: #1f2937;
                background-color: white;
              }
            `}</style>
          </div>
        </div>

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
        ) : participantes.length === 0 ? (
          <div className="card bg-gray-50 border border-gray-200 mb-4">
            <div className="card-body text-center py-8">
              <p className="text-gray-600 mb-4">Nenhum participante encontrado.</p>
              <Link href="/participantes/novo" className="btn bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white">
                Adicionar Participante
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentParticipantes.map((participante) => (
                console.log(participante),
                <div key={participante.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{participante.nome}</h3>
                    <div className="grid grid-cols-1 gap-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <span className="mr-1">📧</span> {participante.email}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">📱</span> {participante.telefone}
                      </div>
                      <div className="flex items-center">
                      <span className="mr-1">🏷️</span> Evento: {getEventoNome(participante)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      {getStatusBadge(participante)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Controles de Paginação */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center justify-center w-full">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-l-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    aria-label="Página anterior"
                  >
                    ←
                  </button>
                  
                  {/* Botões numéricos */}
                  <div className="flex">
                    {getPageNumbers().map(number => (
                      <button
                        key={number}
                        onClick={() => goToPage(number)}
                        className={`px-4 py-2 border-t border-b ${
                          currentPage === number 
                            ? 'bg-blue-600 text-white font-bold' 
                            : 'bg-white text-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    aria-label="Próxima página"
                  >
                    →
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Mostrando {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, participantes.length)} de {participantes.length} participantes
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link href="/" className="bottom-nav-item">
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">Início</span>
        </Link>
        <Link href="/eventos" className="bottom-nav-item">
          <span className="bottom-nav-icon">📅</span>
          <span className="bottom-nav-label">Eventos</span>
        </Link>
        <Link href="/participantes" className="bottom-nav-item active">
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
