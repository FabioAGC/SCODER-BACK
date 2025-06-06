Instalação

1. Clone o repositório
```bash
git clone https://github.com/FabioAGC/SCODER-BACK
cd backend
```

2. Instale as dependências
```bash
npm install
```

3. Crie um arquivo `.env` no diretório raiz com as seguintes variáveis:
```env
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

### Executando a Aplicação

#### Modo Desenvolvimento
```bash
npm run dev
```
