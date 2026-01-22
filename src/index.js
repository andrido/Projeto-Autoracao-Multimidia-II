const express = require('express');
const cors = require('cors');
const path = require('path');
const rotas = require('./rotas/roteador');

const app = express();

app.use(cors());
app.use(express.json());

// --- MUDANÇA: Pasta exigida pelo professor ---
app.use('/fotos_usuarios', express.static(path.join(process.cwd(), 'fotos_usuarios')));

// Arquivos do site (front)
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(rotas);

// --- MUDANÇA: Porta 5000 exigida ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});