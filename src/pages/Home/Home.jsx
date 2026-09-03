import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Typography,
    Box,
    Stack,
    Button,
    CircularProgress,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import DashboardLayout from "@/layouts/DashboardLayout";
import BookCard from "@/components/Book/BookCard";

import { useAuth } from "@/context/AuthContext";
import { obtenerLibrosRequest, obtenerCategoriasRequest } from "@/api/libros.api";

// Paleta de colores pasteles para las píldoras de categoría. Cicla en
// orden, así cada categoría (sin importar cuántas haya en la base)
// siempre recibe un color consistente entre recargas.
const PALETA_CATEGORIAS = [
    { bg: "#E6F1FB", text: "#0C447C" },
    { bg: "#E1F5EE", text: "#085041" },
    { bg: "#FAECE7", text: "#712B13" },
    { bg: "#FBEAF0", text: "#72243E" },
    { bg: "#FAEEDA", text: "#633806" },
    { bg: "#EAF3DE", text: "#27500A" },
    { bg: "#EEEDFE", text: "#3C3489" },
];

export default function Home() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [libros, setLibros] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const cargarResumen = async () => {

            try {

                setLoading(true);

                const [librosResult, categoriasResult] = await Promise.all([
                    obtenerLibrosRequest(),
                    obtenerCategoriasRequest(),
                ]);

                setLibros(librosResult.data || []);
                setCategorias(categoriasResult.data || []);

            } catch (error) {

                console.error(
                    "Error cargando el resumen de inicio:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        cargarResumen();

    }, []);

    const ultimosLibros = libros.slice(0, 4);

    const irACategoria = (nombreCategoria) => {
        navigate("/catalogo", {
            state: { categoriaInicial: nombreCategoria },
        });
    };

    return (

        <DashboardLayout>

            {loading ? (

                <Box
                    sx={{
                        minHeight: 200,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                </Box>

            ) : (

                <>

                    {/* BANNER DE BIENVENIDA */}
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #0C447C, #378ADD)",
                            color: "#fff",
                            borderRadius: 3,
                            px: { xs: 3, sm: 4 },
                            py: { xs: 3, sm: 4 },
                            mb: 4,
                        }}
                    >
                        <Typography variant="h5" fontWeight={500} mb={0.5}>
                            {user?.nombre
                                ? `Hola, ${user.nombre.split(" ")[0]}`
                                : "Bienvenido nuevamente"}
                        </Typography>

                        <Typography sx={{ opacity: 0.9, mb: 2.5 }}>
                            Descubrí los últimos libros disponibles en la biblioteca.
                        </Typography>

                        <Button
                            onClick={() => navigate("/catalogo")}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                bgcolor: "#fff",
                                color: "#0C447C",
                                borderRadius: 999,
                                px: 2.5,
                                "&:hover": { bgcolor: "#f0f0f0" },
                            }}
                        >
                            Explorar catálogo
                        </Button>
                    </Box>

                    {/* ACCESOS RÁPIDOS */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        mb={5}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<BookmarkIcon />}
                            onClick={() => navigate("/reservas")}
                        >
                            Mis reservas
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<PersonIcon />}
                            onClick={() => navigate("/perfil")}
                        >
                            Mi perfil
                        </Button>
                    </Stack>

                    {/* CATEGORÍAS (reales, tocar una lleva al catálogo filtrado) */}
                    {categorias.length > 0 && (

                        <>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                Explorar por categoría
                            </Typography>

                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                gap={1.2}
                                mb={5}
                            >
                                {categorias.map((categoria, index) => {

                                    const color =
                                        PALETA_CATEGORIAS[
                                            index % PALETA_CATEGORIAS.length
                                        ];

                                    return (
                                        <Box
                                            key={categoria.id}
                                            onClick={() =>
                                                irACategoria(categoria.nombre)
                                            }
                                            sx={{
                                                bgcolor: color.bg,
                                                color: color.text,
                                                fontWeight: 500,
                                                fontSize: 14,
                                                px: 2.2,
                                                py: 1,
                                                borderRadius: 999,
                                                cursor: "pointer",
                                                transition: ".15s",
                                                "&:hover": {
                                                    filter: "brightness(0.96)",
                                                },
                                            }}
                                        >
                                            {categoria.nombre}
                                        </Box>
                                    );

                                })}
                            </Stack>
                        </>

                    )}

                    {/* ÚLTIMOS LIBROS AGREGADOS */}
                    {ultimosLibros.length > 0 && (

                        <>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                Últimos libros agregados
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 3,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, 1fr)",
                                        lg: "repeat(4, 1fr)",
                                    },
                                }}
                            >
                                {ultimosLibros.map((libro) => (
                                    <BookCard key={libro.id} book={libro} />
                                ))}
                            </Box>
                        </>

                    )}

                </>

            )}

        </DashboardLayout>

    );

}
