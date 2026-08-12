import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
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