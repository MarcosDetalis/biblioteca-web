import PropTypes from "prop-types";

import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Chip,
    Box
} from "@mui/material";
import { useNavigate }
from "react-router-dom";

export default function BookCard({
    book

}) {

const navigate = useNavigate();
    return (

        <Card
            onClick={() => navigate(`/libro/${book.id}`)}
            sx={{
                cursor: "pointer",
                transition: ".3s",

               "&:hover": {
                transform: "translateY(-8px)",
                boxShadow:
                    "0px 12px 30px rgba(0,0,0,0.15)"
            }
                        }}
        >

            <CardMedia
                component="img"
                height="260"
                image={book.portada}
            />

            <CardContent>

                <Typography
                    variant="h6"
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 64
                    }}
                >
                    {book.titulo}
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    {book.autor}
                </Typography>

                <Box mt={2}>

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
                    <Chip
                        size="small"
                        label={book.categoria}
                        sx={{
                            mt: 1
                        }}
                    />

                </Box>

            </CardContent>

        </Card>

    );

}

BookCard.propTypes = {
    book: PropTypes.object,
    onClick: PropTypes.func
};