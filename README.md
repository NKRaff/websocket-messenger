# websocket-messenger

Aplicação de chat em tempo real construída com **Node.js**, **TypeScript**, **Express**, **Socket.IO** e **Sequelize**, organizada seguindo os princípios de **Clean Architecture**. Permite registro/login de usuários, criação de conversas e troca de mensagens instantâneas via WebSocket.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Executando o projeto](#executando-o-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [API HTTP](#api-http)
- [Eventos WebSocket](#eventos-websocket)
- [Banco de dados](#banco-de-dados)

## Funcionalidades

- Registro e login de usuários com senha criptografada (bcrypt)
- Autenticação via JWT, transportado em cookie `httpOnly`
- Criação de chats entre usuários
- Envio e recebimento de mensagens em tempo real via Socket.IO
- Carregamento do histórico de mensagens dos chats do usuário
- Interface web simples (HTML/CSS/JS) para login e chat

## Arquitetura

O projeto segue uma separação em camadas inspirada em Clean Architecture / DDD:

- **domain** — entidades de negócio puras (`User`, `Chat`, `Message`)
- **application** — casos de uso, DTOs e contratos (protocols/repositories) que a camada de domínio expõe para o mundo externo
- **infrastructure** — implementações concretas: banco de dados (Sequelize/SQLite), servidor HTTP/Socket.IO, segurança (bcrypt, JWT), geração de IDs
- **presentation** — controllers e schemas de validação (Zod) que recebem as requisições HTTP/WebSocket e acionam os casos de uso
- **shared** — tipos e erros compartilhados entre camadas

## Tecnologias

- [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/) — servidor HTTP
- [Socket.IO](https://socket.io/) — comunicação em tempo real
- [Sequelize](https://sequelize.org/) + [SQLite](https://www.sqlite.org/) — persistência de dados
- [JWT](https://jwt.io/) (`jsonwebtoken`) — autenticação
- [bcrypt](https://www.npmjs.com/package/bcrypt) — hash de senhas
- [Zod](https://zod.dev/) — validação de schemas
- [tsx](https://github.com/privatenumber/tsx) — execução em modo desenvolvimento com hot reload

## Pré-requisitos

- Node.js 18+ (recomendado)
- npm

## Instalação

```bash
git clone https://github.com/NKRaff/websocket-messenger.git
cd websocket-messenger
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

```env
HTTP_PORT=3000
BCRYPT_SALT=10
JWT_SECRET=sua-chave-secreta
```

| Variável       | Descrição                                         |
|----------------|----------------------------------------------------|
| `HTTP_PORT`    | Porta em que o servidor HTTP/Socket.IO irá escutar |
| `BCRYPT_SALT`  | Número de rounds do salt usado pelo bcrypt         |
| `JWT_SECRET`   | Segredo usado para assinar/verificar os tokens JWT |

## Executando o projeto

**Modo desenvolvimento** (hot reload com `tsx`):

```bash
npm run dev
```

**Build de produção:**

```bash
npm run build
npm start
```

Após iniciar, acesse `http://localhost:3000` (ou a porta configurada) no navegador.

## Estrutura de pastas

```
websocket-messenger/
├── public/                     # Front-end estático (login e chat)
│   ├── login.html
│   ├── chat.html
│   ├── scripts/
│   └── styles/
└── src/
    ├── domain/
    │   └── entities/           # User, Chat, Message
    ├── application/
    │   ├── use-cases/          # Login, Register, StartChat, SendMessage, LoadMessage
    │   ├── dtos/
    │   ├── repositories/       # Interfaces (contratos)
    │   └── protocols/          # Interfaces de infraestrutura (hash, token, id, controller)
    ├── infrastructure/
    │   ├── database/           # Sequelize, models e repositórios concretos
    │   ├── http/                # Servidor Express + Socket.IO, rotas e middlewares
    │   ├── security/           # bcrypt e JWT
    │   ├── identifiers/         # Gerador de UUID
    │   └── config/              # Variáveis de ambiente
    ├── presentation/
    │   ├── controllers/         # Controllers HTTP/WebSocket
    │   └── schemas/             # Validação com Zod
    ├── shared/                  # Tipos e erros compartilhados
    └── main.ts                  # Ponto de entrada (composição das dependências)
```

## API HTTP

Base URL: `http://localhost:<HTTP_PORT>`

### Usuários (`/user`)

| Método | Rota        | Autenticação | Descrição                          |
|--------|-------------|--------------|--------------------------------------|
| POST   | `/register` | Não          | Cria um novo usuário e retorna cookie de sessão |
| POST   | `/login`    | Não          | Autentica o usuário e retorna cookie de sessão |
| GET    | `/id`       | Sim          | Retorna o ID do usuário autenticado |
| GET    | `/logout`   | Sim          | Encerra a sessão (limpa o cookie)   |

### Chats (`/chat`)

| Método | Rota              | Autenticação | Descrição                             |
|--------|-------------------|--------------|-----------------------------------------|
| GET    | `/`               | Não          | Serve a página do chat                  |
| POST   | `/create`         | Sim          | Cria um novo chat entre usuários        |
| GET    | `/load-messages`  | Sim          | Carrega o histórico de mensagens do usuário |

> A autenticação é feita via cookie `access_token` (JWT), definido automaticamente no login/registro.

## Eventos WebSocket

A conexão Socket.IO também é autenticada via cookie `access_token`.

| Evento         | Direção          | Payload                                         | Descrição                                  |
|----------------|------------------|--------------------------------------------------|---------------------------------------------|
| `send_message` | Cliente → Servidor | `{ recipientId, chatId, message }`             | Envia uma mensagem em um chat               |
| `message`      | Servidor → Cliente | `{ id, chatId, sender, message, date }`        | Emitido para o remetente e o destinatário quando uma nova mensagem é salva |

## Banco de dados

O projeto utiliza **SQLite em memória** por padrão (`storage: ":memory:"` no `sequelize.ts`), com sincronização automática (`sync({ force: true })`) a cada inicialização — ou seja, **os dados não são persistidos entre reinicializações do servidor**. Para persistência real, altere a configuração em `src/infrastructure/database/sequelize.ts` para apontar para um arquivo `.sqlite` ou outro dialeto suportado pelo Sequelize.
