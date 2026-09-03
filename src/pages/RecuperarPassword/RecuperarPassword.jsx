import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Stack, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import Logo from "@/components/Logo/Logo";
import AppCard from "@/components/Card/AppCard";
import PageContainer from "@/components/Layout/PageContainer";
import TextInput from "@/components/Input/TextInput";
import PasswordField from "@/components/Input/PasswordField";
import LoginContainer from "@/components/Layout/LoginContainer";
import LoginImage from "@/components/Layout/LoginImage";
import LoadingButton from "@/components/Button/LoadingButton";

import {
    solicitarRecuperacionRequest,
    verificarCodigoRecuperacionRequest,
    restablecerPasswordRequest,
} from "@/api/usuarios.api";

/*
 * Recuperación de contraseña mediante verificación de identidad y
 * correo electrónico, en 3 pasos:
 *
 *  1) El usuario ingresa su cédula y su correo registrado. Si
 *     corresponden a una cuenta activa, se le envía un código de
 *     verificación de 6 dígitos a ese correo (vigente 10 minutos,
 *     máximo 3 intentos).
 *  2) El usuario ingresa el código recibido. Al validarlo, el
 *     backend entrega un token de un solo uso que habilita el
 *     siguiente paso.
 *  3) El usuario elige su nueva contraseña, que se guarda hasheada.
 *
 * El mensaje del paso 1 es siempre genérico (no confirma si la
 * cédula/correo pertenecen a una cuenta real), para no facilitar que
 * alguien enumere usuarios registrados.
 */
