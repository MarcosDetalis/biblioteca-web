import { useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import {
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
    Card,
    CardContent,
    Stack,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
} from "@mui/material";

import {
    useReservationCart,
} from "@/context/ReservationCartContext";

import {
    useReservation,
} from "@/context/ReservationContext";

import {
    horariosDisponibles,
} from "@/data/horarios";

import {
    useNavigate,
} from "react-router-dom";

import {
    validarFechaRetiro,
} from "@/utils/reservationRules";


export default function CarritoReserva() {

    /*
     * ==========================================
     * CARRITO
     * ==========================================
     */

    const {
        cart,
        removeBook,
        updateQuantity,
        clearCart,
    } = useReservationCart();


    /*
     * ==========================================
     * RESERVACIONES
     * ==========================================
     */

    const {
        createReservation,
    } = useReservation();


    const navigate =
        useNavigate();


    /*
     * ==========================================
     * FECHA Y HORA
     * ==========================================
     */

    const [fecha, setFecha] =
        useState("");

    const [hora, setHora] =
        useState("");


    /*
     * ==========================================
     * LOADING
     * ==========================================
     */

    const [loading, setLoading] =
        useState(false);


    /*
     * ==========================================
     * SNACKBAR
     * ==========================================
     */

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });


    /*
     * ==========================================
     * FECHA MÍNIMA
     * ==========================================
     */

    const fechaMinima =
        new Date()
            .toISOString()
            .split("T")[0];


    /*
     * ==========================================
     * VALIDACIÓN DE FECHA
     * ==========================================
     */

    const validacionFecha =
        validarFechaRetiro(fecha);


    /*
     * ==========================================
     * CANTIDAD MÁXIMA
     * ==========================================
     */

    const obtenerMaxCantidad =
        (book) => {

            const stock =
                Number(book.stock) || 0;

            const maxReserva =
                book.maxReserva != null
                    ? Number(
                        book.maxReserva
                    )
                    : stock;

            return Math.min(
                stock,
                maxReserva
            );
        };


    /*
     * ==========================================
     * TOTAL EJEMPLARES
     * ==========================================
     */

    const totalEjemplares =
        cart.reduce(
            (total, book) =>
                total +
                Number(
                    book.cantidad || 0
                ),
            0
        );


    /*
     * ==========================================
     * PUEDE CONFIRMAR
     * ==========================================
     */

    const puedeConfirmar =
        cart.length > 0 &&
        fecha !== "" &&
        hora !== "" &&
        validacionFecha.valido &&
        !loading;


    /*
     * ==========================================
     * CERRAR SNACKBAR
     * ==========================================
     */

    const handleCloseSnackbar =
        (event, reason) => {

            if (
                reason === "clickaway"
            ) {
                return;
            }

            setSnackbar(
                (prev) => ({
                    ...prev,
                    open: false,
                })
            );
        };


    /*
     * ==========================================
     * CONFIRMAR RESERVA
     * ==========================================
     */

    const handleConfirmar =
        async () => {

            if (!puedeConfirmar) {
                return;
            }


            setLoading(true);


            try {

                /*
                 * Enviar reserva al backend
                 */

                const resultado =
                    await createReservation({

                        libros: cart,

                        fechaRetiro:
                            fecha,

                        horaRetiro:
                            hora,

                    });


                /*
                 * ==================================
                 * ERROR
                 * ==================================
                 */

                if (
                    !resultado.success
                ) {

                    setSnackbar({

                        open: true,

                        message:
                            resultado.message ||
                            "No se pudo crear la reserva.",

                        severity:
                            "error",

                    });

                    return;
                }


                /*
                 * ==================================
                 * RESERVA CREADA
                 * ==================================
                 */

                console.log(
                    "Reserva creada:",
                    resultado.reservation
                );


                /*
                 * Limpiar carrito
                 */

                clearCart();


                /*
                 * Ir al detalle
                 * de la reserva
                 */

                navigate(
                    `/reservas/${resultado.reservation.id}`
                );


            } catch (error) {

                console.error(
                    "Error confirmando reserva:",
                    error
                );


                setSnackbar({

                    open: true,

                    message:
                        "Ocurrió un error al crear la reserva.",

                    severity:
                        "error",

                });


            } finally {

                setLoading(false);

            }

        };


    return (

        <DashboardLayout>

            {/* =================================
                TÍTULO
            ================================= */}

            <Typography
                variant="h4"
                fontWeight={700}
                mb={4}
            >
                Reserva de Libros
            </Typography>


            {/* =================================
                CARRITO VACÍO
            ================================= */}

            {cart.length === 0 ? (

                <Card>

                    <CardContent>

                        <Typography
                            variant="h6"
                            textAlign="center"
                        >
                            No hay libros en la reserva.
                        </Typography>


                        <Typography
                            textAlign="center"
                            color="text.secondary"
                            mt={1}
                        >
                            Vuelve al catálogo y agrega
                            algunos libros.
                        </Typography>


                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "center",
                                mt: 3,
                            }}
                        >

                            <Button
                                variant="contained"
                                onClick={() =>
                                    navigate(
                                        "/catalogo"
                                    )
                                }
                            >
                                Ir al catálogo
                            </Button>

                        </Box>

                    </CardContent>

                </Card>

            ) : (

                <>

                    {/* =================================
                        LIBROS
                    ================================= */}

                    <Stack spacing={2}>

                        {cart.map((book) => {

                            const maxCantidad =
                                obtenerMaxCantidad(
                                    book
                                );


                            return (

                                <Card
                                    key={book.id}
                                >

                                    <CardContent>

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "space-between",

                                                gap: 3,

                                                flexWrap:
                                                    "wrap",
                                            }}
                                        >

                                            {/* INFORMACIÓN */}

                                            <Box>

                                                <Typography
                                                    variant="h6"
                                                    fontWeight={700}
                                                >
                                                    {book.titulo}
                                                </Typography>


                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    {book.autor}
                                                </Typography>


                                                <Typography
                                                    variant="body2"
                                                    mt={1}
                                                >
                                                    Stock disponible:
                                                    {" "}
                                                    {book.stock}
                                                </Typography>


                                                <Typography
                                                    variant="body2"
                                                >
                                                    Máximo permitido:
                                                    {" "}
                                                    {maxCantidad}
                                                </Typography>

                                            </Box>


                                            {/* CANTIDAD */}

                                            <Stack
                                                spacing={2}
                                            >

                                                <TextField
                                                    select
                                                    size="small"
                                                    label="Cantidad"
                                                    value={
                                                        book.cantidad
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateQuantity(
                                                            book.id,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    sx={{
                                                        width: 140,
                                                    }}
                                                >

                                                    {Array.from(
                                                        {
                                                            length:
                                                                maxCantidad,
                                                        },
                                                        (
                                                            _,
                                                            i
                                                        ) =>
                                                            i + 1
                                                    ).map(
                                                        (
                                                            cantidad
                                                        ) => (

                                                            <MenuItem
                                                                key={
                                                                    cantidad
                                                                }
                                                                value={
                                                                    cantidad
                                                                }
                                                            >
                                                                {
                                                                    cantidad
                                                                }
                                                            </MenuItem>

                                                        )
                                                    )}

                                                </TextField>


                                                <Button
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        removeBook(
                                                            book.id
                                                        )
                                                    }
                                                >
                                                    Quitar
                                                </Button>

                                            </Stack>

                                        </Box>

                                    </CardContent>

                                </Card>

                            );

                        })}

                    </Stack>


                    {/* =================================
                        DATOS DEL RETIRO
                    ================================= */}

                    <Card
                        sx={{
                            mt: 5,
                            maxWidth: 500,
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={3}
                            >
                                Datos del Retiro
                            </Typography>


                            <Stack spacing={3}>

                                {/* FECHA */}

                                <TextField
                                    label="Fecha de retiro"
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => {

                                        setFecha(
                                            e.target.value
                                        );

                                        /*
                                         * Si cambia la fecha,
                                         * eliminamos la hora
                                         * seleccionada.
                                         */

                                        setHora("");

                                    }}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },

                                        htmlInput: {
                                            min:
                                                fechaMinima,
                                        },
                                    }}
                                    fullWidth
                                />


                                {/* ERROR FECHA */}

                                {fecha &&
                                    !validacionFecha.valido && (

                                        <Alert
                                            severity="error"
                                        >
                                            {
                                                validacionFecha.mensaje
                                            }
                                        </Alert>

                                    )}


                                {/* HORARIOS */}

                                <Box>

                                    <Typography
                                        mb={2}
                                        fontWeight={600}
                                    >
                                        Horarios disponibles
                                    </Typography>


                                    <Box
                                        sx={{
                                            display:
                                                "flex",

                                            gap: 1,

                                            flexWrap:
                                                "wrap",
                                        }}
                                    >

                                        {horariosDisponibles.map(
                                            (item) => (

                                                <Button
                                                    key={item}
                                                    variant={
                                                        hora === item
                                                            ? "contained"
                                                            : "outlined"
                                                    }

                                                    disabled={
                                                        !validacionFecha.valido ||
                                                        loading
                                                    }

                                                    onClick={() =>
                                                        setHora(
                                                            item
                                                        )
                                                    }
                                                >
                                                    {item}
                                                </Button>

                                            )
                                        )}

                                    </Box>

                                </Box>


                                <Divider />


                                {/* =================================
                                    RESUMEN
                                ================================= */}

                                <Card
                                    variant="outlined"
                                >

                                    <CardContent>

                                        <Typography
                                            fontWeight={700}
                                            mb={2}
                                        >
                                            Resumen de la Reserva
                                        </Typography>


                                        <Typography>
                                            Libros:
                                            {" "}
                                            {cart.length}
                                        </Typography>


                                        <Typography>
                                            Fecha:
                                            {" "}
                                            {fecha || "-"}
                                        </Typography>


                                        <Typography>
                                            Hora:
                                            {" "}
                                            {hora || "-"}
                                        </Typography>


                                        <Typography
                                            mt={2}
                                            fontWeight={700}
                                        >
                                            Ejemplares:
                                            {" "}
                                            {totalEjemplares}
                                        </Typography>

                                    </CardContent>

                                </Card>


                                {/* =================================
                                    CONFIRMAR
                                ================================= */}

                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={
                                        !puedeConfirmar
                                    }
                                    onClick={
                                        handleConfirmar
                                    }
                                >

                                    {loading ? (

                                        <>

                                            <CircularProgress
                                                size={22}
                                                color="inherit"
                                                sx={{
                                                    mr: 1,
                                                }}
                                            />

                                            Procesando...

                                        </>

                                    ) : (

                                        "Confirmar Reserva"

                                    )}

                                </Button>

                            </Stack>

                        </CardContent>

                    </Card>

                </>

            )}


            {/* =================================
                SNACKBAR
            ================================= */}

            <Snackbar
                open={
                    snackbar.open
                }
                autoHideDuration={4000}
                onClose={
                    handleCloseSnackbar
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >

                <Alert
                    onClose={
                        handleCloseSnackbar
                    }
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    sx={{
                        width: "100%",
                    }}
                >
                    {
                        snackbar.message
                    }
                </Alert>

            </Snackbar>

        </DashboardLayout>

    );

}