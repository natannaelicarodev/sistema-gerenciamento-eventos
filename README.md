# Eventos App - Sistema de Gerenciamento de Eventos

Este é um sistema de gerenciamento de eventos com funcionalidades de check-in/check-out de participantes, desenvolvido com foco em dispositivos móveis.

## Tecnologias Utilizadas

- **Frontend e Backend**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: SQLite
- **ORM**: Prisma
- **UI**: Tailwind CSS
- **Estilo**: Mobile-first design

## Funcionalidades

- Gerenciamento de eventos (criar, visualizar, editar, excluir)
- Gerenciamento de participantes (adicionar, visualizar, editar, excluir)
- Check-in e check-out de participantes
- Estatísticas de eventos (ocupação, presença, etc.)
- Interface responsiva otimizada para dispositivos móveis

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Passos para Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/eventos-app.git
cd eventos-app
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure o banco de dados:
```bash
npx prisma generate
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

5. Acesse o sistema em seu navegador:
```
http://localhost:3000
```

## Estrutura do Projeto

- `/prisma`: Configuração do Prisma e schema do banco de dados
- `/src/app`: Código principal da aplicação
  - `/api`: Rotas da API (eventos, participantes, checkins)
  - `/eventos`, `/participantes`, `/checkins`: Páginas da aplicação
  - `/server`: Lógica do servidor (controllers e services)
- `/public`: Arquivos estáticos

## Licença

Este projeto está licenciado sob a licença MIT.
