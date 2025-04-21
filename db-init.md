# Inicialização do Banco de Dados

Este arquivo contém instruções para inicializar o banco de dados SQLite com as tabelas e dados iniciais.

## Passos para inicialização

1. Criar o banco de dados e as tabelas:
```bash
sqlite3 banco.db < schema.sql
```

2. Inserir dados iniciais:
```bash
sqlite3 banco.db < seed.sql
```

## Estrutura do Banco de Dados

O banco de dados contém três tabelas principais:

- **eventos**: Armazena informações sobre os eventos
- **participantes**: Armazena informações sobre os participantes dos eventos
- **checkins**: Registra os check-ins e check-outs dos participantes nos eventos

## Dados Iniciais

Os dados iniciais incluem:

- 2 eventos de exemplo
- 5 participantes para o primeiro evento
- Check-ins para todos os participantes do primeiro evento
- Check-outs para 2 participantes do primeiro evento
