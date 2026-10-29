# Pj Memories

Aplicação web para registrar e consultar memórias pessoais com título, descrição e imagem, além de permitir comentários. O projeto utiliza **React** no front-end, uma **API REST com Node.js e Express** e **MongoDB** com Mongoose.

> **Sobre a origem:** este projeto começou como um exercício de estudo baseado em material de curso. Este repositório documenta correções e melhorias técnicas realizadas durante sua preparação para portfólio, sem apresentar a base original como autoria integral.

## Funcionalidades

- Listar memórias cadastradas.
- Criar uma memória com título, descrição e imagem.
- Visualizar os detalhes de uma memória.
- Adicionar comentários.
- Excluir uma memória.
- Alternar o estado de favorito por meio da API.
- Atualizar uma memória por meio da API.

**Observação:** uma rota disponível na API não significa necessariamente que a funcionalidade tenha uma tela correspondente no front-end.

## Tecnologias utilizadas

### Front-end
- React
- Vite
- React Router
- JavaScript (ES modules)
- Axios

### Back-end
- Node.js
- Express
- Mongoose
- Multer
- dotenv

### Banco de dados
- MongoDB Atlas (ou outra instância MongoDB acessível)

## Requisitos

Antes de executar o projeto, instale:

- [Node.js](https://nodejs.org/)
- npm (incluído na instalação do Node.js)
- Uma instância MongoDB local ou uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)

## Como executar localmente

O front-end e o back-end são iniciados separadamente. Os comandos abaixo pressupõem que as pastas `backend` e `frontend` estejam no diretório principal do projeto.

### 1. Configurar e iniciar o back-end

No terminal, entre na pasta do back-end e instale as dependências:

```bash
cd backend
npm install
```

Crie seu arquivo de ambiente a partir do modelo:

```bash
cp .env.example .env
```

Abra `backend/.env` e configure `MONGODB_URI` com a URI do seu banco de dados. Se necessário, ajuste também `PORT` e `FRONTEND_URL`.

**Não compartilhe nem envie o arquivo `.env` para o GitHub.** Use apenas valores ilustrativos no arquivo `.env.example`.

Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

Como alternativa, execute `npm start` para iniciar sem o Nodemon.

Por padrão, a API fica disponível em `http://localhost:3000`. A rota `http://localhost:3000/health` pode ser usada para verificar se o servidor está respondendo.

### 2. Configurar e iniciar o front-end

Abra um **segundo terminal**. A partir do diretório principal do projeto, execute:

```bash
cd frontend
npm install
cp .env.example .env
```

Por padrão, o front-end utiliza `http://localhost:3000` como endereço da API. Para alterar esse endereço, configure `VITE_API_URL` no arquivo `frontend/.env`.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço local informado pelo Vite. Sempre que alterar variáveis de ambiente do front-end, reinicie o servidor Vite.

## Rotas principais da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está respondendo |
| `GET` | `/memories` | Lista as memórias |
| `POST` | `/memories` | Cria uma memória; o arquivo de imagem é enviado no campo `image` |
| `GET` | `/memories/:id` | Consulta uma memória específica |
| `PATCH` | `/memories/:id` | Atualiza campos da memória e/ou sua imagem |
| `DELETE` | `/memories/:id` | Exclui uma memória |
| `PATCH` | `/memories/:id/comment` | Adiciona um comentário |
| `PATCH` | `/memories/favorite/:id` | Alterna o estado de favorito |

## Segurança e manutenção

- Não publique arquivos `.env`, senhas, tokens ou URIs privadas.
- Mantenha o `.env.example` livre de credenciais reais.
- Não versione diretórios de dependências (`node_modules`) nem arquivos gerados de build (`dist`).
- O upload de imagens aceita arquivos JPEG e PNG de até **5 MB**.
- A API retorna códigos HTTP e mensagens de erro para os principais casos de falha.

## Publicação (deploy)

A aplicação pode ser publicada usando, por exemplo, Vercel ou Netlify para o front-end, Render para a API e MongoDB Atlas para o banco. A escolha da plataforma deve considerar as condições atuais do serviço e os requisitos de armazenamento.

Configure as variáveis de ambiente diretamente nas configurações de cada serviço:

- **Back-end:** `MONGODB_URI`, `PORT` (quando exigida ou fornecida pela plataforma) e `FRONTEND_URL` com a origem pública do front-end.
- **Front-end:** `VITE_API_URL` com a URL pública da API.

### Atenção ao armazenamento de imagens

Atualmente, os arquivos enviados são armazenados no sistema de arquivos local do back-end. Antes de publicar, verifique se a plataforma preserva os arquivos enviados após reinicializações e novos deploys. Se o armazenamento for efêmero, utilize armazenamento persistente ou um serviço de armazenamento de objetos para evitar a perda das imagens.

Planos gratuitos podem ter limites de uso, armazenamento ou suspensão por inatividade. Consulte as condições atuais da plataforma escolhida antes de realizar o deploy.

## Créditos e melhorias técnicas

A base do projeto foi desenvolvida como exercício de aprendizagem a partir de material de curso. Nesta versão, foram trabalhados aspectos técnicos como:

- Configuração por variáveis de ambiente.
- Proteção de arquivos locais e dados sensíveis.
- Validação de entradas e tratamento de erros.
- Ajustes nas operações relacionadas a imagens.
- Tratamento de estados de carregamento e erro no front-end.
- Revisões visuais e de usabilidade.

Novas funcionalidades ou alterações autorais devem ser documentadas nesta seção conforme forem definidas e implementadas.
