import {
    Box,
    Typography,
    Chip,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import DashboardLayout
    from "@/layouts/DashboardLayout";

export default function DetalleLibro() {

    const { id } = useParams();

    const [book, setBook] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


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
     * CARGANDO
     */

    if (loading) {

        return (

            <DashboardLayout>

                <Box
                    sx={{
                        minHeight: 400,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
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

                <Alert severity="error">
                    {error}
                </Alert>

            </DashboardLayout>

        );
    }


    /*
     * LIBRO NO ENCONTRADO
     */

    if (!book) {

        return (

            <DashboardLayout>

                <Typography>
                    Libro no encontrado
                </Typography>

            </DashboardLayout>

        );
    }


    /*
     * DETALLE DEL LIBRO
     */

    return (

        <DashboardLayout>

            <Box
                sx={{
                    display: "grid",
                    gap: 4,
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "350px 1fr"
                    }
                }}
            >

                {/* PORTADA */}

                <Card>

                    <CardMedia
                        component="img"
                        image={book.portada}
                        alt={book.titulo}
                    />

                </Card>


                {/* INFORMACIÓN */}

                <Box>

                    <Typography
                        variant="h3"
                        fontWeight={700}
                    >
                        {book.titulo}
                    </Typography>


                    <Typography
                        mt={2}
                        color="text.secondary"
                    >
                        Autor:
                        {" "}
                        {book.autor}
                    </Typography>


                    <Typography
                        mt={1}
                        color="text.secondary"
                    >
                        Categoría:
                        {" "}
                        {book.categoria}
                    </Typography>


                    {/* DISPONIBILIDAD */}

                    <Box mt={3}>

                        <Chip
                            color={
                                book.disponible
                                    ? "success"
                                    : "error"
                            }
                            label={
                                book.disponible
                                    ? "Disponible"
                                    : "No disponible"
                            }
                        />

                    </Box>


                    {/* STOCK */}

                    <Typography
                        mt={2}
                        color="text.secondary"
                    >
                        Ejemplares disponibles:
                        {" "}
                        <strong>
                            {book.stock}
                        </strong>
                    </Typography>


                    {/* PRÓLOGO */}

                    <Typography
                        variant="h5"
                        mt={5}
                        mb={2}
                        fontWeight={700}
                    >
                        Prólogo
                    </Typography>


                    <Typography
                        sx={{
                            lineHeight: 2,
                            textAlign: "justify"
                        }}
                    >
                        {book.prologo ||
                            "Este libro no tiene prólogo disponible."
                        }
                    </Typography>


                    {/* RESERVAR */}

                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 5
                        }}
                        disabled={
                            !book.disponible
                        }
                    >
                        Agregar a reserva
                    </Button>

                </Box>

            </Box>

        </DashboardLayout>

    );
}