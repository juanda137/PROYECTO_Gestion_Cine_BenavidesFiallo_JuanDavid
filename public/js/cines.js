document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/pages/login.html';
        return;
    }

    const cinesCardsContainer = document.getElementById('cinesCardsContainer');
    const modal = document.getElementById('cineModal');
    const modalTitle = document.getElementById('modalTitle');
    const cineForm = document.getElementById('cineForm');
    const addCineBtn = document.getElementById('addCineBtn');
    const closeModalBtn = document.querySelector('.close-button');

    const apiBaseUrl = '/api/cines';

    async function fetchCines() {
        try {
            const response = await fetch(apiBaseUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener los cines');

            const cines = await response.json();
            cinesCardsContainer.innerHTML = '';
            cines.forEach(cine => {
                const card = document.createElement('div');
                card.className = 'cine-card';
                card.innerHTML = `
                    <div class="card-body">
                        <h3 class="card-title">
                            ${cine.nombre}
                            <span class="codigo">${cine.codigo}</span>
                        </h3>
                        <div class="card-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${cine.direccion}</span>
                        </div>
                        <div class="card-info-item">
                            <i class="fas fa-city"></i>
                            <span>${cine.ciudad}</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="salas.html?cineId=${cine._id}&cineNombre=${encodeURIComponent(cine.nombre)}" class="btn-salas">Ver Salas</a>
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${cine._id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${cine._id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                cinesCardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    function openModal(mode, cine = null) {
        cineForm.reset();
        if (mode === 'add') {
            modalTitle.textContent = 'Añadir Nuevo Cine';
            document.getElementById('cineId').value = '';
            document.getElementById('codigo').disabled = false;
        } else if (mode === 'edit' && cine) {
            modalTitle.textContent = 'Editar Cine';
            document.getElementById('cineId').value = cine._id;
            document.getElementById('codigo').value = cine.codigo;
            document.getElementById('codigo').disabled = true;
            document.getElementById('nombre').value = cine.nombre;
            document.getElementById('direccion').value = cine.direccion;
            document.getElementById('ciudad').value = cine.ciudad;
        }
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    addCineBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    cineForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('cineId').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiBaseUrl}/${id}` : apiBaseUrl;

        const formData = new FormData(cineForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error al guardar el cine');
            
            closeModal();
            fetchCines();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });
    
    cinesCardsContainer.addEventListener('click', async (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const card = target.closest('.cine-card');
        const cineId = target.dataset.id;
        
        if (target.classList.contains('edit-btn')) {
            try {
                const response = await fetch(`${apiBaseUrl}/${cineId}`, { 
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('No se pudo obtener la información del cine.');
                const cine = await response.json();
                openModal('edit', cine);
            } catch (error) {
                 alert(error.message);
                 console.error(error);
            }
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este cine?')) {
                try {
                    const response = await fetch(`${apiBaseUrl}/${cineId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);
                    fetchCines();
                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            }
        }
    });

    fetchCines();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/pages/login.html';
    });
});