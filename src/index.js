const express = require('express');
const cors = require('cors');
const rotas = require('./rotas/roteador'); // Confirme se o nome do arquivo é esse mesmo
const app = express();

// 1. CORS LIBERADO (Bala de Prata)
// Isso resolve o "Failed to fetch" imediatamente, aceitando localhost E 127.0.0.1
app.use(cors());

app.use(express.json());

// 2. ESSENCIAL: Libera a pasta de uploads para o navegador ver as fotos
// Sem isso, a imagem salva na pasta, mas não aparece no site.
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

app.use(rotas);

app.get('/', (req, res) => {
    res.json({ mensagem: 'Servidor está funcionando!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});