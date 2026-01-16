const express = require('express');
const rotas = express.Router();
const { criarUsuario, listarContas } = require('../controlador/ControladorUsuario');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        // Aqui a gente GARANTE a extensão original
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

rotas.get('/usuario', listarContas);

rotas.post('/usuario', upload.single('avatar'), criarUsuario);

module.exports = rotas;