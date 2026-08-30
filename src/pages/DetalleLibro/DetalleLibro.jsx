import {
    Box,
    Typography,
    Chip,
    Button,
    Card,
    CardMedia,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import DashboardLayout
    from "@/layouts/DashboardLayout";

import {
    useReservationCart,
} from "@/context/ReservationCartContext";


export default function DetalleLibro() {

    const { id } = useParams();

    const navigate = useNavigate();

    const {
        addBook,
    } = useReservationCart();


    /*
     * LIBRO
     */

    const [book, setBook] =
        useState(null);


    /*
     * ESTADO DE CARGA
     */

    const [loading, setLoading] =
        useState(true);


    /*
     * ERROR
     */

    const [error, setError] =
        useState("");


    /*
     * SNACKBAR
     */

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success",
        });


    /*
     * CARGAR LIBRO DESDE LA API
     */

    useEffect(() => {

        const cargarLibro = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await fetch(
                        `https://backend-okn0.onrender.com/api/libros/${id}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "No se pudo obtener el libro"
                    );

                }


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "No se pudo obtener el libro"
                    );

                }


                console.log(
                    "Libro recibido:",
                    result.data
                );


                setBook(result.data);

            } catch (error) {

                console.error(
                    "Error cargando libro:",
                    error
                );

                setError(
                    "No se pudo cargar el libro."
                );

            } finally {

                setLoading(false);

            }

        };


        cargarLibro();

    }, [id]);


    /*
     * DISPONIBILIDAD
     *
     * La disponibilidad se determina
     * directamente por el stock.
     */

    const disponible =
        book
            ? Number(book.stock) > 0
            : false;


    /*
     * AGREGAR LIBRO AL CARRITO
     */

    const handleAddBook = () => {

        if (!book) {
            return;
        }


        if (!disponible) {

            setSnackbar({
                open: true,
                message:
                    "Este libro no tiene ejemplares disponibles.",
                severity: "error",
            });

            return;
        }


        const result =
            addBook(book);


        setSnackbar({
            open: true,
            message: result.message,
            severity: result.severity,
        });

    };


    /*
     * CERRAR SNACKBAR
     */

    const handleCloseSnackbar = (
        event,
        reason
    ) => {

        if (reason === "clickaway") {
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
     * LOADING
     */

    if (loading) {

        return (

            <DashboardLayout>

                <Box
                    sx={{
                        minHeight: 400,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >

                    <CircularProgress />

                </Box>

            </DashboardLayout>

        );

    }


    /*
     * ERROR
     */

    if (error) {

        return (

            <DashboardLayout>

                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                >
                    {error}
                </Alert>


                <Button
                    variant="outlined"
                    onClick={() =>
                        navigate("/catalogo")
                    }
                >
                    Volver al catálogo
                </Button>

            </DashboardLayout>

        );

    }


    /*
     * LIBRO NO ENCONTRADO
     */

    if (!book) {

        return (

            <DashboardLayout>

                <Typography
                    variant="h5"
                >
                    Libro no encontrado
                </Typography>


                <Button
                    sx={{
                        mt: 2,
                    }}
                    variant="outlined"
                    onClick={() =>
                        navigate("/catalogo")
                    }
                >
                    Volver al catálogo
                </Button>

            </DashboardLayout>

        );

    }


    /*
     * PANTALLA PRINCIPAL
     */

    return (

        <DashboardLayout>

            <Box
                sx={{
                    display: "grid",
                    gap: 4,
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "320px 1fr",
                    },
                }}
            >

                {/* ==========================
                    PORTADA
                ========================== */}

                <Card>

                    <CardMedia
                        component="img"
                        image={book.portada}
                        alt={book.titulo}
                    />

                </Card>


                {/* ==========================
                    INFORMACIÓN
                ========================== */}

                <Box>

                    <Typography
                        variant="h3"
                        fontWeight={700}
                    >
                        {book.titulo}
                    </Typography>


                    <Typography
                        color="text.secondary"
                        mt={2}
                    >
                        Autor:{" "}
                        {book.autor}
                    </Typography>


                    <Typography
                        color="text.secondary"
                        mt={1}
                    >
                        Categoría:{" "}
                        {book.categoria}
                    </Typography>


                    {/* ==========================
                        DISPONIBILIDAD
                    ========================== */}

                    <Box mt={3}>

                        <Chip
                            color={
                                disponible
                                    ? "success"
                                    : "error"
                            }
                            label={
                                disponible
                                    ? "Disponible"
                                    : "No disponible"
                            }
                        />

                    </Box>


                    {/* ==========================
                        STOCK
                    ========================== */}

                    <Typography
                        color="text.secondary"
                        mt={2}
                    >
                        Ejemplares disponibles:{" "}
                        <strong>
                            {Number(book.stock) || 0}
                        </strong>
                    </Typography>


                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />


                    {/* ==========================
                        PRÓLOGO
                    ========================== */}

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        mb={2}
                    >
                        Prólogo
                    </Typography>


                    <Typography
                        sx={{
                            lineHeight: 2,
                            textAlign: "justify",
                        }}
                    >
                        {book.prologo ||
                            "No hay información disponible."
                        }
                    </Typography>


                    {/* ==========================
                        BOTÓN RESERVA
                    ========================== */}

                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 5,
                        }}
                        disabled={!disponible}
                        onClick={
                            handleAddBook
                        }
                    >
                        Agregar a Reserva
                    </Button>

                </Box>

            </Box>


            {/* ==========================
                SNACKBAR
            ========================== */}

            <Snackbar
                open={snackbar.open}
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
                    action={

                        <Button
                            color="inherit"
                            size="small"
                            onClick={() =>
                                navigate(
                                    "/carrito"
                                )
                            }
                        >
                            VER RESERVA
                        </Button>

                    }
                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </DashboardLayout>
    );
}