// Apenas recebe requisição, orquestra e retorna resposta
const usuarioService = require('../servicos/ServicoUsuario');

const criarUsuario = async (req, res) => {
    try {
        const { nome, email, cep, endereco, cidade, estado, senha, senhaRepetida } = req.body;
        const foto = req.file ? req.file.filename : null;

        const resultado = await usuarioService.criarUsuario({
            nome, email, cep, endereco, cidade, estado, senha, senhaRepetida, foto
        });

        return res.status(201).json(resultado);

    } catch (erro) {
        if (erro.status) {
            return res.status(erro.status).json({
                mensagem: erro.mensagem
            });
        }

        console.error('Erro no controller:', erro);
        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
};

const listarContas = (req, res) => {
    try {

        const { pagina, limite } = req.query;

        const resultado = usuarioService.listarUsuarios(pagina, limite);

        return res.json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao listar contas' });
    }
};


module.exports = {
    criarUsuario,
    listarContas
};