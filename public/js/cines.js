document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = '/pages/login.html';
        return;
    }

    const cinesTableBody = document.getElementById('cinesTableBody');
    const modal = document.getElementById('cineModal');
    const modalTitle = document.getElementById('modalTitle');
    const cineForm = document.getElementById('cineForm');
    const addCineBtn = document.getElementById('addCineBtn');
    const closeModalBtn = document.querySelector('.close-button');

    const apiBaseUrl = '/api/cines';

    // Función para obtener y mostrar todos los cines
    async function fetchCines() {
        try {
            const response = await fetch(apiBaseUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al obtener los cines');

            const cines = await response.json();
            cinesTableBody.innerHTML = ''; // Limpiar la tabla antes de añadir nuevos datos
            cines.forEach(cine => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cine.codigo}</td>
                    <td>${cine.nombre}</td>
                    <td>${cine.direccion}</td>
                    <td>${cine.ciudad}</td>
                    <td class="action-buttons">
                        <button class="edit-btn" data-id="${cine._id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" data-id="${cine._id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                cinesTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Abrir el modal
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
            document.getElementById('codigo').disabled = true; // No permitir editar el código
            document.getElementById('nombre').value = cine.nombre;
            document.getElementById('direccion').value = cine.direccion;
            document.getElementById('ciudad').value = cine.ciudad;
        }
        modal.style.display = 'block';
    }

    // Cerrar el modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Event Listeners
    addCineBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Manejar el envío del formulario (Crear y Actualizar)
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
            if (!response.ok) {
                throw new Error(result.message || 'Error al guardar el cine');
            }

            closeModal();
            fetchCines(); // Recargar la lista de cines
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });
    
    // Manejar clicks en botones de editar y eliminar
    cinesTableBody.addEventListener('click', async (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        
        if (target.classList.contains('edit-btn')) {
            // Lógica para editar
            const response = await fetch(`${apiBaseUrl}?id=${id}`, { // Esta es una forma simple, idealmente se necesita un endpoint /api/cines/:id
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            const cines = await response.json();
            const cine = cines.find(c => c._id === id); // buscar el cine específico
            openModal('edit', cine);
        }

        if (target.classList.contains('delete-btn')) {
            // Lógica para eliminar
            if (confirm('¿Estás seguro de que quieres eliminar este cine?')) {
                try {
                    const response = await fetch(`${apiBaseUrl}/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message);

                    fetchCines(); // Recargar la lista
                } catch (error) {
                    console.error(error);
                    alert(error.message);
                }
            }
        }
    });

    // Carga inicial de datos
    fetchCines();

     // Logout
     document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/pages/login.html';
    });
});