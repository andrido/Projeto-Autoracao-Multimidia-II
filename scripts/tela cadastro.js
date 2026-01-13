document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-cadastro');
    const btnLimpar = document.getElementById('btn-limpar');
    const resultadoDiv = document.getElementById('resultado');
    const cepInput = document.getElementById('cep');

    async function buscarCEP(cep) {
        cep = cep.replace(/\D/g, '');
        if (cep.length !== 8) return null;

        try {
            cepInput.classList.add('loading');
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            cepInput.classList.remove('loading');

            if (data.erro) return null;
            return data;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            cepInput.classList.remove('loading');
            return null;
        }
    }

    function preencherCamposEndereco(data) {
        if (!data) return;

        const enderecoInput = document.getElementById('endereco');
        if (enderecoInput && data.logradouro) {
            enderecoInput.value = data.logradouro;
        }

        const cidadeInput = document.getElementById('cidade');
        if (cidadeInput && data.localidade) {
            cidadeInput.value = data.localidade;
        }

        const estadoInput = document.getElementById('estado');
        if (estadoInput && data.uf) {
            estadoInput.value = data.uf.toUpperCase();
        }

        adicionarBotaoLimparBusca();
    }

    function adicionarBotaoLimparBusca() {
        const botaoAnterior = document.querySelector('.btn-limpar-cep');
        if (botaoAnterior) botaoAnterior.remove();

        const cepGroup = document.querySelector('.form-group:has(#cep)');
        if (cepGroup) {
            const clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.className = 'btn-limpar-cep';
            clearButton.textContent = 'Limpar busca';
            clearButton.addEventListener('click', function () {
                document.getElementById('endereco').value = '';
                document.getElementById('cidade').value = '';
                document.getElementById('estado').value = '';
                clearButton.remove();
                cepInput.focus();
            });
            cepGroup.appendChild(clearButton);
        }
    }

    cepInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        e.target.value = value;

        const cepError = document.getElementById('cep-error');
        const cepPattern = /^\d{5}-\d{3}$/;

        if (e.target.value && !cepPattern.test(e.target.value)) {
            if (cepError) cepError.textContent = 'Formato inválido. Use 00000-000';
        } else {
            if (cepError) cepError.textContent = '';
        }
    });

    cepInput.addEventListener('blur', async function (e) {
        const cep = e.target.value;
        const cepError = document.getElementById('cep-error');

        if (cepError) cepError.textContent = '';
        if (!cep.trim()) return;

        const cepPattern = /^\d{5}-\d{3}$/;
        if (!cepPattern.test(cep)) {
            if (cepError) cepError.textContent = 'CEP inválido. Use o formato 00000-000';
            return;
        }

        const data = await buscarCEP(cep);

        if (data) {
            preencherCamposEndereco(data);
            if (cepError) cepError.textContent = '';
        } else {
            if (cepError) cepError.textContent = 'CEP não encontrado. Verifique e tente novamente.';
        }
    });

    function showError(fieldId, message) {
        const errorSpan = document.getElementById(fieldId + '-error');
        errorSpan.textContent = message;
        document.getElementById(fieldId).style.borderColor = '#ff5555';
    }

    function clearError(fieldId) {
        const errorSpan = document.getElementById(fieldId + '-error');
        errorSpan.textContent = '';
        document.getElementById(fieldId).style.borderColor = '#333';
    }

    function validateNome() {
        const nome = document.getElementById('nome').value.trim();
        if (nome.length < 3 || nome.length > 50) {
            showError('nome', 'Nome deve ter entre 3 e 50 caracteres.');
            return false;
        }
        clearError('nome');
        return true;
    }

    function validateEmail() {
        const email = document.getElementById('email').value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            showError('email', 'E-mail inválido. Use o formato: usuario@dominio.com');
            return false;
        }
        clearError('email');
        return true;
    }

    function validateEndereco() {
        const endereco = document.getElementById('endereco').value.trim();
        if (endereco.length < 4) {
            showError('endereco', 'Endereço deve ter no mínimo 4 caracteres.');
            return false;
        }
        clearError('endereco');
        return true;
    }

    function validateCEP() {
        const cep = document.getElementById('cep').value.trim();
        const regex = /^\d{5}-\d{3}$/;
        if (!regex.test(cep)) {
            showError('cep', 'CEP inválido. Use o formato: 00000-000');
            return false;
        }
        clearError('cep');
        return true;
    }

    function validateCidade() {
        const cidade = document.getElementById('cidade').value.trim();
        if (cidade.length < 3) {
            showError('cidade', 'Cidade deve ter no mínimo 3 caracteres.');
            return false;
        }
        clearError('cidade');
        return true;
    }

    function validateEstado() {
        const estado = document.getElementById('estado').value.trim().toUpperCase();
        const regex = /^[A-Z]{2}$/;
        if (!regex.test(estado)) {
            showError('estado', 'Estado deve ser uma sigla de 2 letras (ex: CE, SP).');
            return false;
        }
        document.getElementById('estado').value = estado;
        clearError('estado');
        return true;
    }

    function validateSenha() {
        const senha = document.getElementById('senha').value;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[*;#])[A-Za-z\d*;#]{10,}$/;
        if (!regex.test(senha)) {
            showError('senha', 'Senha deve ter mínimo 10 caracteres, com letras, números e pelo menos um destes: *, ;, #');
            return false;
        }
        clearError('senha');
        return true;
    }

    function validateRepetirSenha() {
        const senha = document.getElementById('senha').value;
        const repetir = document.getElementById('repetir-senha').value;
        if (senha !== repetir) {
            showError('repetir-senha', 'As senhas não coincidem.');
            return false;
        }
        clearError('repetir-senha');
        return true;
    }

    function validateForm() {
        const validations = [
            validateNome(),
            validateEmail(),
            validateEndereco(),
            validateCEP(),
            validateCidade(),
            validateEstado(),
            validateSenha(),
            validateRepetirSenha()
        ];
        return validations.every(v => v === true);
    }

    document.getElementById('nome').addEventListener('blur', validateNome);
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('endereco').addEventListener('blur', validateEndereco);
    document.getElementById('cep').addEventListener('blur', validateCEP);
    document.getElementById('cidade').addEventListener('blur', validateCidade);
    document.getElementById('estado').addEventListener('blur', validateEstado);
    document.getElementById('senha').addEventListener('blur', validateSenha);
    document.getElementById('repetir-senha').addEventListener('blur', validateRepetirSenha);

    btnLimpar.addEventListener('click', function () {
        form.reset();
        document.querySelectorAll('.error').forEach(e => e.textContent = '');
        document.querySelectorAll('input').forEach(i => i.style.borderColor = '#333');
        resultadoDiv.style.display = 'none';
        form.style.display = 'block';
        document.querySelector('header').style.display = 'block';

        const botaoLimparBusca = document.querySelector('.btn-limpar-cep');
        if (botaoLimparBusca) botaoLimparBusca.remove();
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateForm()) {
            alert('Por favor, corrija os erros antes de enviar.');
            return;
        }

        // Coletar dados SEM A SENHA PARA EXIBIÇÃO
        const dadosParaExibir = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            endereco: document.getElementById('endereco').value.trim(),
            cep: document.getElementById('cep').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            estado: document.getElementById('estado').value.trim().toUpperCase()

        };


        const dadosParaBackend = {
            ...dadosParaExibir,
            senha: document.getElementById('senha').value,
            senhaRepetida: document.getElementById('repetir-senha').value
        };

        try {
            const btnEnviar = document.getElementById('btn-enviar');
            const originalText = btnEnviar.textContent;
            btnEnviar.textContent = 'Enviando...';
            btnEnviar.disabled = true;

            const response = await fetch('http://localhost:3000/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaBackend)
            });

            const result = await response.json();

            btnEnviar.textContent = originalText;
            btnEnviar.disabled = false;

            if (response.ok) {
                form.style.display = 'none';
                document.querySelector('header').style.display = 'none';

                // Exibe os dados SEM SENHA
                resultadoDiv.innerHTML = `
                    <h3>🎉 Cadastro Realizado com Sucesso!</h3>
                    <pre>${JSON.stringify(dadosParaExibir, null, 2)}</pre>
                    <button onclick="window.location.reload()">Fazer Novo Cadastro</button>
                `;
                resultadoDiv.style.display = 'block';
            } else {
                alert(`Erro: ${result.mensagem || 'Falha ao cadastrar'}`);
            }

        } catch (error) {
            console.error('Erro:', error);
            const btnEnviar = document.getElementById('btn-enviar');
            btnEnviar.textContent = 'Enviar';
            btnEnviar.disabled = false;
            alert('Erro de conexão com o servidor. Tente novamente.');
        }
    });
});