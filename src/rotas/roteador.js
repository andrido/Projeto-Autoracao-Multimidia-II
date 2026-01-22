const express = require('express');
const rotas = express.Router();
const { criarUsuario, listarContas } = require('../controlador/ControladorUsuario');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Rota da API (Dados)
rotas.get('/api/usuario', listarContas);

// --- CORREÇÃO AQUI ---
// Usamos process.cwd() para garantir que ele pegue a pasta 'public' na raiz do projeto
rotas.get('/jogadores', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'lista.html'));
});
// ---------------------

rotas.get('/cadastro', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'cadastro.html'));
});

module.exports = rotas;