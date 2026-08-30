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


        const stock =
            Number(book.stock) || 0;


        /*
         * Si maxReserva existe,
         * utilizamos ese valor.
         *
         * Si todavía no viene de la API,
         * utilizamos el stock.
         */

        const maxReserva =
            book.maxReserva != null
                ? Number(book.maxReserva)
                : stock;


        const maxCantidad =
            Math.min(
                stock,
                maxReserva
            );


        if (maxCantidad <= 0) {

            return {
                success: false,
                message:
                    "Este libro no tiene ejemplares disponibles.",
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


                const stock =
                    Number(book.stock) || 0;


                const maxReserva =
                    book.maxReserva != null
                        ? Number(
                            book.maxReserva
                        )
                        : stock;


                const maxCantidad =
                    Math.min(
                        stock,
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