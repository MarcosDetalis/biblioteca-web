import { useState, useEffect } from "react";

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
    HORA_APERTURA,
    HORA_CIERRE,
} from "@/data/horarios";

import {
    useNavigate,
} from "react-router-dom";

import {
    validarFechaRetiro,
    validarHorario,
} from "@/utils/reservationRules";

import {
    verificarDisponibilidadHorarioRequest,
} from "@/api/reservas.api";


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

    const [fechaDevolucion, setFechaDevolucion] =
        useState("");

    const [horaDevolucion, setHoraDevolucion] =
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
     * VALIDACIÓN DE DEVOLUCIÓN ESTIMADA
     * ==========================================
     * Tiene que ser una fecha igual o posterior a
     * la de retiro (no tendría sentido devolver
     * antes de haber retirado).
     */

    const devolucionValida =
        fechaDevolucion !== "" &&
        horaDevolucion !== "" &&
        fecha !== "" &&
        fechaDevolucion >= fecha &&
        validarHorario(horaDevolucion).valido;


    /*
     * ==========================================
     * DISPONIBILIDAD DE LA FRANJA HORARIA
     * ==========================================
     * Se consulta en vivo apenas hay fecha/hora de
     * retiro y de devolución completas: si algún
     * libro del carrito ya está comprometido en esa
     * franja (por otras reservas activas), se avisa
     * acá y se ofrece el próximo horario libre ese
     * mismo día, antes de intentar confirmar.
     */

    const [
        disponibilidadHorario,
        setDisponibilidadHorario,
    ] = useState(null);

    const [
        verificandoHorario,
        setVerificandoHorario,
    ] = useState(false);

    useEffect(() => {

        if (
            cart.length === 0 ||
            !fecha ||
            !hora ||
            !fechaDevolucion ||
            !horaDevolucion
        ) {

            setDisponibilidadHorario(null);

            return;

        }


        let cancelado = false;

        const verificar = async () => {

            try {

                setVerificandoHorario(true);

                const respuesta =
                    await verificarDisponibilidadHorarioRequest({

                        libros: cart,

                        fechaRetiro: fecha,

                        horaRetiro: hora,

                        fechaDevolucion,

                        horaDevolucion,

                    });


                if (!cancelado) {

                    setDisponibilidadHorario(
                        respuesta.data
                    );

                }

            } catch (error) {

                console.error(
                    "Error verificando disponibilidad de horario:",
                    error
                );

                if (!cancelado) {

                    /*
                     * Si falla la consulta en vivo, no
                     * bloqueamos al usuario: el backend
                     * igual vuelve a validar al confirmar.
                     */

                    setDisponibilidadHorario(null);

                }

            } finally {

                if (!cancelado) {

                    setVerificandoHorario(false);

                }

            }

        };


        const timeoutId =
            setTimeout(verificar, 300);

        return () => {

            cancelado = true;

            clearTimeout(timeoutId);

        };

    }, [
        cart,
        fecha,
        hora,
        fechaDevolucion,
        horaDevolucion,
    ]);


    const usarHorarioSugerido =
        () => {

            if (
                !disponibilidadHorario?.sugerencia
            ) {
                return;
            }

            setHora(
                disponibilidadHorario.sugerencia
                    .horaRetiro
            );

            setFechaDevolucion(
                disponibilidadHorario.sugerencia
                    .fechaDevolucion
            );

            setHoraDevolucion(
                disponibilidadHorario.sugerencia
                    .horaDevolucion
            );

        };


    /*
     * ==========================================
     * CANTIDAD MÁXIMA
     * ==========================================
     */

    const obtenerMaxCantidad =
        (book) => {

            const totalEjemplares =
                Number(book.totalEjemplares) || 0;

            const maxReserva =
                book.maxReserva != null
                    ? Number(
                        book.maxReserva
                    )
                    : totalEjemplares;

            return Math.min(
                totalEjemplares,
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
        validarHorario(hora).valido &&
        devolucionValida &&
        !verificandoHorario &&
        disponibilidadHorario?.disponible === true &&
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

                        fechaDevolucion,

                        horaDevolucion,

                    });


                /*
                 * ==================================
                 * ERROR
                 * ==================================
                 */

                if (
                    !resultado.success
                ) {

                    if (resultado.sugerencia) {

                        setDisponibilidadHorario({
                            disponible: false,
                            sugerencia: resultado.sugerencia,
                        });

                    }

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
                                                    Ejemplares en total:
                                                    {" "}
                                                    {book.totalEjemplares}
                                                </Typography>


                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    La disponibilidad real se confirma en el momento del retiro.
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


                                {/* HORA DE RETIRO */}

                                <TextField
                                    label={`Hora de retiro (${HORA_APERTURA} a ${HORA_CIERRE})`}
                                    type="time"
                                    value={hora}
                                    onChange={(e) =>
                                        setHora(e.target.value)
                                    }
                                    disabled={
                                        !validacionFecha.valido ||
                                        loading
                                    }
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },

                                        htmlInput: {
                                            min: HORA_APERTURA,
                                            max: HORA_CIERRE,
                                            step: 300,
                                        },
                                    }}
                                    fullWidth
                                />

                                {hora !== "" &&
                                    !validarHorario(hora).valido && (

                                        <Alert severity="error">
                                            {
                                                validarHorario(hora)
                                                    .mensaje
                                            }
                                        </Alert>

                                    )}


                                <Divider />


                                {/* FECHA DE DEVOLUCIÓN ESTIMADA */}

                                <TextField
                                    label="Fecha estimada de devolución"
                                    type="date"
                                    value={fechaDevolucion}
                                    onChange={(e) => {

                                        setFechaDevolucion(
                                            e.target.value
                                        );

                                        setHoraDevolucion("");

                                    }}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },

                                        htmlInput: {
                                            min:
                                                fecha || fechaMinima,
                                        },
                                    }}
                                    fullWidth
                                />

                                {fechaDevolucion &&
                                    fecha &&
                                    fechaDevolucion < fecha && (

                                        <Alert
                                            severity="error"
                                        >
                                            La devolución no puede ser antes de la fecha de retiro.
                                        </Alert>

                                    )}

                                <TextField
                                    label={`Hora estimada de devolución (${HORA_APERTURA} a ${HORA_CIERRE})`}
                                    type="time"
                                    value={horaDevolucion}
                                    onChange={(e) =>
                                        setHoraDevolucion(e.target.value)
                                    }
                                    disabled={
                                        !fechaDevolucion ||
                                        loading
                                    }
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },

                                        htmlInput: {
                                            min: HORA_APERTURA,
                                            max: HORA_CIERRE,
                                            step: 300,
                                        },
                                    }}
                                    fullWidth
                                />

                                {horaDevolucion !== "" &&
                                    !validarHorario(horaDevolucion).valido && (

                                        <Alert severity="error">
                                            {
                                                validarHorario(horaDevolucion)
                                                    .mensaje
                                            }
                                        </Alert>

                                    )}


                                {/* DISPONIBILIDAD DE LA FRANJA HORARIA */}

                                {verificandoHorario && (

                                    <Alert severity="info">
                                        Verificando disponibilidad de horario…
                                    </Alert>

                                )}

                                {!verificandoHorario &&
                                    disponibilidadHorario &&
                                    !disponibilidadHorario.disponible && (

                                        <Alert
                                            severity="warning"
                                            action={
                                                disponibilidadHorario.sugerencia && (
                                                    <Button
                                                        color="inherit"
                                                        size="small"
                                                        onClick={usarHorarioSugerido}
                                                    >
                                                        Usar horario sugerido
                                                    </Button>
                                                )
                                            }
                                        >
                                            {disponibilidadHorario.conflictos?.length > 0 && (
                                                <>
                                                    {disponibilidadHorario.conflictos.join(", ")}
                                                    {" "}ya está{disponibilidadHorario.conflictos.length > 1 ? "n" : ""} comprometido{disponibilidadHorario.conflictos.length > 1 ? "s" : ""} en esa franja horaria.
                                                    {" "}
                                                </>
                                            )}
                                            {disponibilidadHorario.sugerencia
                                                ? `Próximo horario disponible ese día: ${disponibilidadHorario.sugerencia.horaRetiro}.`
                                                : "No hay otro horario disponible ese día, probá con otra fecha."}
                                        </Alert>

                                    )}


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


                                        <Typography>
                                            Devolución estimada:
                                            {" "}
                                            {fechaDevolucion || "-"}
                                            {" "}
                                            {horaDevolucion || ""}
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


                                <Alert severity="info">
                                    La reserva se crea siempre. La disponibilidad real de cada ejemplar se confirma recién en el momento del retiro: si no alcanza para todos, se resuelve por orden de llegada.
                                </Alert>


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