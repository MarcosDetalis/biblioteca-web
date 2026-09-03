import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useAuth } from "@/context/AuthContext";

/*
 * Antes cualquiera podía entrar a /reservas, /perfil, /carrito, etc.
 * escribiendo la URL directo, sin haber iniciado sesión. Esto envuelve
 * esas páginas y manda al login si no hay sesión activa.
 */
export default function PrivateRoute({ children }) {

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

PrivateRoute.propTypes = {
    children: PropTypes.node,
};
