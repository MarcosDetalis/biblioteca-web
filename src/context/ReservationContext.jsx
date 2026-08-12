import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import PropTypes from "prop-types";

import {MAX_RESERVAS_ACTIVAS,} from "@/utils/reservationRules";

const ReservationContext =
  createContext();

export function ReservationProvider({
  children,
}) {
 
  const [
  reservations,
  setReservations,
] = useState(() => {
  const saved =
    localStorage.getItem(
      "reservations"
    );

  return saved
    ? JSON.parse(saved)
    : [];
});

useEffect(() => {
  localStorage.setItem(
    "reservations",
    JSON.stringify(
      reservations
    )
  );
}, [reservations]);



 const createReservation = ({
  libros,
  fechaRetiro,
  horaRetiro,
}) => {

  const reservasActivas =
    reservations.filter(
      (reservation) =>
        reservation.estado === "ACTIVA"
    );

  if (
    reservasActivas.length >=
    MAX_RESERVAS_ACTIVAS
  ) {
    return {
      success: false,
      message:
        `Has alcanzado el máximo de ${MAX_RESERVAS_ACTIVAS} reservas activas.`,
    };
  }

  if (!libros || libros.length === 0) {
    return {
      success: false,
      message:
        "No hay libros en la reserva.",
    };
  }

  const totalEjemplares =
    libros.reduce(
      (total, book) =>
        total + Number(book.cantidad || 0),
      0
    );

  const reservation = {
    id: crypto.randomUUID(),

    libros,

    fechaRetiro,

    horaRetiro,

    totalEjemplares,

    fechaCreacion:
      new Date().toISOString(),

    estado: "ACTIVA",
  };

  setReservations(
    (prev) => [
      ...prev,
      reservation,
    ]
  );

  return {
    success: true,
    reservation,
    message:
      "Reserva creada correctamente.",
  };
};

  const cancelReservation =
    (id) => {

      setReservations(
        (prev) =>
          prev.map(
            (reservation) =>
              reservation.id === id
                ? {
                    ...reservation,
                    estado:
                      "CANCELADA",
                  }
                : reservation
          )
      );
    };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        createReservation,
        cancelReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

ReservationProvider.propTypes = {
  children: PropTypes.node,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useReservation() {
  return useContext(
    ReservationContext
  );
}