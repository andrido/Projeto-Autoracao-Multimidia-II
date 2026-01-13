const express = require('express')
const cors = require('cors');
const rotas = require('./rotas/roteador')
const app = express();

// Configure o CORS ANTES das rotas
app.use(cors({
    origin: 'http://127.0.0.1:5500', // ou 'http://localhost:5500'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(rotas);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ mensagem: 'Servidor está funcionando!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`📝 Endpoint: POST http://localhost:${PORT}/usuario`);
    console.log(`🔧 CORS configurado para: http://127.0.0.1:5500`);
});
