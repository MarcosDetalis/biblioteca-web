import {createContext,useContext,useState,useEffect} from "react";
import PropTypes from "prop-types";
const ReservationCartContext =
  createContext();

export function ReservationCartProvider({
  children,
}) {
  const [cart, setCart] =
  useState(() => {

    const saved =
      localStorage.getItem(
        "reservationCart"
      );

    return saved
      ? JSON.parse(saved)
      : [];
});


useEffect(() => {
  localStorage.setItem(
    "reservationCart",
    JSON.stringify(
      cart
    )
  );
}, [cart]);


const addBook = (book) => {
  const exists = cart.some(
    (item) => item.id === book.id
  );

  if (exists) {
    return {
      success: false,
      message:
        "Este libro ya está en tu reserva.",
      severity: "warning",
    };
  }

  const maxCantidad = Math.min(
    Number(book.stock) || 0,
    Number(book.maxReserva) || 0
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
    },
  ]);

  return {
    success: true,
    message:
      "Libro agregado a la reserva.",
    severity: "success",
  };
};

  const removeBook = (id) => {
    setCart((prev) =>
      prev.filter(
        (b) => b.id !== id
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };



const updateQuantity = (
  id,
  cantidad
) => {

  setCart((prev) =>
    prev.map((book) => {

      if (book.id !== id) {
        return book;
      }

      const maxCantidad =
        Math.min(
          Number(book.stock) || 0,
          Number(book.maxReserva) || 0
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
        cantidad: nuevaCantidad,
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