export default function RecuperarPassword() {

    const navigate = useNavigate();
    const [paso, setPaso] = useState(1);
    const [loading, setLoading] = useState(false);
    const [reenviando, setReenviando] = useState(false);
    const [identidad, setIdentidad] = useState({ cedula: "", correo: "" });
    const [resetToken, setResetToken] = useState(null);

    const formPaso1 = useForm({ mode: "onChange" });
    const formPaso2 = useForm({ mode: "onChange" });
    const formPaso3 = useForm({ mode: "onChange" });

    const onSubmitPaso1 = async (data) => {

        setLoading(true);

        try {

            await solicitarRecuperacionRequest({
                cedula: data.cedula,
                correo: data.correo,
            });

            setIdentidad({ cedula: data.cedula, correo: data.correo });
            setPaso(2);

            Swal.fire({
                icon: "success",
                title: "Código enviado",
                text: "Si los datos son correctos, te enviamos un código de verificación a tu correo. Revisá también la carpeta de spam.",
            });

        } catch (error) {

            const mensaje =
                error.response?.data?.message ||
                "No fue posible procesar la solicitud.";

            Swal.fire({
                icon: "error",
                title: "No se pudo enviar el código",
                text: mensaje,
            });

        } finally {

            setLoading(false);

        }

    };

    const reenviarCodigo = async () => {

        setReenviando(true);

        try {

            await solicitarRecuperacionRequest(identidad);

            Swal.fire({
                icon: "success",
                title: "Código reenviado",
                text: "Te enviamos un nuevo código a tu correo.",
            });

        } catch (error) {

            const mensaje =
                error.response?.data?.message ||
                "No fue posible reenviar el código.";

            Swal.fire({
                icon: "error",
                title: "No se pudo reenviar",
                text: mensaje,
            });

        } finally {

            setReenviando(false);

        }

    };

    const onSubmitPaso2 = async (data) => {

        setLoading(true);

        try {

            const respuesta = await verificarCodigoRecuperacionRequest({
                cedula: identidad.cedula,
                correo: identidad.correo,
                codigo: data.codigo,
            });

            setResetToken(respuesta.data.resetToken);
            setPaso(3);

        } catch (error) {

            const mensaje =
                error.response?.data?.message ||
                "No fue posible verificar el código.";

            Swal.fire({
                icon: "error",
                title: "Código incorrecto",
                text: mensaje,
            });

            // Si se agotaron los intentos o venció, hay que volver a
            // pedir un código nuevo desde cero.
            if (
                mensaje.toLowerCase().includes("agotaron") ||
                mensaje.toLowerCase().includes("vencido") ||
                mensaje.toLowerCase().includes("inválido")
            ) {
                formPaso2.reset();
                setPaso(1);
            }

        } finally {

            setLoading(false);

        }

    };

    const onSubmitPaso3 = async (data) => {

        if (data.passwordNueva !== data.confirmarPassword) {

            Swal.fire({
                icon: "warning",
                title: "Las contraseñas no coinciden",
            });

            return;

        }

        setLoading(true);

        try {

            await restablecerPasswordRequest({
                resetToken,
                passwordNueva: data.passwordNueva,
            });

            await Swal.fire({
                icon: "success",
                title: "Contraseña restablecida",
                text: "Ya podés iniciar sesión con tu contraseña nueva.",
            });

            navigate("/login");

        } catch (error) {

            const mensaje =
                error.response?.data?.message ||
                "No fue posible restablecer la contraseña.";

            Swal.fire({
                icon: "error",
                title: "No se pudo actualizar",
                text: mensaje,
            });

            // Si la verificación venció o ya fue usada, hay que volver
            // a empezar el flujo desde el paso 1.
            if (
                mensaje.toLowerCase().includes("venció") ||
                mensaje.toLowerCase().includes("utilizada")
            ) {
                setPaso(1);
                setResetToken(null);
                formPaso1.reset();
                formPaso2.reset();
            }

        } finally {

            setLoading(false);

        }

    };

    const submitPorPaso = {
        1: formPaso1.handleSubmit(onSubmitPaso1),
        2: formPaso2.handleSubmit(onSubmitPaso2),
        3: formPaso3.handleSubmit(onSubmitPaso3),
    };

    return (
        <PageContainer>
            <LoginContainer>
                <LoginImage />

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 5,
                    }}
                    component="form"
                    onSubmit={submitPorPaso[paso]}
                >
                    <AppCard
                        component={motion.div}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Stack spacing={3}>
                            <Logo />

                            {paso === 1 && (
                                <>
                                    <Typography
                                        variant="h6"
                                        textAlign="center"
                                    >
                                        Recuperar contraseña
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        textAlign="center"
                                    >
                                        Ingresá tu cédula y tu correo
                                        registrados. Si coinciden con una
                                        cuenta, te enviaremos un código de
                                        verificación por correo.
                                    </Typography>

                                    <TextInput
                                        label="Cédula"
                                        error={!!formPaso1.formState.errors.cedula}
                                        helperText={
                                            formPaso1.formState.errors.cedula
                                                ?.message
                                        }
                                        {...formPaso1.register("cedula", {
                                            required: "Ingresá tu cédula",
                                        })}
                                    />

                                    <TextInput
                                        label="Correo electrónico"
                                        error={!!formPaso1.formState.errors.correo}
                                        helperText={
                                            formPaso1.formState.errors.correo
                                                ?.message
                                        }
                                        {...formPaso1.register("correo", {
                                            required: "Ingresá tu correo",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Correo inválido",
                                            },
                                        })}
                                    />

                                    <LoadingButton
                                        loading={loading}
                                        type="submit"
                                    >
                                        Enviar código
                                    </LoadingButton>
                                </>
                            )}

                            {paso === 2 && (
                                <>
                                    <Typography
                                        variant="h6"
                                        textAlign="center"
                                    >
                                        Ingresá el código
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        textAlign="center"
                                    >
                                        Te enviamos un código de 6 dígitos a{" "}
                                        {identidad.correo}. Es válido durante
                                        10 minutos y tiene un máximo de 3
                                        intentos.
                                    </Typography>

                                    <TextInput
                                        label="Código de verificación"
                                        inputProps={{
                                            maxLength: 6,
                                            inputMode: "numeric",
                                            style: {
                                                letterSpacing: 8,
                                                textAlign: "center",
                                                fontSize: "1.4rem",
                                            },
                                        }}
                                        error={!!formPaso2.formState.errors.codigo}
                                        helperText={
                                            formPaso2.formState.errors.codigo
                                                ?.message
                                        }
                                        {...formPaso2.register("codigo", {
                                            required: "Ingresá el código",
                                            pattern: {
                                                value: /^[0-9]{6}$/,
                                                message:
                                                    "El código tiene 6 dígitos",
                                            },
                                        })}
                                    />

                                    <LoadingButton
                                        loading={loading}
                                        type="submit"
                                    >
                                        Verificar código
                                    </LoadingButton>

                                    <Typography
                                        textAlign="center"
                                        color="primary"
                                        sx={{
                                            cursor: reenviando
                                                ? "default"
                                                : "pointer",
                                            fontWeight: 500,
                                            opacity: reenviando ? 0.6 : 1,
                                        }}
                                        onClick={
                                            reenviando
                                                ? undefined
                                                : reenviarCodigo
                                        }
                                    >
                                        {reenviando
                                            ? "Reenviando..."
                                            : "Reenviar código"}
                                    </Typography>
                                </>
                            )}

                            {paso === 3 && (
                                <>
                                    <Typography
                                        variant="h6"
                                        textAlign="center"
                                    >
                                        Elegí tu nueva contraseña
                                    </Typography>

                                    <PasswordField
                                        label="Contraseña nueva"
                                        error={
                                            !!formPaso3.formState.errors
                                                .passwordNueva
                                        }
                                        helperText={
                                            formPaso3.formState.errors
                                                .passwordNueva?.message
                                        }
                                        {...formPaso3.register(
                                            "passwordNueva",
                                            {
                                                required:
                                                    "Ingresá una contraseña",
                                                minLength: {
                                                    value: 6,
                                                    message:
                                                        "Mínimo 6 caracteres",
                                                },
                                            }
                                        )}
                                    />

                                    <PasswordField
                                        label="Confirmar contraseña"
                                        error={
                                            !!formPaso3.formState.errors
                                                .confirmarPassword
                                        }
                                        helperText={
                                            formPaso3.formState.errors
                                                .confirmarPassword?.message
                                        }
                                        {...formPaso3.register(
                                            "confirmarPassword",
                                            {
                                                required:
                                                    "Repetí la contraseña",
                                            }
                                        )}
                                    />

                                    <LoadingButton
                                        loading={loading}
                                        type="submit"
                                    >
                                        Guardar nueva contraseña
                                    </LoadingButton>
                                </>
                            )}

                            <Typography
                                textAlign="center"
                                color="primary"
                                sx={{ cursor: "pointer", fontWeight: 500 }}
                                onClick={() => navigate("/login")}
                            >
                                Volver a iniciar sesión
                            </Typography>
                        </Stack>
                    </AppCard>
                </Box>
            </LoginContainer>
        </PageContainer>
    );
}
