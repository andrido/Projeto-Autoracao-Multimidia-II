const express = require('express');
const cors = require('cors');
const path = require('path');
const rotas = require('./rotas/roteador');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/fotos_usuarios', express.static(path.join(process.cwd(), 'fotos_usuarios')));

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(rotas);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});