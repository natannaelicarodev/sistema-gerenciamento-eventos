-- Tabela de Eventos
CREATE TABLE eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  local TEXT NOT NULL,
  capacidade INTEGER NOT NULL
);

-- Tabela de Participantes
CREATE TABLE participantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  evento_id INTEGER,
  FOREIGN KEY (evento_id) REFERENCES eventos(id)
);

-- Tabela de Check-ins
CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participante_id INTEGER,
  evento_id INTEGER,
  hora_entrada DATETIME,
  hora_saida DATETIME,
  status TEXT CHECK(status IN ('pendente', 'presente', 'saiu')),
  FOREIGN KEY (participante_id) REFERENCES participantes(id),
  FOREIGN KEY (evento_id) REFERENCES eventos(id)
);
