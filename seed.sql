-- Inserindo eventos
INSERT INTO eventos (nome, data, hora_inicio, hora_fim, local, capacidade) VALUES
('Evento Exemplo', '2024-05-10', '09:00', '18:00', 'Sala de Demonstração', 10),
('Conferência de Tecnologia', '2024-05-15', '09:00', '18:00', 'Centro de Convenções', 100);

-- Inserindo participantes para o Evento Exemplo (com check-ins)
INSERT INTO participantes (nome, email, telefone, evento_id) VALUES
('João Silva', 'joao@email.com', '(11) 99999-1111', 1),
('Maria Santos', 'maria@email.com', '(11) 99999-2222', 1),
('Pedro Oliveira', 'pedro@email.com', '(11) 99999-3333', 1),
('Ana Costa', 'ana@email.com', '(11) 99999-4444', 1),
('Carlos Pereira', 'carlos@email.com', '(11) 99999-5555', 1);

-- Inserindo check-ins para o Evento Exemplo
INSERT INTO checkins (participante_id, evento_id, hora_entrada, status) VALUES
(1, 1, '2024-05-10 08:45:00', 'presente'),
(2, 1, '2024-05-10 09:10:00', 'presente'),
(3, 1, '2024-05-10 09:30:00', 'presente'),
(4, 1, '2024-05-10 10:00:00', 'presente'),
(5, 1, '2024-05-10 10:15:00', 'presente');

-- Adicionando algumas saídas no Evento Exemplo
UPDATE checkins SET hora_saida = '2024-05-10 12:00:00', status = 'saiu' WHERE participante_id = 1;
UPDATE checkins SET hora_saida = '2024-05-10 12:30:00', status = 'saiu' WHERE participante_id = 2;
