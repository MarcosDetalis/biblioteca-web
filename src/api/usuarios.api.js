import apiClient from "./client";

export async function loginRequest({ identificador, password }) {
    const { data } = await apiClient.post("/usuarios/login", {
        identificador,
        password,
    });
    return data;
}

export async function obtenerPerfilRequest() {
    const { data } = await apiClient.get("/usuarios/perfil");
    return data;
}

export async function cambiarPasswordRequest({
    passwordActual,
    passwordNueva,
}) {
    const { data } = await apiClient.post("/usuarios/cambiar-password", {
        passwordActual,
        passwordNueva,
    });
    return data;
}

export async function solicitarRecuperacionRequest({ cedula, correo }) {
    const { data } = await apiClient.post("/usuarios/recuperar/solicitar", {
        cedula,
        correo,
    });
    return data;
}

export async function verificarCodigoRecuperacionRequest({
    cedula,
    correo,
    codigo,
}) {
    const { data } = await apiClient.post("/usuarios/recuperar/verificar", {
        cedula,
        correo,
        codigo,
    });
    return data;
}

export async function restablecerPasswordRequest({
    resetToken,
    passwordNueva,
}) {
    const { data } = await apiClient.post(
        "/usuarios/recuperar/restablecer",
        { resetToken, passwordNueva }
    );
    return data;
}
