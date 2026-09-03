import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    /*
     * login(usuario, token): se llama DESPUÉS de que el backend ya
     * confirmó las credenciales (ver pages/Login/Login.jsx). Guarda el
     * token por separado, porque es lo que apiClient (src/api/client.js)
     * lee para autenticar cada pedido.
     */
    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        if (token) {
            localStorage.setItem("token", token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
AuthProvider.propTypes = {
    children: PropTypes.node

};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () =>
    useContext(AuthContext);
