document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/pages/login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const cineId = urlParams.get('cineId');
    const cineNombre = urlParams.get('cineNombre');

    if (!cineId) {
        alert('No se ha especificado un cine.');
        window.location.href = '/pages/cines.html';
        return;
    }

    document.getElementById('cineNameTitle').textContent = `Salas de: ${cineNombre}`;

    const salasCardsContainer = document.getElementById('salasCardsContainer');
    const modal = document.getElementById('salaModal');
    const modalTitle = document.getElementById('modalTitle');
    const salaForm = document.getElementById('salaForm');
    const addSalaBtn = document.getElementById('addSalaBtn');
    const closeModalBtn = document.querySelector('.close-button');

    const apiBaseUrl = `/api/cines/${cineId}/salas`;

    async function fetchSalas() {
        try {
            const response = await fetch(apiBaseUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener las salas');

            const salas = await response.json();
            salasCardsContainer.innerHTML = '';
            salas.forEach(sala => {
                const card = document.createElement('div');
                card.className = 'sala-card';
                card.innerHTML = `
                    <div class="sala-info">
                        <div class="sala-icon"><i class="fas fa-couch"></i></div>
                        <div class="sala-details">
                            <h3>${sala.codigo}</h3>
                            <p>${sala.numero_sillas} sillas</p>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn" data-id="${sala._id}" data-codigo="${sala.codigo}" data-sillas="${sala.numero_sillas}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" data-id="${sala._id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                salasCardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    function openModal(mode, sala = null) {
        salaForm.reset();
        if (mode === 'add') {
            modalTitle.textContent = 'Añadir Nueva Sala';
            document.getElementById('salaId').value = '';
        } else if (mode === 'edit' && sala) {
            modalTitle.textContent = 'Editar Sala';
            document.getElementById('salaId').value = sala.id;
            document.getElementById('codigo').value = sala.codigo;
            document.getElementById('numero_sillas').value = sala.sillas;
        }
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    addSalaBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    salaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('salaId').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiBaseUrl}/${id}` : apiBaseUrl;

        const data = {
            codigo: document.getElementById('codigo').value,
            numero_sillas: parseInt(document.getElementById('numero_sillas').value, 10)
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error al guardar la sala');
            
            closeModal();
            fetchSalas();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    salasCardsContainer.addEventListener('click', async (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        const id = target.dataset.id;

        if (target.classList.contains('edit-btn')) {
            const salaData = {
                id: id,
                codigo: target.dataset.codigo,
                sillas: target.dataset.sillas
            };
            openModal('edit', salaData);
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
                try {
                    const response = await fetch(`${apiBaseUrl}/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);
                    fetchSalas();
                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            }
        }
    });

    fetchSalas();
});