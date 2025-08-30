import { fetchData } from './utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const filmCardsContainer = document.querySelector('.film-cards');

    async function loadRecentPeliculas() {
        try {
            const peliculas = await fetchData('/api/peliculas/recent');
            filmCardsContainer.innerHTML = '';

            if (peliculas.length === 0) {
                filmCardsContainer.innerHTML = '<p>No hay películas recientes para mostrar.</p>';
                return;
            }

            peliculas.forEach(pelicula => {
                const card = document.createElement('div');
                card.className = 'pelicula-card-small';
                card.innerHTML = `
                    <img src="${pelicula.poster}" alt="Póster de ${pelicula.titulo}">
                    <div class="pelicula-info">
                        <h4>${pelicula.titulo}</h4>
                        <span>${pelicula.genero}</span>
                    </div>
                `;
                filmCardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error al cargar películas recientes:', error);
            filmCardsContainer.innerHTML = '<p>No se pudieron cargar las películas.</p>';
        }
    }

    loadRecentPeliculas();

    const logoutBtn = document.querySelector('.sidebar-footer a');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authToken');
            window.location.href = '/pages/login.html';
        });
    }
});