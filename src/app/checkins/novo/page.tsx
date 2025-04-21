'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NovoCheckinProps {
  params: {};
}

export default function NovoCheckin({ params }: NovoCheckinProps) {
  const router = useRouter();
  const [eventos, setEventos] = useState<any[]>([]);
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<string>('');
  const [participanteSelecionado, setParticipanteSelecionado] = useState<string>('');
  const [loading, setLoading] = useState(false);
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
        console.error('Erro ao buscar eventos:', err);
        setError('Erro ao carregar eventos. Tente novamente mais tarde.');
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const fetchParticipantes = async () => {
      if (!eventoSelecionado) {
        setParticipantes([]);
        return;
      }

      try {
        const response = await fetch(`/api/participantes?eventoId=${eventoSelecionado}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar participantes');
        }
        const data = await response.json();
        setParticipantes(data);
      } catch (err) {
        console.error('Erro ao buscar participantes:', err);
        setError('Erro ao carregar participantes. Tente novamente mais tarde.');
      }
    };

    fetchParticipantes();
  }, [eventoSelecionado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventoSelecionado || !participanteSelecionado) {
      setError('Por favor, selecione um evento e um participante.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventoId: parseInt(eventoSelecionado),
          participanteId: parseInt(participanteSelecionado),
          tipo: 'checkin'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao registrar check-in');
      }

      // Redirecionar para a página de check-ins após o sucesso
      router.push('/checkins');
    } catch (err: any) {
      console.error('Erro ao registrar check-in:', err);
      setError(err.message || 'Erro ao registrar check-in. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="navbar">
        <Link href="/checkins" className="text-gray-600">
          ← Voltar
        </Link>
        <h1 className="navbar-title">Novo Check-in</h1>
        <div className="w-6"></div> {/* Espaçador para centralizar o título */}
      </header>

      {/* Main Content */}
      <main className="flex-grow container-mobile py-6">
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Check-in</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="evento" className="label">Evento</label>
                <select 
                  id="evento" 
                  className="input text-gray-800" 
                  value={eventoSelecionado}
                  onChange={(e) => setEventoSelecionado(e.target.value)}
                  required
                  style={{ color: '#1f2937' }}
                >
                  <option value="" className="text-gray-800">Selecione um evento</option>
                  {eventos.map(evento => (
                    <option key={evento.id} value={evento.id} className="text-gray-800">
                      {evento.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="participante" className="label">Participante</label>
                <select 
                  id="participante" 
                  className="input text-gray-800" 
                  value={participanteSelecionado}
                  onChange={(e) => setParticipanteSelecionado(e.target.value)}
                  required
                  disabled={!eventoSelecionado || participantes.length === 0}
                  style={{ color: '#1f2937' }}
                >
                  <option value="" className="text-gray-800">
                    {!eventoSelecionado 
                      ? 'Selecione um evento primeiro' 
                      : participantes.length === 0 
                        ? 'Nenhum participante disponível' 
                        : 'Selecione um participante'}
                  </option>
                  {participantes.map(participante => (
                    <option key={participante.id} value={participante.id} className="text-gray-800">
                      {participante.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-full"
                  disabled={loading || !eventoSelecionado || !participanteSelecionado}
                >
                  {loading ? 'Registrando...' : 'Registrar Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Estilo global para garantir que as opções dos seletores sejam visíveis */}
      <style jsx global>{`
        select option {
          color: #1f2937 !important;
          background-color: white !important;
        }
        
        select {
          color: #1f2937 !important;
        }
        
        select:disabled {
          color: #9ca3af !important;
          background-color: #f3f4f6 !important;
        }
      `}</style>

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
        <Link href="/participantes" className="bottom-nav-item">
          <span className="bottom-nav-icon">👥</span>
          <span className="bottom-nav-label">Participantes</span>
        </Link>
        <Link href="/checkins" className="bottom-nav-item active">
          <span className="bottom-nav-icon">✓</span>
          <span className="bottom-nav-label">Check-ins</span>
        </Link>
      </nav>
    </div>
  );
}
