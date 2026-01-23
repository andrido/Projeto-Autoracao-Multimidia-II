// Variáveis e Elementos
let currentStep = 1;
const totalSteps = 3;

const nextBtn = document.getElementById('nextBtn');
const form = document.getElementById('pixelForm');

// Variáveis Novas
const btnUpload = document.getElementById('btnUpload');
const btnLimpar = document.getElementById('btnLimpar');

// Inputs
const inputNome = document.getElementById('nome');
const inputCep = document.getElementById('cep');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');
const inputEndereco = document.getElementById('endereco');
const inputNumero = document.getElementById('numero');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const inputConfirmaSenha = document.getElementById('confirmaSenha');
const inputNickname = document.getElementById('nickname');
const inputDescricao = document.getElementById('descricao');
const inputAvatar = document.getElementById('avatarInput');
const fotoPreview = document.getElementById('fotoPreview');

// --- 1. FAZER O BOTÃO DE FOTO FUNCIONAR ---
if (btnUpload) {
    btnUpload.addEventListener('click', (e) => {
        e.preventDefault();
        inputAvatar.click(); // Clica no input escondido
    });
}

// --- 2. LÓGICA DO BOTÃO LIMPAR ---
if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
        // Confirmação para não apagar sem querer
        if (confirm("Deseja limpar todo o formulário?")) {
            form.reset(); // Limpa inputs

            // Reseta visual da foto
            fotoPreview.textContent = "🐱";
            fotoPreview.style.backgroundImage = "none";

            // Remove mensagens de erro
            document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

            // Volta para o Passo 1
            currentStep = 1;
            updateUI();
        }
    });
}


function playErrorSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 110;
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) { console.error("Audio error"); }
}

// --- LÓGICA DE PREVIEW DE IMAGEM ---
inputAvatar.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 2MB.");
            this.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            fotoPreview.textContent = "";
            fotoPreview.style.backgroundImage = `url(${e.target.result})`;
        }
        reader.readAsDataURL(file);
    }
});

// --- API CEP ---
inputCep.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) value = value.substring(0, 5) + '-' + value.substring(5, 8);
    e.target.value = value;
});

inputCep.addEventListener('blur', async () => {
    const cep = inputCep.value.replace(/\D/g, '');
    if (cep.length === 8) {
        inputCidade.value = "...";
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) {
                setError(inputCep, "CEP não encontrado!");
                inputCidade.value = "";
                inputEndereco.value = "";
                inputEstado.value = "";
            } else {
                inputCidade.value = data.localidade;
                inputEstado.value = data.uf;
                inputEndereco.value = data.logradouro;
                removeError(inputCep);
                inputNumero.focus();
            }
        } catch (error) {
            setError(inputCep, "Erro de conexão.");
        }
    }
});

// --- SISTEMA DE ERROS ---
function setError(input, message) {
    const inputGroup = input.parentElement;
    let errorDisplay = inputGroup.querySelector('.error-msg');
    if (!errorDisplay) {
        errorDisplay = document.createElement('small');
        errorDisplay.className = 'error-msg';
        inputGroup.appendChild(errorDisplay);
    }
    errorDisplay.innerText = message;
    errorDisplay.style.display = 'block';
    input.classList.add('input-error');
}

function removeError(input) {
    const inputGroup = input.parentElement;
    const errorDisplay = inputGroup.querySelector('.error-msg');
    if (errorDisplay) {
        errorDisplay.style.display = 'none';
        errorDisplay.innerText = '';
    }
    input.classList.remove('input-error');
}

