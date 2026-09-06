import apiClient from "./client";

export async function crearReservaRequest({ libros, fechaRetiro, horaRetiro, fechaDevolucion, horaDevolucion }) {
    const { data } = await apiClient.post("/reservas", {
        libros,
        fechaRetiro,
        horaRetiro,
        fechaDevolucion,
        horaDevolucion,
    });
    return data;
}

export async function obtenerReservasRequest() {
    const { data } = await apiClient.get("/reservas");
    return data;
}

export async function verificarDisponibilidadHorarioRequest({ libros, fechaRetiro, horaRetiro, fechaDevolucion, horaDevolucion }) {
    const { data } = await apiClient.post("/reservas/verificar-horario", {
        libros,
        fechaRetiro,
        horaRetiro,
        fechaDevolucion,
        horaDevolucion,
    });
    return data;
}

export async function obtenerReservaPorIdRequest(id) {
    const { data } = await apiClient.get(`/reservas/${id}`);
    return data;
}

export async function cancelarReservaRequest(id) {
    const { data } = await apiClient.patch(`/reservas/${id}/cancelar`);
    return data;
}
