const express = require('express');
const rotas = express.Router();
const { criarUsuario, listarContas } = require('../controlador/ControladorUsuario');
const multer = require('multer');
const path = require('path');

// Config do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- ROTAS DO FRONTEND (TELAS) ---

// Tela de Listagem (Paginação)
rotas.get('/jogadores', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'lista.html'));
});

// Tela de Cadastro (Se quiser acessar direto pela URL)
rotas.get('/cadastro', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'cadastro.html'));
});

// --- ROTAS DA API (DADOS) ---

// Listar (GET)
rotas.get('/api/usuario', listarContas);

// Cadastrar (POST) - AQUI ESTAVA O SEU ERRO DE CANNOT POST
rotas.post('/usuario', upload.single('avatar'), criarUsuario);

module.exports = rotas;