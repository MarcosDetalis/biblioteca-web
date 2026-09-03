import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import {
    Typography,
    Box,
    Stack,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";
import Swal from "sweetalert2";

import DashboardLayout from "@/layouts/DashboardLayout";
import AppCard from "@/components/Card/AppCard";
import PasswordField from "@/components/Input/PasswordField";
import LoadingButton from "@/components/Button/LoadingButton";

import {
    obtenerPerfilRequest,
    cambiarPasswordRequest,
} from "@/api/usuarios.api";

export default function Perfil() {

    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {

        const cargarPerfil = async () => {

            try {

                setCargando(true);
                setError("");

                const respuesta = await obtenerPerfilRequest();

                setPerfil(respuesta.data);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                        "No fue posible cargar tu perfil."
                );

            } finally {

                setCargando(false);

            }

        };

        cargarPerfil();

    }, []);

    const onSubmitPassword = async (data) => {

        if (data.passwordNueva !== data.confirmarPassword) {

            Swal.fire({
                icon: "warning",
                title: "Las contraseñas no coinciden",
            });

            return;

        }

        setGuardando(true);

        try {

            await cambiarPasswordRequest({
                passwordActual: data.passwordActual,
                passwordNueva: data.passwordNueva,
            });

            await Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
            });

            reset();

        } catch (err) {

            Swal.fire({
                icon: "error",
                title: "No se pudo cambiar la contraseña",
                text:
                    err.response?.data?.message ||
                    "Intentá de nuevo.",
            });

        } finally {

            setGuardando(false);

        }

    };

    return (
        <DashboardLayout>
            <Typography variant="h4" fontWeight={700} mb={3}>
                Mi perfil
            </Typography>

            {cargando ? (
                <Box display="flex" justifyContent="center" mt={6}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Stack spacing={3} sx={{ maxWidth: 520 }}>

                    <AppCard>
                        <Stack spacing={1.5}>
                            <Typography variant="h6" fontWeight={600}>
                                Mis datos
                            </Typography>

                            <Dato
                                etiqueta="Nombre"
                                valor={`${perfil.nombres} ${perfil.apellidos}`}
                            />
                            <Dato etiqueta="Correo" valor={perfil.correo} />
                            <Dato etiqueta="Cédula" valor={perfil.cedula} />
                            <Dato
                                etiqueta="Teléfono"
                                valor={perfil.telefono || "-"}
                            />
                            <Dato
                                etiqueta="Tipo de usuario"
                                valor={perfil.tipoUsuario}
                            />
                            {perfil.carrera && (
                                <Dato
                                    etiqueta="Carrera"
                                    valor={perfil.carrera}
                                />
                            )}
                        </Stack>
                    </AppCard>

                    <AppCard
                        component="form"
                        onSubmit={handleSubmit(onSubmitPassword)}
                    >
                        <Stack spacing={2.5}>
                            <Typography variant="h6" fontWeight={600}>
                                Cambiar contraseña
                            </Typography>

                            <PasswordField
                                label="Contraseña actual"
                                error={!!errors.passwordActual}
                                helperText={
                                    errors.passwordActual?.message
                                }
                                {...register("passwordActual", {
                                    required: "Ingresá tu contraseña actual",
                                })}
                            />

                            <Divider />

                            <PasswordField
                                label="Contraseña nueva"
                                error={!!errors.passwordNueva}
                                helperText={
                                    errors.passwordNueva?.message
                                }
                                {...register("passwordNueva", {
                                    required: "Ingresá una contraseña nueva",
                                    minLength: {
                                        value: 6,
                                        message: "Mínimo 6 caracteres",
                                    },
                                })}
                            />

                            <PasswordField
                                label="Confirmar contraseña nueva"
                                error={!!errors.confirmarPassword}
                                helperText={
                                    errors.confirmarPassword?.message
                                }
                                {...register("confirmarPassword", {
                                    required: "Repetí la contraseña nueva",
                                })}
                            />

                            <LoadingButton
                                loading={guardando}
                                type="submit"
                            >
                                Guardar contraseña
                            </LoadingButton>
                        </Stack>
                    </AppCard>
                </Stack>
            )}
        </DashboardLayout>
    );
}

function Dato({ etiqueta, valor }) {
    return (
        <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">{etiqueta}</Typography>
            <Typography fontWeight={600}>{valor}</Typography>
        </Box>
    );
}

Dato.propTypes = {
    etiqueta: PropTypes.string,
    valor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
