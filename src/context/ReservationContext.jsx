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


const ReservationContext =
    createContext();


export function ReservationProvider({
    children,
}) {

    /*
     * ==========================================
     * RESERVAS
     * ==========================================
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


    /*
     * ==========================================
     * PERSISTENCIA LOCAL
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
         */

        const datosReserva = {

            /*
             * TEMPORAL
             *
             * Posteriormente vendrá
             * del usuario autenticado.
             */

            idUsuario: 1,

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

        };


        console.log(
            "Datos enviados al backend:",
            datosReserva
        );


        try {

            /*
             * ==================================
             * LLAMAR API
             * ==================================
             */

            const response =
                await fetch(
                    "https://backend-okn0.onrender.com/api/reservas",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                datosReserva
                            ),
                    }
                );


            /*
             * ==================================
             * LEER RESPUESTA
             * ==================================
             */

            const result =
                await response.json();


            console.log(
                "RESPUESTA API RESERVA:",
                result
            );


            /*
             * ==================================
             * ERROR HTTP
             * ==================================
             */

            if (!response.ok) {

                return {

                    success: false,

                    message:
                        result.message ||
                        "No se pudo crear la reserva.",

                };

            }


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


            console.log(
                "CODIGO QR RECIBIDO:",
                codigoQR
            );


            console.log(
                "NUMERO RESERVA:",
                numeroReserva
            );


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


            /*
             * ==================================
             * VALIDAR QR
             * ==================================
             */

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
                    "No se pudo conectar con el servidor.",

            };

        }

    };


    /*
     * ==========================================
     * CANCELAR RESERVA
     * ==========================================
     */

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


    /*
     * ==========================================
     * PROVIDER
     * ==========================================
     */

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

    children:
        PropTypes.node,

};


// eslint-disable-next-line react-refresh/only-export-components
export function useReservation() {

    return useContext(
        ReservationContext
    );

}