import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function Logo({
    title = "Biblioteca UNINORTE",
    subtitle = "Sistema Web de Reserva de Libros",
}) {
    return (
        <Box textAlign="center">

            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                        "linear-gradient(135deg,#0F4C81,#2563EB)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: 36,
                    mx: "auto",
                }}
            >
                📚
            </Box>

            <Typography
                variant="h5"
                fontWeight={700}
                mt={2}
            >
                {title}
            </Typography>

            <Typography
                color="text.secondary"
                mt={1}
            >
                {subtitle}
            </Typography>

        </Box>
    );
}

Logo.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
};