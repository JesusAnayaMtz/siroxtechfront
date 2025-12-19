import axios from 'axios';

// Instancia global de Axios configurada con la URL base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Opcional: Manejar 401 Unauthorized globalmente (ej. redirigir a login)
        // por ahora solo rechazamos el error para que lo maneje el servicio
        return Promise.reject(error);
    }
);

export default api;
