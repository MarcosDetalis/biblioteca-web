import { useEffect, useState } from "react";

import DashboardLayout
    from "@/layouts/DashboardLayout";

import {
    Typography,
    Box,
    MenuItem,
    CircularProgress,
} from "@mui/material";

import SearchInput
    from "@/components/Input/SearchInput";

import TextInput
    from "@/components/Input/TextInput";

import BookCard

    from "@/components/Book/BookCard";

import {
    categories
} from "@/data/categories";


export default function Catalogo() {

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("Todas");

    const [books, setBooks] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const cargarLibros = async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await fetch(
                        "https://backend-okn0.onrender.com/api/libros"
                    );

                if (!response.ok) {

                    throw new Error(
                        "Error al consultar los libros"
                    );

                }

                const result =
                    await response.json();

                setBooks(
                    result.data || []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "No se pudieron cargar los libros."
                );

            } finally {

                setLoading(false);

            }

        };

        cargarLibros();

    }, []);


    const filteredBooks =
        books.filter((book) => {

            const matchSearch =
                book.titulo
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchCategory =
                category === "Todas" ||
                book.categoria === category;

            return (
                matchSearch &&
                matchCategory
            );

        });


    return (

        <DashboardLayout>

            <Typography
                variant="h4"
                fontWeight={700}
                mb={4}
            >
                Catálogo
            </Typography>


            {/* FILTROS */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "2fr 1fr",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >

                <SearchInput
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <TextInput
                    select
                    label="Categoría"
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value
                        )
                    }
                >

                    {categories.map(
                        (cat) => (

                            <MenuItem
                                key={cat}
                                value={cat}
                            >
                                {cat}
                            </MenuItem>

                        )
                    )}

                </TextInput>

            </Box>


            {/* CARGANDO */}

            {loading && (

                <Box
                    sx={{
                        minHeight: 250,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                    }}
                >

                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Cargando libros...
                    </Typography>

                </Box>

            )}


            {/* ERROR */}

            {!loading && error && (

                <Box
                    sx={{
                        minHeight: 250,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >

                    <Typography
                        color="error"
                    >
                        {error}
                    </Typography>

                </Box>

            )}
 

            {/* LIBROS */}

            {!loading &&
                !error && (

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

                        {filteredBooks.map(
                            (book) => (

                                <BookCard
                                    key={book.id}
                                    book={book}
                                />

                            )
                        )}

                    </Box>

                )}


            {/* SIN RESULTADOS */}

            {!loading &&
                !error &&
                filteredBooks.length === 0 && (

                    <Box
                        sx={{
                            minHeight: 200,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >

                        <Typography
                            color="text.secondary"
                        >
                            No se encontraron libros.
                        </Typography>

                    </Box>

                )}

        </DashboardLayout>

    );

}