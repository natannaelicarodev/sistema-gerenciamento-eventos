'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Evento {
  id: number;
  nome: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local: string;
  capacidade: number;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Erro ao carregar eventos. Tente novamente mais tarde.');
        console.error('Erro ao buscar eventos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="navbar bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-lg">
        <Link href="/" className="text-white hover:text-gray-200">
          ← Voltar
        </Link>
        <h1 className="navbar-title text-white font-bold">Eventos</h1>
        <div className="w-6"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container-mobile py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Lista de Eventos</h2>
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
        ) : eventos?.length === 0 ? (
          <div className="card bg-gray-50 border border-gray-200 mb-4">
            <div className="card-body text-center py-8">
              <p className="text-gray-600 mb-4">Nenhum evento encontrado.</p>
              <Link href="/eventos/novo" className="btn bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white">
                Criar Novo Evento
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {eventos?.map((evento) => (
              <Link href={`/eventos/${evento.id}`} key={evento.id}>
                <div className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{evento.nome}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
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
                    <div className="flex justify-end">
                      <span className="badge badge-primary">Ver detalhes</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

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
