# 📊 Dashboard de Vendas

Sistema full-stack de gestão de clientes e consultores com dashboard interativo, desenvolvido com Next.js 15, TypeScript, Tailwind CSS e Prisma ORM.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38bdf8?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?logo=prisma)

## 🚀 Funcionalidades

### 📈 Dashboard Interativo
- **Visualização de Clientes**: Tabela completa com dados de todos os clientes
- **Filtros Dinâmicos**: 
  - Filtro por consultor (nome ou email)
  - Filtro por período (data inicial e final)
- **Métricas em Tempo Real**: Total de novos clientes nos últimos 7 dias
- **Design Moderno**: Interface dark mode seguindo design Figma

### 👥 Gestão de Usuários
- **Cadastro de Clientes**: Formulário completo com validação
- **Máscaras de Input**: Formatação automática para telefone, CPF e CEP
- **Associação de Consultor**: Vinculação de clientes a consultores
- **Validação de Dados**: Verificação de emails únicos e campos obrigatórios

## 🛠️ Tecnologias Utilizadas

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router e Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Prisma ORM](https://www.prisma.io/)** - ORM type-safe para PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional (Supabase)
- **[Vercel](https://vercel.com/)** - Plataforma de deploy

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ ou 20+
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (para banco de dados)

### 1️⃣ Clone o Repositório
```bash
git clone <seu-repositorio>
cd teste_vendas
```

### 2️⃣ Instale as Dependências
```bash
npm install
```

### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Obtendo a URL do Supabase:**
1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **Settings** → **Database** → **Connection String**
3. Copie a **Session Pooler** connection string (porta 5432)
4. Substitua `[YOUR-PASSWORD]` pela senha do banco

### 4️⃣ Configure o Banco de Dados
```bash
# Gera o Prisma Client
npx prisma generate

# Cria as tabelas no banco
npx prisma db push

# (Opcional) Popula o banco com dados de teste
npx tsx prisma/seed.ts
```

### 5️⃣ Execute o Projeto
```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 📁 Estrutura do Projeto

```
teste_vendas/
├── app/
│   ├── api/
│   │   ├── clients/         # API para buscar clientes com filtros
│   │   ├── consultores/     # API para listar consultores
│   │   └── users/           # API CRUD de usuários
│   ├── dashboard/           # Página principal do dashboard
│   ├── usuarios/            # Página de gestão de usuários
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout raiz
│   └── page.tsx             # Página inicial (redirect)
├── components/
│   └── Header.tsx           # Componente de cabeçalho
├── lib/
│   ├── prisma.ts            # Cliente Prisma singleton
│   └── utils.ts             # Funções utilitárias
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── seed.ts              # Script de seed
└── package.json
```

## 🗄️ Schema do Banco de Dados

```prisma
model User {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  telefone    String?
  cpf         String?
  idade       Int?
  endereco    String?
  role        UserRole @default(CLIENT)
  consultorId String?
  consultor   User?    @relation("ConsultorClientes", fields: [consultorId], references: [id])
  clients     User[]   @relation("ConsultorClientes")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum UserRole {
  ADMIN
  CONSULTOR
  CLIENT
}
```

## 🚀 Deploy no Vercel

### Via GitHub (Recomendado)

1. **Push para o GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conecte no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em **"New Project"**
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente

3. **Variáveis de Ambiente no Vercel:**
   - `DATABASE_URL`: Sua connection string do Supabase
   - `NEXT_PUBLIC_APP_URL`: URL do seu deploy (ex: `https://seu-app.vercel.app`)

4. **Deploy Automático:**
   - O Vercel fará o build e deploy automaticamente
   - Cada push na branch `main` gerará um novo deploy

### Via CLI Vercel

```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Cria build de produção
npm start            # Inicia servidor de produção
npm run lint         # Executa ESLint
npx prisma studio    # Abre Prisma Studio (GUI do banco)
npx prisma generate  # Gera Prisma Client
npx prisma db push   # Sincroniza schema com o banco
npx tsx prisma/seed.ts  # Popula o banco com dados de teste
```

## 🎨 Features Implementadas

- ✅ Dashboard com tabela de clientes
- ✅ Filtro por consultor (nome/email)
- ✅ Filtro por período (data range dinâmica)
- ✅ Métricas de clientes (últimos 7 dias)
- ✅ Cadastro de usuários/clientes
- ✅ Máscaras para telefone, CPF e CEP
- ✅ Validação de formulários
- ✅ Associação cliente-consultor
- ✅ Design responsivo e dark mode
- ✅ API REST completa (GET, POST, PUT, DELETE)
- ✅ Seed de dados para testes

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

---

Desenvolvido com ❤️ por Eduardo
