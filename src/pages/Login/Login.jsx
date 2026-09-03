import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/Logo/Logo";
import AppCard from "@/components/Card/AppCard";
import PageContainer from "@/components/Layout/PageContainer";
import TextInput from "@/components/Input/TextInput";
import PasswordField from "@/components/Input/PasswordField";

import LoginContainer from "@/components/Layout/LoginContainer";
import LoginImage from "@/components/Layout/LoginImage";
import { Box } from "@mui/material";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { motion } from "framer-motion";
import Swal from "sweetalert2";

import LoadingButton from "@/components/Button/LoadingButton";
import { useAuth } from "@/context/AuthContext";
import { loginRequest } from "@/api/usuarios.api";

export default function Login() {

const navigate = useNavigate();

const [loading, setLoading] = useState(false);

const { login } = useAuth();
const {
    register,
    handleSubmit,
    formState: { errors },
} = useForm({
mode: "onChange",
});

const onSubmit = async (data) => {

    setLoading(true);

    try {

        // El backend acepta correo o cédula en el mismo campo.
        const respuesta = await loginRequest({
            identificador: data.email,
            password: data.password,
        });

        login(respuesta.data.usuario, respuesta.data.token);

        navigate("/home");

    } catch (error) {

        const mensaje =
            error.response?.data?.message ||
            "No fue posible iniciar sesión. Probá de nuevo.";

        Swal.fire({
            icon: "error",
            title: "No se pudo iniciar sesión",
            text: mensaje,
        });

    } finally {

        setLoading(false);

    }

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
             onSubmit={handleSubmit(onSubmit)}
        >
           <AppCard
                component={motion.div}
                initial={{
                    opacity: 0,
                    y: 40,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: .7,
                }}
            >

                <Stack      spacing={3}
                            >

                    <Logo />

                   <TextInput
                    label="Correo electrónico o cédula"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register("email", {
                        required: "Ingrese su correo o cédula",
                    })}
                />

                  <PasswordField
                    label="Contraseña"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password", {
                        required:
                            "Ingrese su contraseña",
                    })}
                />

                    <LoadingButton
                        loading={loading}
                        type="submit"

                    >
                        Iniciar Sesión
                    </LoadingButton>

                    <Typography
                        textAlign="center"
                        color="primary"
                        sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                        onClick={() => navigate("/recuperar-password")}
                    >
                        ¿Olvidó su contraseña?
                    </Typography>

                </Stack>

            </AppCard>
        </Box>

    </LoginContainer>

</PageContainer>
    );
}
