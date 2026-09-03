import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

import PropTypes from "prop-types";


const ReservationCartContext =
    createContext();


export function ReservationCartProvider({
    children,
}) {

    const [
        cart,
        setCart
    ] = useState(() => {

        const saved =
            localStorage.getItem(
                "reservationCart"
            );

        return saved
            ? JSON.parse(saved)
            : [];

    });


    /*
     * GUARDAR CARRITO
     */

    useEffect(() => {

        localStorage.setItem(
            "reservationCart",
            JSON.stringify(cart)
        );

    }, [cart]);


    /*
     * AGREGAR LIBRO
     */

    const addBook = (book) => {

        const exists =
            cart.some(
                (item) =>
                    item.id === book.id
            );


        if (exists) {

            return {
                success: false,
                message:
                    "Este libro ya está en tu reserva.",
                severity: "warning",
            };

        }


        /*
         * El máximo ya NO se basa en el stock
         * disponible ahora mismo (eso se resuelve
         * recién en el momento del retiro): se basa
         * en el total de ejemplares que ese libro
         * tiene registrados, sea cual sea su estado
         * actual. Así se puede reservar aunque en
         * este momento estén todos prestados.
         */

        const totalEjemplares =
            Number(book.totalEjemplares) || 0;


        const maxReserva =
            book.maxReserva != null
                ? Number(book.maxReserva)
                : totalEjemplares;


        const maxCantidad =
            Math.min(
                totalEjemplares,
                maxReserva
            );


        if (maxCantidad <= 0) {

            return {
                success: false,
                message:
                    "Este libro no tiene ejemplares registrados en el sistema.",
                severity: "error",
            };

        }


        setCart((prev) => [

            ...prev,

            {
                ...book,

                cantidad: 1,

                /*
                 * Guardamos el máximo
                 * efectivo permitido.
                 */

                maxReserva:
                    maxCantidad,
            },

        ]);


        return {

            success: true,

            message:
                "Libro agregado a la reserva.",

            severity:
                "success",

        };

    };


    /*
     * ELIMINAR LIBRO
     */

    const removeBook = (id) => {

        setCart((prev) =>
            prev.filter(
                (book) =>
                    book.id !== id
            )
        );

    };


    /*
     * VACIAR CARRITO
     */

    const clearCart = () => {

        setCart([]);

    };


    /*
     * ACTUALIZAR CANTIDAD
     */

    const updateQuantity = (
        id,
        cantidad
    ) => {

        setCart((prev) =>

            prev.map((book) => {

                if (
                    book.id !== id
                ) {

                    return book;

                }


                const totalEjemplares =
                    Number(book.totalEjemplares) || 0;


                const maxReserva =
                    book.maxReserva != null
                        ? Number(
                            book.maxReserva
                        )
                        : totalEjemplares;


                const maxCantidad =
                    Math.min(
                        totalEjemplares,
                        maxReserva
                    );


                const nuevaCantidad =
                    Math.max(
                        1,
                        Math.min(
                            Number(cantidad),
                            maxCantidad
                        )
                    );


                return {

                    ...book,

                    cantidad:
                        nuevaCantidad,

                };

            })

        );

    };


    return (

        <ReservationCartContext.Provider
            value={{
                cart,
                addBook,
                removeBook,
                clearCart,
                updateQuantity
            }}
        >

            {children}

        </ReservationCartContext.Provider>

    );

}


ReservationCartProvider.propTypes = {
    children: PropTypes.node
};


// eslint-disable-next-line react-refresh/only-export-components
export function useReservationCart() {

    return useContext(
        ReservationCartContext
    );

}