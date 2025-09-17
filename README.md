# InReader App

O **InReader App** é uma ferramenta que permite realizar upload, transcrição e análise de dados extraídos de imagens usando Inteligência Artificial, de acordo com as dúvidas do usuário.

🔗 Site de demonstração: [https://inreader-app.vercel.app](https://inreader-app.vercel.app)  
🔗 Repositório do backend: [https://github.com/phebueno/inreader-api](https://github.com/phebueno/inreader-api)

---

## 🛠 Tecnologias Utilizadas

- **Frontend:** React + Vite + TypeScript  
- **Estilização:** Tailwind CSS com componentes do shadcn-ui/ui

---

## ✨ Features

- Criação de conta e login de usuário  
- Dashboard interativo para gerenciar arquivos  
- Upload de imagens e arquivos para análise  
- Extração automática de texto de imagens  
- Análise inteligente dos dados extraídos  
- Download dos resultados finais das requisições  

---

## ⚙️ Como Rodar Localmente

1. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
````

2. Instale as dependências:
```bash
npm install
````

3. Rode o projeto em modo de desenvolvimento:
```bash
npm run start
````

4. Para buildar a versão de deploy:
modo de desenvolvimento:
```bash
npm run build
````

> Certifique-se de configurar corretamente as variáveis de ambiente no arquivo .env antes de rodar o projeto.