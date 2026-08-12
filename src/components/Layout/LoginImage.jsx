import { Box, Typography } from "@mui/material";

export default function LoginImage() {
    return (
        <Box
            sx={{
                flex: 1,
                display: {
                    xs: "none",
                    md: "flex",
                },
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background:
                    "linear-gradient(160deg,#0F4C81,#2F73AF)",
                color: "#FFF",
                p: 6,
            }}
        >
            <Typography
                variant="h3"
                fontWeight={700}
                mb={3}
            >
                Bienvenido
            </Typography>

            <Typography
                textAlign="center"
                sx={{
                    opacity: .9,
                    maxWidth: 320,
                }}
            >
                Accede al sistema de reservas de la Biblioteca de la
                Universidad del Norte y consulta la disponibilidad de
                libros de manera rápida y segura.
            </Typography>

            <Box
                sx={{
                    mt: 5,
                    width: 320,
                    height: 220,
                    borderRadius: 5,
                    bgcolor: "rgba(255,255,255,.12)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 80,
                }}
            >
                📚
            </Box>
        </Box>
    );
}