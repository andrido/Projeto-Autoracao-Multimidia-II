let bancodedados = require('../bancoDeDados');
let { contas, numeroUnico } = bancodedados;




const criarUsuario = async (dadosUsuario) => {
    const { nome, email, cep, endereco, cidade, estado, senha, senhaRepetida, foto } = dadosUsuario;

    if (nome.length < 2 || nome.length > 50) {
        throw { status: 400, mensagem: "O nome precisa ter no mínimo 2 e no máximo 50 caracteres." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw { status: 400, mensagem: "E-mail inválido. Use o formato usuario@dominio.com" };
    }

    const emailExistente = contas.find(usuario => usuario.email === email);
    if (emailExistente) {
        throw { status: 409, mensagem: "Já existe um usuário cadastrado com este e-mail." };
    }

    if (endereco && endereco.length < 4) {
        throw { status: 400, mensagem: "Endereço deve ter no mínimo 4 caracteres." };
    }

    if (cep) {
        const cepValido = await validarCEP(cep);
        if (!cepValido) {
            throw { status: 400, mensagem: "CEP inválido ou não encontrado." };
        }
    }

    if (cidade && cidade.length < 3) {
        throw { status: 400, mensagem: "Cidade deve ter no mínimo 3 caracteres." };
    }

    if (estado && (estado.length !== 2 || !/^[A-Z]{2}$/i.test(estado))) {
        throw { status: 400, mensagem: "Estado deve ser uma sigla de 2 letras (ex: CE, SP)." };
    }

    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[*;#])[A-Za-z\d*;#]{10,}$/;
    if (!senhaRegex.test(senha)) {
        throw { status: 400, mensagem: "Senha deve ter mínimo 10 caracteres, com letras, números e pelo menos um destes: *, ;, #" };
    }

    if (senha !== senhaRepetida) {
        throw { status: 400, mensagem: "As senhas não coincidem." };
    }

    const conta = {
        numero: numeroUnico++,
        nome,
        email,
        cep,
        endereco,
        cidade,
        estado,
        senha,
        foto: foto || null,
        data_criacao: new Date()
    };

    contas.push(conta);

    return {
        mensagem: "Conta criada com sucesso!",
        conta: {
            numero: conta.numero,
            nome: conta.nome,
            email: conta.email,
            cidade: conta.cidade,
            estado: conta.estado,
            foto: conta.foto,
            data_criacao: conta.data_criacao
        }
    };
};

// -----  FUNÇÕES UTILITÁRIAS ---- //

async function validarCEP(cep) {
    try {
        const cepNumerico = cep.replace(/\D/g, '');
        if (cepNumerico.length !== 8) return false;

        const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
        if (!response.ok) return false;

        const dados = await response.json();
        return !dados.erro;
    } catch {
        return false;
    }
}

module.exports = { criarUsuario };