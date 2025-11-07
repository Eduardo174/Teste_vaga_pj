# Dashboard de Vendas

Sistema de gestão de clientes e consultores com dashboard interativo.

## Tecnologias

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Supabase)

## Funcionalidades

### Dashboard
- Visualização de clientes em tabela
- Filtros por consultor e período
- Métricas de novos clientes

### Gestão de Usuários
- Cadastro de clientes e consultores
- Máscaras para telefone, CPF e CEP
- Vinculação de clientes a consultores

## Instalação

### Pré-requisitos
- Node.js 18+
- Conta no Supabase

### Configuração

1. Clone o repositório
```bash
git clone <seu-repositorio>
cd teste_vendas
```

2. Instale as dependências
```bash
npm install
```

3. Configure o arquivo `.env`
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true&connection_limit=1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Configure o banco de dados
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

5. Execute o projeto
```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura

```
teste_vendas/
├── app/
│   ├── api/              # Endpoints REST
│   ├── dashboard/        # Página principal
│   └── usuarios/         # Gestão de usuários
├── components/           # Componentes React
├── lib/                  # Utilitários
├── prisma/              # Schema e seed
└── package.json
```

## Deploy

Veja o arquivo `DEPLOY.md` para instruções completas de deploy no Vercel.

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm start        # Servidor de produção
npx prisma studio # Interface visual do banco
```

## Licença

Projeto desenvolvido para avaliação técnica.