// --- VALIDAÇÕES ---
function validateStep1() {
    let isValid = true;
    if (inputNome.value.trim().length < 2 || inputNome.value.trim().length > 50) {
        setError(inputNome, "Nome entre 2 e 50 letras.");
        isValid = false;
    } else removeError(inputNome);

    if (inputCep.value.replace(/\D/g, '').length !== 8) {
        setError(inputCep, "CEP inválido.");
        isValid = false;
    } else removeError(inputCep);

    if (inputCidade.value.trim().length < 3) {
        setError(inputCidade, "Cidade inválida.");
        isValid = false;
    } else removeError(inputCidade);

    if (inputEstado.value.length !== 2) {
        setError(inputEstado, "UF inválida.");
        isValid = false;
    } else removeError(inputEstado);

    if (inputEndereco.value.trim().length < 4) {
        setError(inputEndereco, "Endereço mín 4 letras.");
        isValid = false;
    } else removeError(inputEndereco);

    removeError(inputNumero);

    return isValid;
}

function validateStep2() {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail.value)) {
        setError(inputEmail, "E-mail inválido.");
        isValid = false;
    } else removeError(inputEmail);

    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[*;#])[A-Za-z\d*;#]{10,}$/;
    if (!senhaRegex.test(inputSenha.value)) {
        setError(inputSenha, "Mín 10 chars, letras, nºs e (* ; ou #).");
        isValid = false;
    } else removeError(inputSenha);

    if (inputConfirmaSenha.value !== inputSenha.value) {
        setError(inputConfirmaSenha, "Senhas não conferem.");
        isValid = false;
    } else removeError(inputConfirmaSenha);

    return isValid;
}

function validateStep3() {
    let isValid = true;
    if (inputNickname.value.trim().length < 3 && inputNickname.value.trim().length > 0) {
        setError(inputNickname, "Nick deve ter 3+ letras.");
        isValid = false;
    } else removeError(inputNickname);
    return isValid;
}

// --- NAVEGAÇÃO ---
function updateUI() {
    for (let i = 1; i <= totalSteps; i++) {
        const stepDiv = document.getElementById(`step-${i}`);
        const dot = document.getElementById(`dot-${i}`);

        if (i === currentStep) stepDiv.classList.add('active-step');
        else stepDiv.classList.remove('active-step');

        if (i <= currentStep) dot.classList.add('active');
        else dot.classList.remove('active');
    }
    if (currentStep === totalSteps) nextBtn.innerText = 'CRIAR CONTA';
    else nextBtn.innerText = 'PRÓXIMO';
}

nextBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let canProceed = false;

    if (currentStep === 1) canProceed = validateStep1();
    else if (currentStep === 2) canProceed = validateStep2();
    else if (currentStep === 3) canProceed = validateStep3();

    if (canProceed) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateUI();
        } else {
            // === ENVIO BACKEND ===
            const originalText = nextBtn.innerText;
            nextBtn.innerText = "ENVIANDO...";
            nextBtn.disabled = true;

            try {

                const formData = new FormData(form);

                if (inputNumero.value.trim() === "") {
                    formData.set('numero', 'SN');
                }

                const arquivoInput = document.getElementById('avatarInput');

                if (arquivoInput.files.length > 0) {
                    formData.set('avatar', arquivoInput.files[0]);
                    console.log("📸 Foto anexada manualmente:", arquivoInput.files[0].name);
                } else {
                    console.warn("⚠️ Nenhuma foto selecionada pelo usuário.");
                }

                formData.append('senhaRepetida', inputConfirmaSenha.value);

                const response = await fetch('/cadastrar_usuario', {
                    method: 'POST',
                    body: formData
                });

                const textResponse = await response.text();
                let result;

                try {
                    result = JSON.parse(textResponse);
                } catch (e) {
                    console.error("Erro CRÍTICO do servidor (HTML):", textResponse);
                    throw new Error("O servidor falhou (Erro 500). Olhe o console (F12).");
                }

                if (response.ok) {
                    alert("🎉 Sucesso! Conta criada e foto salva!");
                    window.location.href = "/jogadores";
                } else {
                    alert(`Erro: ${result.mensagem || 'Falha ao cadastrar'}`);
                    playErrorSound();
                }

            } catch (error) {
                console.error("Erro detalhado:", error);
                alert("Erro técnico: " + error.message);
                playErrorSound();
            } finally {
                nextBtn.innerText = originalText;
                nextBtn.disabled = false;
            }
        }
    } else {
        playErrorSound();
        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');
    }
});