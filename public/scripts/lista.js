document.addEventListener('DOMContentLoaded', () => {
    carregarUsuarios();
});

async function carregarUsuarios() {
    const listContainer = document.getElementById('usersList');

    try {
        // --- CORREÇÃO AQUI ---
        // Agora buscamos na rota certa de API
        const response = await fetch('/api/usuario');
        // ---------------------

        const usuarios = await response.json();
        listContainer.innerHTML = '';

        if (usuarios.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; width:100%;">Nenhum jogador encontrado 😢</p>';
            return;
        }

        usuarios.forEach(user => {
            const card = document.createElement('div');
            card.className = 'user-card';

            // Ajuste do caminho da imagem
            const imagemSrc = user.avatar ? `/uploads/${user.avatar}` : 'https://placekitten.com/100/100';

            card.innerHTML = `
                <img src="${imagemSrc}" alt="Foto" class="card-avatar">
                <div class="card-nick">${user.nickname || 'No Nick'}</div>
                <div class="card-name">${user.nome}</div>
                <div class="card-location">${user.cidade || '??'}/${user.estado || '??'}</div>
            `;
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        listContainer.innerHTML = '<p style="color: red; text-align:center;">Erro ao carregar lista.</p>';
    }
}