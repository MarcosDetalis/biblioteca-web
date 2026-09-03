export const MAX_RESERVAS_ACTIVAS = 3;

export const ESTADOS_RESERVA = {
  ACTIVA: "ACTIVA",
  CANCELADA: "CANCELADA",
  RETIRADA: "RETIRADA",
  VENCIDA: "VENCIDA",
};

export function obtenerMaximaCantidad(book) {
  const totalEjemplares = Number(book.totalEjemplares) || 0;
  const maxReserva = Number(book.maxReserva) || 0;

  return Math.min(totalEjemplares, maxReserva);
}

export function validarCantidad(book, cantidad) {
  const maximo =
    obtenerMaximaCantidad(book);

  if (cantidad < 1) {
    return {
      valido: false,
      mensaje:
        "La cantidad debe ser mayor a cero.",
    };
  }

  if (cantidad > maximo) {
    return {
      valido: false,
      mensaje:
        `La cantidad máxima disponible para "${book.titulo}" es ${maximo}.`,
    };
  }

  return {
    valido: true,
    mensaje: "",
  };
}

export function esFinDeSemana(fecha) {
  if (!fecha) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] = fecha
    .split("-")
    .map(Number);

  const fechaLocal = new Date(
    year,
    month - 1,
    day
  );

  const dia = fechaLocal.getDay();

  return dia === 0 || dia === 6;
}

export function esFechaPasada(fecha) {
  if (!fecha) {
    return false;
  }

  const [
    year,
    month,
    day,
  ] = fecha
    .split("-")
    .map(Number);

  const seleccionada = new Date(
    year,
    month - 1,
    day
  );

  seleccionada.setHours(
    0,
    0,
    0,
    0
  );

  const hoy = new Date();

  hoy.setHours(
    0,
    0,
    0,
    0
  );

  return seleccionada < hoy;
}

export function validarFechaRetiro(fecha) {
  if (!fecha) {
    return {
      valido: false,
      mensaje:
        "Selecciona una fecha de retiro.",
    };
  }

  if (esFechaPasada(fecha)) {
    return {
      valido: false,
      mensaje:
        "No puedes seleccionar una fecha pasada.",
    };
  }

  if (esFinDeSemana(fecha)) {
    return {
      valido: false,
      mensaje:
        "La biblioteca no realiza entregas los fines de semana.",
    };
  }

  return {
    valido: true,
    mensaje: "",
  };
}