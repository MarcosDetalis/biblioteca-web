import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";

import {
  useReservation,
} from "@/context/ReservationContext";

export default function Reservas() {
  const navigate = useNavigate();

  const {
    reservations,
  } = useReservation();

  const getStatusColor = (estado) => {
    switch (estado) {
      case "ACTIVA":
        return "success";

      case "CANCELADA":
        return "error";

      case "RETIRADA":
        return "info";

      case "VENCIDA":
        return "warning";

      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        Mis Reservas
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Consulta tus reservas de libros
        y su estado actual.
      </Typography>

      {reservations.length === 0 ? (
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              textAlign="center"
            >
              No tienes reservas
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              mt={1}
            >
              Cuando realices una reserva,
              aparecerá aquí.
            </Typography>

            <Box
              display="flex"
              justifyContent="center"
              mt={3}
            >
              <Button
                variant="contained"
                onClick={() =>
                  navigate("/catalogo")
                }
              >
                Ir al catálogo
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
          }}
        >
          {reservations.map(
            (reservation) => (
              <Card
                key={reservation.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                  }}
                >

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      Reserva #
                      {reservation.id.slice(
                        0,
                        8
                      ).toUpperCase()}
                    </Typography>

                    <Chip
                      label={
                        reservation.estado
                      }
                      color={getStatusColor(
                        reservation.estado
                      )}
                      size="small"
                    />
                  </Box>

                  <Divider
                    sx={{ my: 2 }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Fecha de retiro
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {reservation.fechaRetiro}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={2}
                  >
                    Hora de retiro
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {reservation.horaRetiro}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={2}
                  >
                    Libros reservados
                  </Typography>

                  <Stack
                    spacing={1}
                    mt={1}
                  >
                    {reservation.libros.map(
                      (book) => (
                        <Box
                          key={book.id}
                          sx={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            gap: 2,
                          }}
                        >
                          <Typography>
                            {book.titulo}
                          </Typography>

                          <Typography
                            fontWeight={600}
                          >
                            x{book.cantidad}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Stack>

                  <Divider
                    sx={{ my: 2 }}
                  />

                  <Box
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography
                      color="text.secondary"
                    >
                      Total de ejemplares
                    </Typography>

                    <Typography
                      fontWeight={700}
                    >
                      {
                        reservation.totalEjemplares
                      }
                    </Typography>
                  </Box>

                </CardContent>

                <Box
                  sx={{
                    px: 2,
                    pb: 2,
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        `/reservas/${reservation.id}`
                      )
                    }
                  >
                    Ver detalle
                  </Button>
                </Box>

              </Card>
            )
          )}
        </Box>
      )}

    </DashboardLayout>
  );
}