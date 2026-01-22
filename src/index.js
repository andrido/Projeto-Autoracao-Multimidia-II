const express = require('express');
const cors = require('cors');
const rotas = require('./rotas/roteador'); // Confirme se o nome do arquivo é esse mesmo
const path = require('path');
const app = express();


app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.static('public'));

app.use(rotas);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});