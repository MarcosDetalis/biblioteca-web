import { useState } from "react";

import DashboardLayout
from "@/layouts/DashboardLayout";

import {
    Typography,
    Box,
    MenuItem
} from "@mui/material";

import SearchInput
from "@/components/Input/SearchInput";

import TextInput
from "@/components/Input/TextInput";

import BookCard
from "@/components/Book/BookCard";

import { books }
from "@/data/books";

import {
    categories
} from "@/data/categories";

export default function Catalogo() {

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("Todas");

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

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "2fr 1fr"
                    },
                    gap: 2,
                    mb: 4
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

            <Box
                sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm:
                            "repeat(2,1fr)",
                        lg:
                            "repeat(4,1fr)"
                    }
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

        </DashboardLayout>

    );

}