# GymApp 💪

App de registro de treinos para academia — PWA privado para uso pessoal.

## Funcionalidades

- Perfis separados por usuário
- Fichas de treino customizáveis (Treino A, B, C...)
- Sessão de treino com cronômetro, marcação de séries, controle de carga
- Histórico completo de treinos
- Gráficos de progresso por exercício (carga e volume)
- PWA: instala no celular como app real, sem App Store

---

## Deploy passo a passo (gratuito, ~15 minutos)

### 1. Instalar Node.js
Acesse https://nodejs.org e instale a versão LTS.

### 2. Instalar dependências e testar local
```bash
cd gymapp
npm install
npm run dev
```
Abra http://localhost:5173 no navegador para testar.

### 3. Criar conta no GitHub
Acesse https://github.com/signup e crie uma conta gratuita.

### 4. Criar repositório no GitHub
- Clique em "New repository"
- Nome: `gymapp`
- Deixe como **Private** (só você vê o código)
- Clique "Create repository"

### 5. Subir o código
Abra o terminal na pasta `gymapp` e execute:

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gymapp.git
git push -u origin main
```
(substitua SEU_USUARIO pelo seu usuário do GitHub)

### 6. Deploy na Vercel
1. Acesse https://vercel.com e clique em "Sign up with GitHub"
2. Clique em "Add New Project"
3. Selecione o repositório `gymapp`
4. Clique "Deploy" — sem alterar nada

Pronto! Em ~2 minutos você terá uma URL pública tipo:
`https://gymapp-seunome.vercel.app`

### 7. Instalar como app no celular
**Android (Chrome):**
- Abra a URL no Chrome
- Menu (⋮) → "Adicionar à tela inicial"

**iPhone (Safari):**
- Abra a URL no Safari
- Botão compartilhar → "Adicionar à Tela de Início"

---

## Atualizar o app

Sempre que quiser mudar algo no código:
```bash
git add .
git commit -m "descrição da mudança"
git push
```
A Vercel faz o deploy automaticamente em ~1 minuto.

---

## Dados

Os dados ficam salvos no `localStorage` do navegador de cada celular.
Para compartilhar dados entre dispositivos no futuro, a próxima evolução seria integrar o Supabase (banco de dados gratuito).
