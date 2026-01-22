let paginaAtual = 1;
const limite = 4; // Quantos cards por página

document.addEventListener('DOMContentLoaded', () => {
    carregarUsuarios(paginaAtual);

    // Configura os botões
    document.getElementById('btnPrev').addEventListener('click', () => mudarPagina(-1));
    document.getElementById('btnNext').addEventListener('click', () => mudarPagina(1));
});

function mudarPagina(direcao) {
    paginaAtual += direcao;
    carregarUsuarios(paginaAtual);
}

async function carregarUsuarios(pagina) {
    const listContainer = document.getElementById('usersList');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const pageInfo = document.getElementById('pageInfo');

    // Efeito visual de carregamento
    listContainer.style.opacity = '0.5';

    try {
        // Agora passamos a página na URL
        const response = await fetch(`/listar_usuarios?pagina=${pagina}&limite=${limite}`);
        const dados = await response.json();

        // O backend agora retorna { usuarios: [], meta: {} }
        const listaUsuarios = dados.usuarios;
        const meta = dados.meta;

        listContainer.innerHTML = '';
        listContainer.style.opacity = '1';

        if (listaUsuarios.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; width:100%;">Nenhum jogador nesta página.</p>';
        } else {
            listaUsuarios.forEach(user => {
                const card = document.createElement('div');
                card.className = 'user-card';

                const imagemSrc = user.foto ? `/fotos_usuarios/${user.foto}` : 'https://i.pinimg.com/736x/6f/44/ab/6f44abacfded1fe9a286cedaaf87f1a2.jpg';

                card.innerHTML = `
                    <img src="${imagemSrc}" alt="Foto" class="card-avatar">
                    <div class="card-nick">${user.nickname || 'No Nick'}</div>
                    <div class="card-name">${user.nome}</div>
                    <div class="card-location">${user.cidade || '??'}/${user.estado || '??'}</div>
                `;
                listContainer.appendChild(card);
            });
        }

        // --- ATUALIZA OS BOTÕES ---
        pageInfo.innerText = `Pág ${meta.paginaAtual} de ${meta.totalPaginas}`;

        // Desativa "Anterior" se estiver na pág 1
        btnPrev.disabled = meta.paginaAtual <= 1;

        // Desativa "Próximo" se for a última página
        btnNext.disabled = meta.paginaAtual >= meta.totalPaginas;

    } catch (error) {
        console.error("Erro:", error);
        listContainer.innerHTML = '<p style="color: red; text-align:center;">Erro ao conectar com servidor.</p>';
    }
}