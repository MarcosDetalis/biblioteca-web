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
} from "@mui/material";

import {
  useReservationCart,
} from "@/context/ReservationCartContext";

import {
  horariosDisponibles,
} from "@/data/horarios";

import {
  useReservation,
} from "@/context/ReservationContext";

import {
  useNavigate,
} from "react-router-dom";


import {
  validarFechaRetiro,
} from "@/utils/reservationRules";

export default function CarritoReserva() {
  const {
    cart,
    removeBook,
    updateQuantity,
    clearCart,
    
  } = useReservationCart();

  const {
  createReservation,
} = useReservation();
  const navigate = useNavigate();
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const fechaMinima = new Date()
    .toISOString()
    .split("T")[0];

const esFinDeSemana = (
  fecha
) => {
  if (!fecha) {
    return false;
  }

  const [
    year,
    month,
    day
  ] = fecha
    .split("-")
    .map(Number);

  const fechaLocal =
    new Date(
      year,
      month - 1,
      day
    );

  const dia =
    fechaLocal.getDay();

  return (
    dia === 0 ||
    dia === 6
  );
};


const [snackbar, setSnackbar] =
  useState({
    open: false,
    message: "",
    severity: "success",
  });

const handleConfirmar = () => {

  const resultado =
    createReservation({
      libros: cart,
      fechaRetiro: fecha,
      horaRetiro: hora,
    });

  if (!resultado.success) {
    setSnackbar({
      open: true,
      message:
        resultado.message,
      severity: "error",
    });

    return;
  }

  clearCart();

  navigate(
    `/reservas/${resultado.reservation.id}`
  );
};

const validacionFecha = validarFechaRetiro(fecha);

const puedeConfirmar =
  cart.length > 0 &&
  fecha &&
  hora &&
  validarFechaRetiro(fecha).valido;

  return (
    
    <DashboardLayout>
      {fecha &&
  !validacionFecha.valido && (
    <Alert
      severity="error"
      sx={{ mt: 1 }}
    >
      {validacionFecha.mensaje}
    </Alert>
  )}
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Reserva de Libros
      </Typography>

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
          </CardContent>
        </Card>
      ) : (
        <>
          <Stack spacing={2}>
            {cart.map((book) => (
              <Card
                key={book.id}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 3,
                      flexWrap: "wrap",
                    }}
                  >
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
                        {book.maxReserva}
                      </Typography>
                    </Box>

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
                        onChange={(e) =>
                          updateQuantity(
                            book.id,
                            Number(
                              e.target
                                .value
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
                              Math.min(
                                book.stock,
                                book.maxReserva
                              ),
                          },
                          (_, i) =>
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
            ))}
          </Stack>

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

              <Stack
                spacing={3}
              >
                <TextField
                  label="Fecha de retiro"
                  type="date"
                  value={fecha}
                  onChange={(e) =>
                    setFecha(
                      e.target.value
                    )
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    htmlInput: {
                      min: fechaMinima,
                    },
                  }}
                  fullWidth
                />
                        {esFinDeSemana(fecha) && (
  <Typography
    color="error"
    variant="body2"
  >
    La biblioteca no realiza
    entregas los fines de semana.
  </Typography>
)}
               <Box>

  <Typography
    mb={2}
    fontWeight={600}
  >
    Horarios disponibles
  </Typography>

                        <Box
                            sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
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
                                onClick={() =>
                                    setHora(item)
                                }
                                >
                                {item}
                                </Button>
                            )
                            )}
                        </Box>

                        </Box>

                <Divider />


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

    <Typography mt={2}>
      Ejemplares:
      {" "}
      {cart.reduce(
        (total, book) =>
          total +
          book.cantidad,
        0
      )}
    </Typography>

  </CardContent>
</Card>


<Button
  variant="contained"
  size="large"
  disabled={!puedeConfirmar}
  onClick={
    handleConfirmar
  }
>
  Confirmar Reserva
</Button>
              </Stack>
            </CardContent>
          </Card>
        </>
      )}

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