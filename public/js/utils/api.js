export async function fetchData(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/pages/login.html';
        throw new Error('No se encontró el token de autenticación.');
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Error en la petición a ${url}`);
    }
    
    return data;
}

export async function populateSelect(selectId, url, placeholder, valueField, textField) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;

    try {
        const data = await fetchData(url);
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(`Error al poblar el select ${selectId}:`, error);
    }
}