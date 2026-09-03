import axios from "axios";

/*
 * URL base de la API. En desarrollo local podés crear un archivo
 * .env con VITE_API_URL=http://localhost:3000/api; si no está
 * definida, se usa el backend ya publicado.
 */
const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://backend-okn0.onrender.com/api";

const apiClient = axios.create({
    baseURL: API_URL,
});

/*
 * Agrega automáticamente el token de sesión (si existe) a todos los
 * pedidos. Así ninguna pantalla tiene que acordarse de hacerlo a mano.
 */
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/*
 * Si el token venció o es inválido, el backend responde 401. Se limpia
 * la sesión local y se manda al login, para no dejar a la persona
 * viendo pantallas rotas con una sesión que ya no sirve.
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
