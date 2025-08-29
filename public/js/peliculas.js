document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/pages/login.html';
        return;
    }

    const peliculasCardsContainer = document.getElementById('peliculasCardsContainer');
    const modal = document.getElementById('peliculaModal');
    const modalTitle = document.getElementById('modalTitle');
    const peliculaForm = document.getElementById('peliculaForm');
    const addPeliculaBtn = document.getElementById('addPeliculaBtn');
    const closeModalBtn = document.querySelector('.close-button');

    const apiBaseUrl = '/api/peliculas';

    async function fetchPeliculas() {
        try {
            const response = await fetch(apiBaseUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener las películas');

            const peliculas = await response.json();
            peliculasCardsContainer.innerHTML = '';
            peliculas.forEach(pelicula => {
                const card = document.createElement('div');
                card.className = 'pelicula-card';
                card.innerHTML = `
                    <div class="card-poster">
                        <img src="${pelicula.poster}" alt="Póster de ${pelicula.titulo}">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${pelicula.titulo}</h3>
                        <span class="card-genre">${pelicula.genero}</span>
                    </div>
                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${pelicula._id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" data-id="${pelicula._id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                peliculasCardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    function openModal(mode, pelicula = null) {
        peliculaForm.reset();
        if (mode === 'add') {
            modalTitle.textContent = 'Añadir Nueva Película';
            document.getElementById('peliculaId').value = '';
            document.getElementById('codigo').disabled = false;
        } else if (mode === 'edit' && pelicula) {
            modalTitle.textContent = 'Editar Película';
            document.getElementById('peliculaId').value = pelicula._id;
            
            document.getElementById('codigo').value = pelicula.codigo;
            document.getElementById('codigo').disabled = true;
            document.getElementById('titulo').value = pelicula.titulo;
            document.getElementById('sinopsis').value = pelicula.sinopsis;
            document.getElementById('reparto').value = pelicula.reparto;
            document.getElementById('director').value = pelicula.director;
            document.getElementById('duracion').value = pelicula.duracion;
            document.getElementById('genero').value = pelicula.genero;
            document.getElementById('clasificacion').value = pelicula.clasificacion;
            document.getElementById('idioma').value = pelicula.idioma;
            document.getElementById('fecha_estreno').value = new Date(pelicula.fecha_estreno).toISOString().split('T')[0];
            document.getElementById('poster').value = pelicula.poster;
            document.getElementById('trailer').value = pelicula.trailer;
        }
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    addPeliculaBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    peliculaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('peliculaId').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiBaseUrl}/${id}` : apiBaseUrl;

        const formData = new FormData(peliculaForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error al guardar la película');
            
            closeModal();
            fetchPeliculas();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    peliculasCardsContainer.addEventListener('click', async (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        const id = target.dataset.id;

        if (target.classList.contains('edit-btn')) {
            try {
                const response = await fetch(`${apiBaseUrl}/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('No se pudo obtener la información de la película.');
                const pelicula = await response.json();
                openModal('edit', pelicula);
            } catch (error) {
                 alert(error.message);
            }
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
                try {
                    const response = await fetch(`${apiBaseUrl}/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);
                    fetchPeliculas();
                } catch (error) {
                    alert(error.message);
                }
            }
        }
    });

    fetchPeliculas();

     document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/pages/login.html';
    });
});