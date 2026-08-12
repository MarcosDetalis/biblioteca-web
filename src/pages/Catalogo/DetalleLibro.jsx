import {
    Box,
    Typography,
    Chip,
    Button,
    Card,
    CardMedia
} from "@mui/material";

import { useParams } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";

import { books } from "@/data/books";

export default function DetalleLibro() {

    const { id } = useParams();

    const book = books.find(
        b => b.id === Number(id)
    );

    if (!book) {
        return (
            <DashboardLayout>
                <Typography>
                    Libro no encontrado
                </Typography>
            </DashboardLayout>
        );
    }

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

                <Card>
                    <CardMedia
                        component="img"
                        image={book.portada}
                    />
                </Card>

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
                                    : "Reservado"
                            }
                        />
                    </Box>

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
                        {book.prologo}
                    </Typography>

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
                        Reservar Libro
                    </Button>

                </Box>

            </Box>

        </DashboardLayout>
    );

}