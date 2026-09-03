import apiClient from "./client";

export async function obtenerLibrosRequest() {
    const { data } = await apiClient.get("/libros");
    return data;
}

export async function obtenerLibroPorIdRequest(id) {
    const { data } = await apiClient.get(`/libros/${id}`);
    return data;
}

export async function obtenerCategoriasRequest() {
    const { data } = await apiClient.get("/libros/categorias");
    return data;
}
