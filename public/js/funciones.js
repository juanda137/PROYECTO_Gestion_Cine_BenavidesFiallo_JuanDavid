import { fetchData, populateSelect } from './utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const funcionesCardsContainer = document.getElementById('funcionesCardsContainer');
    const modal = document.getElementById('funcionModal');
    const addFuncionBtn = document.getElementById('addFuncionBtn');
    const closeModalBtn = document.querySelector('.close-button');
    const funcionForm = document.getElementById('funcionForm');
    const cineSelect = document.getElementById('cineSelect');
    const salaSelect = document.getElementById('salaSelect');

    const apiBaseUrl = '/api/funciones';

    async function fetchFunciones() {
        try {
            const funciones = await fetchData(apiBaseUrl);
            funcionesCardsContainer.innerHTML = '';

            funciones.forEach(funcion => {
                const card = document.createElement('div');
                card.className = 'funcion-card';
                const fecha = new Date(funcion.fecha_hora_inicio).toLocaleString('es-CO', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });

                card.innerHTML = `
                    <div class="card-header">
                        <i class="fas fa-film"></i>
                        <span>${funcion.pelicula.titulo}</span>
                    </div>
                    <div class="card-body">
                        <p><i class="fas fa-university"></i> Cine: ${funcion.cine.nombre}</p>
                        <p><i class="fas fa-couch"></i> Sala: ${funcion.sala.codigo}</p>
                        <p><i class="fas fa-calendar-alt"></i> Fecha: ${fecha.split(',')[0]}</p>
                        <p><i class="fas fa-clock"></i> Hora: ${fecha.split(',')[1].trim()}</p>
                    </div>
                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="delete-btn" data-id="${funcion._id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                funcionesCardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error al obtener funciones:', error);
            alert(error.message);
        }
    }

    function openModal() {
        funcionForm.reset();
        salaSelect.innerHTML = '<option value="" disabled selected>Seleccione un cine primero</option>';
        salaSelect.disabled = true;
        
        populateSelect('cineSelect', '/api/cines', 'Seleccione un cine', '_id', 'nombre');
        populateSelect('peliculaSelect', '/api/peliculas', 'Seleccione una película', '_id', 'titulo');
        
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    cineSelect.addEventListener('change', async (event) => {
        const cineId = event.target.value;
        if (cineId) {
            salaSelect.disabled = false;
            await populateSelect('salaSelect', `/api/cines/${cineId}/salas`, 'Seleccione una sala', '_id', 'codigo');
        } else {
            salaSelect.disabled = true;
            salaSelect.innerHTML = '<option value="" disabled selected>Seleccione un cine primero</option>';
        }
    });

    addFuncionBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    funcionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(funcionForm);
        const data = Object.fromEntries(formData.entries());
        
        try {
            await fetchData(apiBaseUrl, {
                method: 'POST',
                body: JSON.stringify(data),
            });
            closeModal();
            fetchFunciones();
        } catch (error) {
            console.error('Error al crear función:', error);
            alert(error.message);
        }
    });

    funcionesCardsContainer.addEventListener('click', async (event) => {
        const target = event.target.closest('button.delete-btn');
        if (target) {
            const id = target.dataset.id;
            if (confirm('¿Estás seguro de que quieres eliminar esta función?')) {
                try {
                    await fetchData(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
                    fetchFunciones();
                } catch (error) {
                    console.error('Error al eliminar función:', error);
                    alert(error.message);
                }
            }
        }
    });
    
    fetchFunciones();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/pages/login.html';
    });
});