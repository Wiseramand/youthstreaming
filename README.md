# Youth Angola Streaming

Um projeto de streaming para a juventude angolana, permitindo transmissões ao vivo, doações e interação em tempo real.

## Tecnologias

### Frontend
- React + TypeScript
- Vite (bundling)
- WebSocket para chat em tempo real

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (banco de dados)
- JWT para autenticação

## Funcionalidades

- **Transmissão ao vivo**: Streamers podem transmitir conteúdo em tempo real
- **Chat em tempo real**: Comunicação instantânea entre streamers e espectadores
- **Doações**: Sistema de apoio financeiro aos streamers
- **Autenticação**: Sistema de login e registro seguro
- **Painel administrativo**: Controle e gerenciamento da plataforma

## Instalação

### Backend

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Copie `.env.example` para `.env` e configure suas variáveis de ambiente
   - Execute as migrations:
     ```bash
     npx prisma migrate dev
     ```

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Frontend

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

```
youth-angola-streaming/
├── backend/           # API REST
│   ├── src/
│   │   ├── routes/    # Rotas da API
│   │   ├── middleware/ # Middleware de autenticação
│   │   └── services/  # Lógica de negócios
│   └── prisma/        # Schema do banco de dados
├── components/        # Componentes React
├── App.tsx           # Componente principal
└── README.md         # Este arquivo
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona feature X'`
4. Push para a branch: `git push origin feature/nome-da-feature`
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT.