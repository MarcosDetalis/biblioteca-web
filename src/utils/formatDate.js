/**
 * Formatea una fecha "YYYY-MM-DD" (como llega ahora del backend) a
 * "DD/MM/YYYY" para mostrar en pantalla. Tolerante: si viene vacía,
 * ya en otro formato, o como un ISO completo con hora, igual intenta
 * mostrar algo razonable en vez de romper.
 */
export function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }

    // "2026-09-04" o "2026-09-04T00:00:00.000Z" -> nos quedamos con
    // la parte de la fecha únicamente.
    const soloFecha =
        String(fecha).split("T")[0];

    const partes =
        soloFecha.split("-");

    if (partes.length !== 3) {
        return soloFecha;
    }

    const [año, mes, dia] = partes;

    return `${dia}/${mes}/${año}`;

}
