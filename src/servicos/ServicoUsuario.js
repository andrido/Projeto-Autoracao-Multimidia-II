const bancodedados = require('../bancoDeDados');

const criarUsuario = async (dadosUsuario) => {

    const { nome, email, cep, endereco, numero, complemento, cidade, estado, senha, senhaRepetida, foto, nickname, descricao } = dadosUsuario;

    // --- 1. REGRA DE SEGURANÇA (SQL INJECTION) ---
    const camposTexto = [nome, email, cep, endereco, numero, complemento, cidade, estado, senha, senhaRepetida, foto, nickname, descricao];
    const palavrasProibidas = ["SELECT", "CREATE", "DELETE", "UPDATE"];

    const tentouInjecao = camposTexto.some(campo => {
        if (!campo) return false;
        const texto = String(campo).toUpperCase();
        return palavrasProibidas.some(proibida => texto.includes(proibida));
    });

    if (tentouInjecao) {

        throw { status: 500, mensagem: "Tentativa de injeção SQL detectada. Operação bloqueada." };
    }
    // ----------------------------------------------------

    // --- VALIDAÇÕES NORMAIS ---
    if (nome.length < 2 || nome.length > 50) {
        throw { status: 400, mensagem: "O nome precisa ter no mínimo 2 e no máximo 50 caracteres." };
    }

    if (nickname && nickname.length < 3) {
        throw { status: 400, mensagem: "O Nickname deve ter pelo menos 3 caracteres." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, mensagem: "E-mail inválido. Formato: ccc@ddd.ccc" };
    }

    const emailExistente = bancodedados.contas.find(usuario => usuario.email === email);
    if (emailExistente) {
        throw { status: 409, mensagem: "E-mail já cadastrado." };
    }

    if (endereco && endereco.length < 4) {
        throw { status: 400, mensagem: "Endereço deve ter no mínimo 4 caracteres." };
    }

    if (cep) {
        const cepValido = await validarCEP(cep);
        if (!cepValido) throw { status: 400, mensagem: "CEP inválido ou não encontrado." };
    }

    if (cidade && cidade.length < 3) {
        throw { status: 400, mensagem: "Cidade deve ter no mínimo 3 caracteres." };
    }

    if (estado && (estado.length !== 2 || !/^[A-Z]{2}$/i.test(estado))) {
        throw { status: 400, mensagem: "Estado deve ter exatamente 2 caracteres." };
    }

    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[*;#])[A-Za-z\d*;#]{10,}$/;
    if (!senhaRegex.test(senha)) {
        throw { status: 400, mensagem: "Senha fraca. Mínimo 10 chars, letras, números e apenas * ; #" };
    }

    if (senha !== senhaRepetida) {
        throw { status: 400, mensagem: "As senhas não coincidem." };
    }

    // --- CRIAÇÃO ---
    const novoId = bancodedados.numeroUnico++;

    const conta = {
        numero: novoId,
        nickname: nickname || null,
        descricao: descricao || null,
        nome,
        email,
        cep,
        endereco,
        numero: numero || "SN",
        complemento: complemento || "",
        cidade,
        estado,
        senha,
        foto: foto || null,
        data_criacao: new Date()
    };

    bancodedados.contas.push(conta);

    return {
        mensagem: "OK",
        conta: {
            numero: conta.numero,
            nome: conta.nome,
            foto: conta.foto
        }
    };
};

const listarUsuarios = (pagina = 1, limite = 4) => {

    const pag = parseInt(pagina);
    const lim = parseInt(limite);
    const totalItens = bancodedados.contas.length;
    const totalPaginas = Math.ceil(totalItens / lim);
    const inicio = (pag - 1) * lim;
    const fim = pag * lim;
    const usuariosPaginados = bancodedados.contas.slice(inicio, fim);

    return {
        usuarios: usuariosPaginados,
        meta: { totalPaginas, paginaAtual: pag, totalItens, itensPorPagina: lim }
    };
};

async function validarCEP(cep) {
    try {
        const cepNumerico = cep.replace(/\D/g, '');
        if (cepNumerico.length !== 8) return false;
        const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
        if (!response.ok) return false;
        const dados = await response.json();
        return !dados.erro;
    } catch { return false; }
}

module.exports = { criarUsuario, listarUsuarios };