import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/Login/Login";
import Home from "@/pages/Home/Home";

import Catalogo from "@/pages/Catalogo/Catalogo";
import Reservas from "@/pages/Reservas/Reservas";
import Perfil from "@/pages/Perfil/Perfil";
import DetalleLibro from "@/pages/DetalleLibro/DetalleLibro";
import CarritoReserva from "@/pages/CarritoReserva/CarritoReserva";
import DetalleReserva from "@/pages/DetalleReserva/DetalleReserva";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                
                <Route path="/catalogo" element={<Catalogo />}/>
                <Route path="/reservas" element={<Reservas />}/>
                <Route path="/perfil" element={<Perfil />}/>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/libro/:id" element={<DetalleLibro />}/>
                <Route path="/carrito"element={<CarritoReserva />}/>
                <Route path="/reservas/:id" element={ <DetalleReserva />}
/>
    
            </Routes>
        </BrowserRouter>
    );
}