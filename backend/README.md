# Projeto Gamificado - Backend

Este é o backend de um sistema gamificado onde os usuários ganham experiência (XP) conforme participam, interagem e criam atividades. O sistema recompensa com XP quando o usuário realiza ações como check-in em atividades e também quando cria eventos. Além disso, o usuário pode obter conquistas (achievements) ao atingir determinados marcos.

## Lógica do Projeto

- **Cadastro e Login:**  
  Os usuários se cadastram com nome, e-mail, CPF e senha. Após o cadastro, o login autentica o usuário usando JWT.
- **Interação com Atividades:**

  - **Criar Atividade:**  
    Ao criar uma atividade, o sistema gera um código de confirmação e recompensa o criador com XP (ex.: 20 pontos).
  - **Check-in em Atividades:**  
    Ao fazer check-in usando o código de confirmação, o participante recebe XP (ex.: 10 pontos).

- **Conquistas:**  
  Conforme o usuário interage (realiza check-in, cria atividade), o sistema verifica e concede conquistas (achievements).

- **Gestão de Preferências:**  
  Os usuários podem definir preferências para filtrar os tipos de atividades de seu interesse.

- **Armazenamento de Imagens:**  
  Imagens (como avatar e imagens das atividades) são armazenadas em um bucket S3 (usando LocalStack para ambiente de desenvolvimento).

## Tecnologias Utilizadas

- **Node.js & Express:**  
  Servidor e definição das rotas da API.

- **TypeScript:**  
  Linguagem utilizada para trazer tipagem estática e maior robustez ao código.

- **Prisma ORM:**  
  Utilizado para conexão e manipulação do banco de dados PostgreSQL.

- **JWT:**  
  Autenticação de endpoints protegidos.

- **AWS S3 & LocalStack:**  
  Armazenamento e gerenciamento de arquivos, como imagens.

- **Swagger:**  
  Documentação interativa da API (acessível em `/docs`).

- **Jest & Supertest:**  
  Ferramentas para testes unitários e de integração.

## Como Rodar o Projeto

### Instalação e Configuração

1. **Clone o repositório e acesse a pasta do backend:**

   ```bash
   cd backend
   ```

2. **Instale as dependências**
   ```bash
   npm install 
   ```
3. **Execução**
   ```bash
   npx prisma generate //para executar as migrações do prisma
   ```

   ```bash
   npm run dev //para rodar a aplicação com nodemon
   ```

   ```
   npx prisma db seed  //para popular o banco de dados
   ```
   
## Uso do Docker

1. **Certifique-se de ter Docker e Docker Compose instalados.**
2. **No diretório 📁backend, execute:**

```
docker compose up --build
```

- O Postgres rodará na Porta 5432
- O LocalStack para S3 estará disponível na porta 4566
- A API roda na porta 3000

## Documentação da API

a documentação dos endpoints está implementada com Swagger e pode ser acessada pelo endereço.

```
http://localhost:3000/docs
```

lá você encontrará informações sobre as rotas.
