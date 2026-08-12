import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Logo from "@/components/Logo/Logo";
import AppCard from "@/components/Card/AppCard";
//import AppButton from "@/components/Button/AppButton";
import PageContainer from "@/components/Layout/PageContainer";
import TextInput from "@/components/Input/TextInput";
import PasswordField from "@/components/Input/PasswordField";

import LoginContainer from "@/components/Layout/LoginContainer";
import LoginImage from "@/components/Layout/LoginImage";
import { Box } from "@mui/material";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { motion } from "framer-motion";

import LoadingButton from "@/components/Button/LoadingButton";
import { useAuth } from "@/context/AuthContext";
 
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

    await new Promise(
        resolve =>
            setTimeout(resolve, 1200)
    );

    login({
        nombre: "Marcos",
        email: data.email,
        rol: "ALUMNO"
    });

    navigate("/home");

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
                    label="Correo electrónico"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register("email", {
                        required: "Ingrese su correo",
                        pattern: {
                            value:
                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:
                                "Correo inválido",
                        },
                    })}
                />

                  <PasswordField
                    label="Contraseña"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password", {
                        required:
                            "Ingrese su contraseña",
                        minLength: {
                            value: 4,
                            message:
                                "Mínimo 4 caracteres",
                        },
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