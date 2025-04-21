'use client'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="navbar bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 shadow-lg">
        <h1 className="navbar-title text-white font-bold">Sistema de Eventos</h1>
      </header>
      <main className="flex-grow container-mobile py-6">
        <div className="card mb-6">
          <div className="card-body text-center py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao Sistema de Gerenciamento de Eventos</h2>
            <p className="text-gray-600 mb-6">
              Gerencie check-ins e check-outs de participantes em eventos de forma simples e eficiente.
            </p>
            <Link href="/eventos" className="btn bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white btn-lg w-full mb-3">
              Ver Eventos
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="card bg-blue-50 border border-blue-100">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Gerenciamento de Eventos</h3>
              <p className="text-blue-700 mb-4">Crie e gerencie eventos com facilidade.</p>
              <Link href="/eventos" className="btn btn-outline text-blue-600 border-blue-300 w-full">
                Acessar
              </Link>
            </div>
          </div>

          <div className="card bg-green-50 border border-green-100">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Participantes</h3>
              <p className="text-green-700 mb-4">Gerencie os participantes dos seus eventos.</p>
              <Link href="/participantes" className="btn btn-outline text-green-600 border-green-300 w-full">
                Acessar
              </Link>
            </div>
          </div>

          <div className="card bg-purple-50 border border-purple-100">
            <div className="card-body">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Check-in / Check-out</h3>
              <p className="text-purple-700 mb-4">Registre entradas e saídas dos participantes.</p>
              <Link href="/checkins" className="btn btn-outline text-purple-600 border-purple-300 w-full">
                Acessar
              </Link>
            </div>
          </div>
        </div>
      </main>
      <nav className="bottom-nav">
        <Link href="/" className="bottom-nav-item active">
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
        <Link href="/checkins" className="bottom-nav-item">
          <span className="bottom-nav-icon">✓</span>
          <span className="bottom-nav-label">Check-ins</span>
        </Link>
      </nav>
    </div>
  );
}
