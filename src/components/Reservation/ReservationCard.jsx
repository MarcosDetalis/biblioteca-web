import PropTypes from "prop-types";

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Divider,
} from "@mui/material";

import QRCode from "react-qr-code";


export default function ReservationCard({
    reservation,
}) {

    if (!reservation) {
        return null;
    }


    return (

        <Card>

            <CardContent>

                {/* ==============================
                    NÚMERO DE RESERVA
                ============================== */}

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Reserva{" "}
                    {reservation.numeroReserva ||
                        reservation.numero_reserva ||
                        reservation.id}
                </Typography>


                {/* ==============================
                    ESTADO
                ============================== */}

                <Box mt={2}>

                    <Chip
                        label={
                            reservation.estado ||
                            "PENDIENTE"
                        }
                        color={
                            reservation.estado ===
                            "CANCELADA"
                                ? "error"
                                : "success"
                        }
                    />

                </Box>


                <Divider
                    sx={{
                        my: 3,
                    }}
                />


                {/* ==============================
                    DATOS DEL RETIRO
                ============================== */}

                <Typography
                    fontWeight={700}
                    mb={1}
                >
                    Datos del retiro
                </Typography>


                <Typography>
                    Fecha:{" "}
                    {reservation.fechaRetiro ||
                        "-"}
                </Typography>


                <Typography>
                    Hora:{" "}
                    {reservation.horaRetiro ||
                        "-"}
                </Typography>


                <Typography>
                    Ejemplares:{" "}
                    {reservation.totalEjemplares ||
                        0}
                </Typography>


                {/* ==============================
                    LIBROS
                ============================== */}

                <Typography
                    fontWeight={700}
                    mt={4}
                    mb={2}
                >
                    Libros reservados
                </Typography>


                <Box>

                    {reservation.libros?.map(
                        (book) => (

                            <Box
                                key={book.id}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    bgcolor:
                                        "#f8fafc",
                                    borderRadius: 2,
                                }}
                            >

                                <Typography
                                    fontWeight={700}
                                >
                                    {book.titulo}
                                </Typography>


                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Autor:{" "}
                                    {book.autor}
                                </Typography>


                                <Typography
                                    variant="body2"
                                    mt={1}
                                >
                                    Cantidad:{" "}
                                    {book.cantidad}
                                </Typography>

                            </Box>

                        )
                    )}

                </Box>


                <Divider
                    sx={{
                        my: 3,
                    }}
                />


                {/* ==============================
                    QR
                ============================== */}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 3,
                        p: 3,
                        backgroundColor:
                            "#ffffff",
                        borderRadius: 2,
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        mb={2}
                    >
                        Código QR de la reserva
                    </Typography>


                    {reservation.codigoQR ? (

                        <QRCode
                            value={
                                reservation.codigoQR
                            }
                            size={220}
                        />

                    ) : (

                        <Typography
                            color="error"
                        >
                            No se pudo generar el
                            código QR.
                        </Typography>

                    )}


                    {reservation.codigoQR && (

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                mt: 2,
                                textAlign:
                                    "center",
                                wordBreak:
                                    "break-all",
                            }}
                        >
                            {reservation.codigoQR}
                        </Typography>

                    )}

                </Box>

            </CardContent>

        </Card>

    );
}


ReservationCard.propTypes = {

    reservation:
        PropTypes.object,

};