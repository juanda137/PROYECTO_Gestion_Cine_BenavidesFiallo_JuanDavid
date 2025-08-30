import { fetchData } from './utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const usersCardsContainer = document.getElementById('usersCardsContainer');
    const modal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const closeModalBtn = document.querySelector('.close-button');
    const addUserBtn = document.getElementById('addUserBtn');
    const modalTitle = document.getElementById('modalTitle');
    const passwordInput = document.getElementById('password');
    const apiBaseUrl = '/api/users';

    async function fetchUsers() {
        try {
            const users = await fetchData(apiBaseUrl);
            usersCardsContainer.innerHTML = '';
            users.forEach(user => {
                const card = document.createElement('div');
                card.className = 'user-card';

                const isTestUser = user.email === 'prueba@acme.com';
                const deleteButtonHtml = isTestUser
                    ? `<button class="delete-btn" data-id="${user.id}" disabled title="No se puede eliminar al usuario de prueba"><i class="fas fa-trash"></i></button>`
                    : `<button class="delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i></button>`;

                card.innerHTML = `
                    <div class="card-body">
                        <h3 class="card-title">${user.nombre}</h3>
                        <div class="card-info-item">
                            <i class="fas fa-id-card"></i>
                            <span>${user.identificacion}</span>
                        </div>
                        <div class="card-info-item">
                            <i class="fas fa-envelope"></i>
                            <span>${user.email}</span>
                        </div>
                        <div class="card-info-item">
                            <i class="fas fa-briefcase"></i>
                            <span>${user.cargo}</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                            ${deleteButtonHtml}
                        </div>
                    </div>
                `;
                usersCardsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            alert(error.message);
        }
    }

    function openModal(mode, user = null) {
        userForm.reset();
        if (mode === 'add') {
            modalTitle.textContent = 'Añadir Nuevo Usuario';
            document.getElementById('userId').value = '';
            passwordInput.placeholder = 'Contraseña (obligatoria)';
            passwordInput.required = true;
        } else if (mode === 'edit' && user) {
            modalTitle.textContent = 'Editar Usuario';
            document.getElementById('userId').value = user._id;
            document.getElementById('identificacion').value = user.identificacion;
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('telefono').value = user.telefono;
            document.getElementById('email').value = user.email;
            document.getElementById('cargo').value = user.cargo;
            passwordInput.placeholder = 'Dejar en blanco para no cambiar';
            passwordInput.required = false;
        }
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    addUserBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    userForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('userId').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiBaseUrl}/${id}` : apiBaseUrl;
        
        const formData = new FormData(userForm);
        const data = Object.fromEntries(formData.entries());

        if (method === 'PUT' && !data.password) {
            delete data.password;
        }

        try {
            await fetchData(url, {
                method,
                body: JSON.stringify(data),
            });
            closeModal();
            fetchUsers();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            alert(error.message);
        }
    });
    
    usersCardsContainer.addEventListener('click', async (event) => {
        const target = event.target.closest('button');
        if (!target || target.disabled) return;
        const id = target.dataset.id;

        if (target.classList.contains('edit-btn')) {
            try {
                const user = await fetchData(`${apiBaseUrl}/${id}`);
                openModal('edit', user);
            } catch (error) {
                alert(error.message);
            }
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                try {
                    await fetchData(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
                    fetchUsers();
                } catch (error) {
                    alert(error.message);
                }
            }
        }
    });

    fetchUsers();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/pages/login.html';
    });
});