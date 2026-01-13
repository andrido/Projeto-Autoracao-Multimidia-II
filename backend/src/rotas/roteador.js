const express = require('express');
const rotas = express()
const { criarUsuario, listarContas } = require('../controlador/ControladorUsuario');


rotas.get('/usuario', listarContas);

rotas.post('/usuario', criarUsuario);

module.exports = rotas;