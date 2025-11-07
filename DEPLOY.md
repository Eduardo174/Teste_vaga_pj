# 🚀 Guia de Deploy no Vercel

Este guia irá ajudá-lo a fazer o deploy do Dashboard de Vendas na Vercel.

## 📋 Pré-requisitos

- ✅ Repositório Git criado (já feito!)
- ✅ Conta no GitHub
- ✅ Conta no Vercel
- ✅ Banco de dados Supabase configurado

## 🔄 Passo 1: Enviar código para o GitHub

### 1.1 Criar repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"** (botão verde)
3. Preencha:
   - **Repository name**: `dashboard-vendas` (ou outro nome)
   - **Description**: "Dashboard de vendas com Next.js 15, TypeScript e Prisma"
   - **Public** ou **Private** (sua escolha)
   - **NÃO** marque "Add a README file"
   - **NÃO** marque "Add .gitignore"
4. Clique em **"Create repository"**

### 1.2 Conectar repositório local ao GitHub

Copie os comandos que o GitHub mostrar (opção "…or push an existing repository from the command line"):

```bash
# Via WSL (recomendado)
wsl bash -c "cd /mnt/c/Users/eduar/Documents/teste_vendas && git remote add origin https://github.com/SEU-USUARIO/dashboard-vendas.git"
wsl bash -c "cd /mnt/c/Users/eduar/Documents/teste_vendas && git push -u origin main"
```

**Importante:** Substitua `SEU-USUARIO` e `dashboard-vendas` pelo seu usuário e nome do repositório.

### 1.3 Autenticação GitHub

Se for a primeira vez fazendo push, o GitHub pedirá autenticação:
- Use um **Personal Access Token (PAT)** como senha
- Para criar: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- Dê permissão de "repo"

## 🌐 Passo 2: Deploy no Vercel

### 2.1 Conectar GitHub ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login (pode usar sua conta GitHub)
3. Clique em **"Add New..."** → **"Project"**
4. Clique em **"Import Git Repository"**
5. Selecione o repositório `dashboard-vendas`
6. Clique em **"Import"**

### 2.2 Configurar o Projeto

Na tela de configuração:

#### Framework Preset
- Vercel detectará automaticamente: **Next.js**

#### Root Directory
- Deixe como está: `./`

#### Build and Output Settings
- Deixe os padrões:
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### 2.3 Configurar Variáveis de Ambiente

**IMPORTANTE:** Clique em **"Environment Variables"** e adicione:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Sua connection string do Supabase (Session Pooler) |
| `NEXT_PUBLIC_APP_URL` | Deixe em branco por enquanto (será preenchida depois) |

#### Como obter o DATABASE_URL:
1. Acesse [supabase.com](https://supabase.com)
2. Vá em **Settings** → **Database**
3. Copie a **Session Pooler** connection string (porta 5432)
4. Formato: `postgresql://postgres.xxx:senha@aws-1-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1`

### 2.4 Deploy!

1. Clique em **"Deploy"**
2. Aguarde o build (leva ~2-3 minutos)
3. ✅ Deploy concluído!

### 2.5 Atualizar NEXT_PUBLIC_APP_URL

Após o primeiro deploy:

1. Na dashboard do Vercel, copie a URL do projeto (ex: `https://seu-projeto.vercel.app`)
2. Vá em **Settings** → **Environment Variables**
3. Edite `NEXT_PUBLIC_APP_URL` e coloque a URL copiada
4. Clique em **"Save"**
5. Vá em **Deployments** e faça **"Redeploy"** na última versão

## 🗄️ Passo 3: Configurar Banco de Dados (se necessário)

Se o banco ainda não tiver as tabelas:

### Opção 1: Via Supabase SQL Editor
1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Execute o schema Prisma (copie de `prisma/schema.prisma`)

### Opção 2: Via Prisma (local)
```bash
# Certifique-se que o .env tem a URL correta
npx prisma db push
```

### Popular com dados de teste (opcional)
```bash
npx tsx prisma/seed.ts
```

## ✅ Verificar Deploy

1. Acesse a URL do Vercel
2. Navegue para `/dashboard`
3. Você deve ver o dashboard funcionando!

## 🔄 Deploys Futuros

Agora, sempre que você fizer um push para o GitHub:

```bash
wsl bash -c "cd /mnt/c/Users/eduar/Documents/teste_vendas && git add ."
wsl bash -c "cd /mnt/c/Users/eduar/Documents/teste_vendas && git commit -m 'Descrição da mudança'"
wsl bash -c "cd /mnt/c/Users/eduar/Documents/teste_vendas && git push"
```

O Vercel fará o deploy automático!

## 🐛 Troubleshooting

### Erro no Build
- Verifique os logs no Vercel
- Confirme que as variáveis de ambiente estão corretas
- Certifique-se que `npx prisma generate` está sendo executado (já está no postinstall)

### Erro de Conexão com Banco
- Use **Session Pooler** (porta 5432), não Transaction Pooler
- Adicione `?pgbouncer=true&connection_limit=1` na connection string
- Verifique se a senha está correta

### Página 404
- Verifique se o Output Directory está como `.next`
- Confirme que o build completou com sucesso

## 📝 Dicas

- Use **Preview Deployments**: Cada branch/PR gera um preview automático
- Configure **Custom Domain**: Settings → Domains
- Monitore **Analytics**: Vercel oferece analytics gratuitos
- Veja **Logs**: Real-time logs na dashboard do Vercel

---

## 🎉 Pronto!

Seu dashboard está no ar! 🚀

Compartilhe a URL: `https://seu-projeto.vercel.app/dashboard`
