// servicos/ServicoUsuario.js
const bancodedados = require('../bancoDeDados');


const criarUsuario = async (dadosUsuario) => {
    const { nome, email, cep, endereco, cidade, estado, senha, senhaRepetida, foto } = dadosUsuario;

    // --- VALIDAÇÕES ---
    if (nome.length < 2 || nome.length > 50) {
        throw { status: 400, mensagem: "O nome precisa ter no mínimo 2 e no máximo 50 caracteres." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, mensagem: "E-mail inválido." };
    }

    // CORREÇÃO 1: Usamos bancodedados.contas direto
    const emailExistente = bancodedados.contas.find(usuario => usuario.email === email);
    if (emailExistente) {
        throw { status: 409, mensagem: "E-mail já cadastrado." };
    }

    if (endereco && endereco.length < 4) {
        throw { status: 400, mensagem: "Endereço curto demais." };
    }

    if (cep) {
        const cepValido = await validarCEP(cep);
        if (!cepValido) throw { status: 400, mensagem: "CEP inválido." };
    }

    if (cidade && cidade.length < 3) {
        throw { status: 400, mensagem: "Cidade inválida." };
    }

    if (estado && (estado.length !== 2 || !/^[A-Z]{2}$/i.test(estado))) {
        throw { status: 400, mensagem: "UF inválida." };
    }

    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[*;#])[A-Za-z\d*;#]{10,}$/;
    if (!senhaRegex.test(senha)) {
        throw { status: 400, mensagem: "Senha fraca (Use letras, números e * ; #)." };
    }

    if (senha !== senhaRepetida) {
        throw { status: 400, mensagem: "As senhas não coincidem." };
    }

    // --- CRIAÇÃO ---

    // CORREÇÃO 2: Atualizamos o ID direto no objeto principal
    const novoId = bancodedados.numeroUnico++;

    const conta = {
        numero: novoId,
        nome,
        email,
        cep,
        endereco,
        cidade,
        estado,
        senha,
        foto: foto || null, // Se não tiver foto, fica null
        data_criacao: new Date()
    };

    // CORREÇÃO 3: Salvamos no array principal
    bancodedados.contas.push(conta);

    return {
        mensagem: "Conta criada com sucesso!",
        conta: {
            numero: conta.numero,
            nome: conta.nome,
            email: conta.email,
            foto: conta.foto
        }
    };
};

const listarUsuarios = (pagina = 1, limite = 4) => {
    const pag = parseInt(pagina);
    const lim = parseInt(limite);

    // CORREÇÃO 4: Lemos do array principal
    const totalItens = bancodedados.contas.length;
    const totalPaginas = Math.ceil(totalItens / lim);

    const inicio = (pag - 1) * lim;
    const fim = pag * lim;

    const usuariosPaginados = bancodedados.contas.slice(inicio, fim);

    return {
        usuarios: usuariosPaginados,
        meta: {
            totalPaginas,
            paginaAtual: pag,
            totalItens,
            itensPorPagina: lim
        }
    };
};

// --- HELPERS ---
async function validarCEP(cep) {
    try {
        const cepNumerico = cep.replace(/\D/g, '');
        if (cepNumerico.length !== 8) return false;

        // OBS: Se seu Node for antigo, instale 'node-fetch' ou atualize o Node
        const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
        if (!response.ok) return false;

        const dados = await response.json();
        return !dados.erro;
    } catch {
        return false;
    }
}

module.exports = { criarUsuario, listarUsuarios };