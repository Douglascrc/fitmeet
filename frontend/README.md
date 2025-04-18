# FITMEET - Frontend

Este é o frontend da aplicação FITMEET, desenvolvida para conectar pessoas através de atividades físicas. A interface permite aos usuários encontrar, criar e participar de atividades, gerenciar seus perfis e acompanhar seu progresso.

## Funcionalidades Principais

- Autenticação de Usuários (Login, Cadastro)
- Gerenciamento de Perfil (Visualização, Edição, Avatar, Preferências)
- Criação de Novas Atividades (com detalhes, imagem, localização no mapa)
- Visualização e Filtragem de Atividades
- Seleção de Tipos de Atividade
- Integração com Google Maps para seleção de Ponto de Encontro
- Visualização de Conquistas e Nível do Usuário
- Histórico de Atividades

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4
- **Componentes UI:** Shadcn UI
- **Gerenciamento de Formulários:** React Hook Form + Zod (para validação)
- **Requisições HTTP:** Axios
- **Roteamento:** React Router
- **Mapas:** Google Maps API (`@react-google-maps/api`)
- **Ícones:** Lucide React
- **Notificações (Toast):** Sonner
- **Manipulação de Datas:** date-fns
- **Temas:** next-themes

## Pré-requisitos

- Node.js (versão recomendada: 18 ou superior)
- npm (ou yarn/pnpm)
- Docker e Docker Compose (para rodar o backend e serviços dependentes)
- Uma Chave de API do Google Maps Platform (com as APIs Maps JavaScript e Geocoding habilitadas)

## Começando

### 1. Backend Setup

Este frontend depende de um backend rodando localmente. Assumindo que o backend está configurado com Docker Compose (como sugerido pelo `compose.yaml`):

```bash
# Navegue até o diretório raiz do projeto (que contém o compose.yaml do backend)
# Ex: cd ../backend  (Ajuste conforme sua estrutura)

# Suba os containers do backend, banco de dados e LocalStack
docker compose up -d
```

O backend estará acessível em `http://localhost:3000`.

### 2. Frontend Setup

```bash
# Clone o repositório (se ainda não o fez)
# git clone <url-do-repositorio>

# Navegue até o diretório do frontend
cd frontend

# Crie um arquivo .env na raiz do diretório /frontend
# Adicione sua chave da API do Google Maps
# Certifique-se de que a chave está prefixada com VITE_
echo "VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE_API_AQUI" > .env

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

A aplicação frontend estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## Variáveis de Ambiente

Para que a integração com o Google Maps funcione, você precisa configurar a seguinte variável de ambiente no arquivo `.env` na raiz do diretório `/frontend`:

- `VITE_GOOGLE_MAPS_API_KEY`: Sua chave de API do Google Maps Platform.

**Exemplo de `.env`:**

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBWAZJA7UN0yx6M5WuqKhW-g4R5RLrzQRw
```

_(Lembre-se de adicionar `.env` ao seu `.gitignore` para não commitar sua chave!)_

## Scripts Disponíveis

No diretório do projeto, você pode rodar:

- `npm run dev`: Inicia o servidor de desenvolvimento Vite.
- `npm run build`: Compila a aplicação para produção na pasta `dist/`.
- `npm run lint`: Executa o ESLint para verificar problemas no código.
- `npm run preview`: Inicia um servidor local para visualizar a build de produção.

## Estrutura de Pastas (`src/`)

```
src/
├── App.tsx             # Componente principal da aplicação e configuração de rotas
├── main.tsx            # Ponto de entrada da aplicação React
├── index.css           # Estilos globais e configuração do Tailwind
├── assets/             # Imagens estáticas, ícones, etc.
├── components/         # Componentes reutilizáveis da UI
│   ├── ui/             # Componentes base do Shadcn UI (Button, Card, Input, etc.)
│   ├── achievementCard.tsx # Card para exibir conquistas
│   ├── deactivateModal.tsx # Modal de confirmação para desativar conta
│   ├── header.tsx        # Cabeçalho da aplicação (inclui modal de criar atividade)
│   └── modal.tsx         # Componente base para modais
├── context/            # Context API (ex: AuthContext)
├── hooks/              # Hooks customizados (ex: useAuth)
├── lib/                # Utilitários gerais (ex: cn para classes Tailwind)
├── models/             # Definições de tipos/interfaces (Activity, User, etc.)
├── pages/              # Componentes de página (Home, Login, Profile, etc.)
├── services/           # Configuração e instâncias do Axios (api-service.ts)
└── utils/              # Funções utilitárias específicas
```
