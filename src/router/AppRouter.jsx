import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/Login/Login";
import RecuperarPassword from "@/pages/RecuperarPassword/RecuperarPassword";
import Home from "@/pages/Home/Home";

import Catalogo from "@/pages/Catalogo/Catalogo";
import Reservas from "@/pages/Reservas/Reservas";
import Perfil from "@/pages/Perfil/Perfil";
import DetalleLibro from "@/pages/DetalleLibro/DetalleLibro";
import CarritoReserva from "@/pages/CarritoReserva/CarritoReserva";
import DetalleReserva from "@/pages/DetalleReserva/DetalleReserva";

import PrivateRoute from "@/router/PrivateRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/recuperar-password"
                    element={<RecuperarPassword />}
                />

                {/* Todo lo que sigue requiere haber iniciado sesión */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/catalogo"
                    element={
                        <PrivateRoute>
                            <Catalogo />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reservas"
                    element={
                        <PrivateRoute>
                            <Reservas />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/perfil"
                    element={
                        <PrivateRoute>
                            <Perfil />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/libro/:id"
                    element={
                        <PrivateRoute>
                            <DetalleLibro />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/carrito"
                    element={
                        <PrivateRoute>
                            <CarritoReserva />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reservas/:id"
                    element={
                        <PrivateRoute>
                            <DetalleReserva />
                        </PrivateRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}
