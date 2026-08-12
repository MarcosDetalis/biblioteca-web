import {
  Box,
  Typography,
  Chip,
  Button,
  Card,
  CardMedia,
  Divider,
   
} from "@mui/material";

import { useParams } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import { books } from "@/data/books";
/*
import {
  useReservation,
} from "@/context/ReservationContext";*/

import {
  useNavigate,
} from "react-router-dom";
import {
  useReservationCart,
} from "@/context/ReservationCartContext";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
export default function DetalleLibro() {
  const { id } = useParams();

  const book = books.find(
    (b) => b.id === Number(id)
  );
const { addBook } =
  useReservationCart();
const navigate = useNavigate();


const [snackbar, setSnackbar] =
  useState({
    open: false,
    message: "",
    severity: "success",
  });
 
const handleAddBook = () => {
  const result = addBook(book);

  setSnackbar({
    open: true,
    message: result.message,
    severity: result.severity,
  });
};

/*const { addReservation } =
  useReservation();*/
const [openSnackbar, setOpenSnackbar] =
  useState(false);

  if (!book) {
    return (
      <DashboardLayout>
        <Typography variant="h5">
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
            md: "320px 1fr",
          },
        }}
      >
        <Card>
          <CardMedia
            component="img"
            image={book.portada}
            alt={book.titulo}
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
            color="text.secondary"
            mt={2}
          >
            Autor: {book.autor}
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            Categoría: {book.categoria}
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

          <Divider sx={{ my: 4 }} />

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
            {book.prologo}
          </Typography>

       <Button
  variant="contained"
  size="large"
  disabled={!book.disponible}
  onClick={handleAddBook}
>
  Agregar a Reserva
</Button>


<Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={() =>
    setOpenSnackbar(false)
  }
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "center"
  }}
>
 <Alert
  severity={snackbar.severity}
  variant="filled"
  action={
     
      <Button
        color="inherit"
        size="small"
        onClick={() =>
          navigate("/carrito")
        }
      >
        VER RESERVA
      </Button>
    
  }
>
  {snackbar.message}
</Alert>
</Snackbar>

        </Box>
      </Box>


<Snackbar
  open={snackbar.open}
  autoHideDuration={3500}
  onClose={() =>
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }))
  }
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "center",
  }}
>
  <Alert
    onClose={() =>
      setSnackbar((prev) => ({
        ...prev,
        open: false,
      }))
    }
    severity={snackbar.severity}
    variant="filled"
    sx={{
      width: "100%",
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

    </DashboardLayout>

    
  );
  
}