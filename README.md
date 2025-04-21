# Sistema de Gerenciamento de Eventos

Este é um sistema de gerenciamento de eventos com funcionalidades de check-in/check-out de participantes, desenvolvido com foco em dispositivos móveis.

## Tecnologias Utilizadas

- **Frontend e Backend**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: SQLite
- **ORM**: Prisma
- **UI**: Tailwind CSS
- **Estilo**: Mobile-first design

## Funcionalidades

- Gerenciamento de eventos 
- Gerenciamento de participantes 
- Check-in e check-out de participantes
- Estatísticas de eventos (ocupação, presença, etc.)
- Interface responsiva otimizada para dispositivos móveis

## Dependências do Projeto

### Requisitos de Sistema
- **Node.js**: versão 18.x ou superior (recomendado 18.20.0+)
- **npm**: versão 9.x ou superior (incluído com o Node.js)
- **SQLite**: versão 3.x (geralmente já vem pré-instalado em muitos sistemas)

### Dependências Globais (opcional, mas recomendado)
```bash
npm install -g prisma typescript ts-node
```

### Dependências de Produção
- **Next.js**: 15.3.1
- **React**: 18.x
- **React DOM**: 18.x
- **Prisma Client**: 6.6.0

### Dependências de Desenvolvimento
- **TypeScript**: 5.x
- **ESLint**: 8.x
- **Tailwind CSS**: 3.3.0
- **Autoprefixer**: 10.x
- **PostCSS**: 8.x
- **ts-node**: 10.9.2

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Passos para Execução

1. Clone o repositório:
```bash
git clone https://github.com/natannaelicarodev/sistema-gerenciamento-eventos.git
cd sistema-gerenciamento-eventos
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
npx prisma migrate dev --name init
npx prisma db seed
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

## Possíveis Problemas e Soluções

- **Erro de SQLite**: Se encontrar problemas com SQLite, verifique se está instalado:
  - Windows: Baixe de [sqlite.org/download.html](https://sqlite.org/download.html)
  - Mac: `brew install sqlite`
  - Linux: `sudo apt install sqlite3` (Ubuntu/Debian) ou `sudo yum install sqlite` (CentOS/RHEL)

- **Erro de Prisma**: Se encontrar problemas com o Prisma:
  ```bash
  npx prisma generate
  ```

- **Erro de Next.js**: Se o arquivo `next.config.ts` causar problemas, renomeie para `next.config.js`

- **Erro de Tailwind**: Se encontrar problemas com o Tailwind:
  ```bash
  npx tailwindcss init -p
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
