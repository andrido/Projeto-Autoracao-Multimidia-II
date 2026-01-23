const express = require('express');
const rotas = express.Router();
const { criarUsuario, listarContas } = require('../controlador/ControladorUsuario');
const multer = require('multer');
const path = require('path');
const fs = require('fs');



const pastaFotos = path.join(process.cwd(), 'fotos_usuarios');

if (!fs.existsSync(pastaFotos)) {
    fs.mkdirSync(pastaFotos, { recursive: true });
    console.log("✅ Pasta 'fotos_usuarios' criada automaticamente!");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'fotos_usuarios/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

// --- ROTAS DO FRONTEND (Telas) ---
rotas.get('/jogadores', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'lista.html'));
});

rotas.get('/cadastro', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'cadastro.html'));
});

// --- ROTAS DA API ---
rotas.get('/listar_usuarios', listarContas);

rotas.post('/cadastrar_usuario', upload.single('avatar'), criarUsuario);

module.exports = rotas;