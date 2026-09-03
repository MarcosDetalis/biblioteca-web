import {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";

import PropTypes from "prop-types";

import {
    MAX_RESERVAS_ACTIVAS,
} from "@/utils/reservationRules";

import {
    crearReservaRequest,
    obtenerReservasRequest,
    cancelarReservaRequest,
} from "@/api/reservas.api";

import { useAuth } from "@/context/AuthContext";


const ReservationContext =
    createContext();


export function ReservationProvider({
    children,
}) {

    const { isAuthenticated } = useAuth();

    /*
     * ==========================================
     * RESERVAS
     * ==========================================
     * Ya no se guardan solo en localStorage: se traen del backend
     * (que es lo que realmente sabe qué reservó cada usuario). El
     * localStorage queda como respaldo mientras carga, para que la
     * pantalla no aparezca vacía un instante al entrar.
     */

    const [
        reservations,
        setReservations,
    ] = useState(() => {

        try {

            const saved =
                localStorage.getItem(
                    "reservations"
                );

            return saved
                ? JSON.parse(saved)
                : [];

        } catch (error) {

            console.error(
                "Error leyendo reservas:",
                error
            );

            return [];

        }

    });

    const [loadingReservations, setLoadingReservations] = useState(false);


    /*
     * ==========================================
     * CARGAR RESERVAS REALES AL INICIAR SESIÓN
     * ==========================================
     */

    useEffect(() => {

        if (!isAuthenticated) {
            return;
        }

        const cargarReservas = async () => {

            try {

                setLoadingReservations(true);

                const respuesta = await obtenerReservasRequest();

                setReservations(
                    Array.isArray(respuesta.data)
                        ? respuesta.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error cargando reservas:",
                    error
                );

            } finally {

                setLoadingReservations(false);

            }

        };

        cargarReservas();

    }, [isAuthenticated]);


    /*
     * ==========================================
     * PERSISTENCIA LOCAL (respaldo, no la fuente de verdad)
     * ==========================================
     */

    useEffect(() => {

        localStorage.setItem(
            "reservations",
            JSON.stringify(
                reservations
            )
        );

    }, [reservations]);


    /*
     * ==========================================
     * CREAR RESERVA
     * ==========================================
     */

    const createReservation = async ({
        libros,
        fechaRetiro,
        horaRetiro,
        fechaDevolucion,
        horaDevolucion,
    }) => {

        /*
         * ======================================
         * VALIDAR LIBROS
         * ======================================
         */

        if (
            !libros ||
            libros.length === 0
        ) {

            return {
                success: false,
                message:
                    "No hay libros en la reserva.",
            };

        }


        /*
         * ======================================
         * VALIDAR RESERVAS ACTIVAS
         * ======================================
         */

        const reservasActivas =
            reservations.filter(
                (reservation) =>
                    reservation.estado ===
                    "ACTIVA"
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


        /*
         * ======================================
         * TOTAL EJEMPLARES
         * ======================================
         */

        const totalEjemplares =
            libros.reduce(
                (total, book) =>
                    total +
                    Number(
                        book.cantidad || 0
                    ),
                0
            );


        /*
         * ======================================
         * DATOS PARA BACKEND
         * ======================================
         * El usuario ya NO se manda acá: el backend lo saca del token
         * de sesión (ver src/api/client.js), así nadie puede reservar
         * "en nombre de" otra persona con solo cambiar un número.
         */

        const datosReserva = {

            libros:
                libros.map(
                    (book) => ({

                        id:
                            Number(
                                book.id
                            ),

                        cantidad:
                            Number(
                                book.cantidad || 1
                            ),

                        titulo:
                            book.titulo,

                        autor:
                            book.autor,

                    })
                ),

            fechaRetiro,

            horaRetiro,

            fechaDevolucion,

            horaDevolucion,

        };


        try {

            /*
             * ==================================
             * LLAMAR API
             * ==================================
             */

            const result =
                await crearReservaRequest(
                    datosReserva
                );


            /*
             * ==================================
             * OBTENER RESERVA
             * ==================================
             */

            const reservationApi =
                result?.data?.reservation;


            if (!reservationApi) {

                console.error(
                    "Respuesta inesperada del servidor:",
                    result
                );

                return {

                    success: false,

                    message:
                        "El servidor no devolvió los datos de la reserva.",

                };

            }


            /*
             * ==================================
             * NORMALIZAR DATOS
             * ==================================
             *
             * Aceptamos tanto:
             *
             * codigoQR
             *
             * como:
             *
             * codigo_qr
             *
             */

            const codigoQR =
                reservationApi.codigoQR ??
                reservationApi.codigo_qr ??
                reservationApi.qr ??
                reservationApi.qrCode ??
                null;


            /*
             * Número de reserva
             */

            const numeroReserva =
                reservationApi.numeroReserva ??
                reservationApi.numero_reserva ??
                null;


            /*
             * ==================================
             * RESERVA COMPLETA
             * ==================================
             */

            const reservationCompleta = {

                ...reservationApi,

                /*
                 * Normalizamos el ID
                 */

                id:
                    reservationApi.id ??
                    reservationApi.id_reserva,

                /*
                 * Número de reserva
                 */

                numeroReserva,

                /*
                 * QR
                 */

                codigoQR,

                /*
                 * Libros
                 */

                libros:
                    reservationApi.libros ??
                    libros,

                /*
                 * Total
                 */

                totalEjemplares:
                    reservationApi.totalEjemplares ??
                    reservationApi.total_ejemplares ??
                    totalEjemplares,

                /*
                 * Estado
                 */

                estado:
                    reservationApi.estado ??
                    "ACTIVA",

            };


            if (!codigoQR) {

                console.warn(
                    "La reserva fue creada pero el backend NO devolvió codigoQR.",
                    reservationApi
                );

            }


            /*
             * ==================================
             * GUARDAR CONTEXT
             * ==================================
             */

            setReservations(
                (prev) => [
                    ...prev,
                    reservationCompleta,
                ]
            );


            /*
             * ==================================
             * RESULTADO
             * ==================================
             */

            return {

                success: true,

                reservation:
                    reservationCompleta,

                message:
                    result.message ||
                    "Reserva creada correctamente.",

            };


        } catch (error) {

            console.error(
                "Error creando reserva:",
                error
            );


            return {

                success: false,

                message:
                    error.response?.data?.message ||
                    "No se pudo conectar con el servidor.",

            };

        }

    };


    /*
     * ==========================================
     * CANCELAR RESERVA
     * ==========================================
     * Antes esto SOLO cambiaba el estado en el navegador, sin avisarle
     * nada al backend: la reserva seguía "activa" ahí, ocupando el
     * ejemplar, aunque en pantalla apareciera cancelada. Ahora llama a
     * la API real y solo actualiza el estado local si el backend
     * confirmó la cancelación.
     */

    const cancelReservation =
        async (id) => {

            try {

                const respuesta =
                    await cancelarReservaRequest(id);

                setReservations(
                    (prev) =>
                        prev.map(
                            (reservation) =>
                                reservation.id === id
                                    ? {
                                        ...reservation,

                                        estado:
                                            respuesta.data?.estado ||
                                            "CANCELADA",
                                    }
                                    : reservation
                        )
                );

                return {
                    success: true,
                    message:
                        respuesta.message ||
                        "Reserva cancelada.",
                };

            } catch (error) {

                console.error(
                    "Error cancelando reserva:",
                    error
                );

                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        "No se pudo cancelar la reserva.",
                };

            }

        };


    /*
     * ==========================================
     * PROVIDER
     * ==========================================
     */

    return (

        <ReservationContext.Provider
            value={{
                reservations,
                loadingReservations,
                createReservation,
                cancelReservation,
            }}
        >

            {children}

        </ReservationContext.Provider>

    );

}


ReservationProvider.propTypes = {

    children:
        PropTypes.node,

};


// eslint-disable-next-line react-refresh/only-export-components
export function useReservation() {

    return useContext(
        ReservationContext
    );

}
