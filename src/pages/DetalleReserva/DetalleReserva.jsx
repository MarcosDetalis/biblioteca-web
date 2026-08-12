 import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import QRCode from "react-qr-code";

import DashboardLayout from "@/layouts/DashboardLayout";

import {
  useReservation,
} from "@/context/ReservationContext";
import { useState } from "react";
export default function DetalleReserva() {
  const { id } = useParams();

  const navigate = useNavigate();
 
  const [openCancelDialog, setOpenCancelDialog] =
  useState(false);

  const {
    reservations,
    cancelReservation,
  } = useReservation();

  const reservation =
    reservations.find(
      (item) => item.id === id
    );

  if (!reservation) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Reserva no encontrada
            </Typography>

            <Typography
              color="text.secondary"
              mt={1}
            >
              La reserva que intentas consultar
              no existe o ya no está disponible.
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() =>
                navigate("/reservas")
              }
            >
              Volver a mis reservas
            </Button>
          </CardContent>
        </Card>

        
      </DashboardLayout>

      
    );
  }

  const estadoColor = {
    ACTIVA: "success",
    CANCELADA: "error",
    RETIRADA: "info",
    VENCIDA: "warning",
  };

  const qrData = JSON.stringify({
    reserva: reservation.id,
  });

 const handleCancelar = () => {
  cancelReservation(reservation.id);

  setOpenCancelDialog(false);
};

  return (
    <DashboardLayout>

      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
        }}
      >

        <Button
          variant="text"
          onClick={() =>
            navigate("/reservas")
          }
          sx={{ mb: 2 }}
        >
          ← Volver a mis reservas
        </Button>

        <Typography
          variant="h4"
          fontWeight={700}
          mb={1}
        >
          Detalle de Reserva
        </Typography>

        <Typography
          color="text.secondary"
          mb={4}
        >
          Consulta la información de tu
          reserva y presenta el código QR
          al momento del retiro.
        </Typography>

        <Card>
          <CardContent
            sx={{ p: { xs: 2, md: 4 } }}
          >

            {/* ENCABEZADO */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Reserva #
                  {reservation.id
                    .slice(0, 8)
                    .toUpperCase()}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={0.5}
                >
                  Creada el{" "}
                  {new Date(
                    reservation.fechaCreacion
                  ).toLocaleDateString(
                    "es-PY"
                  )}
                </Typography>
              </Box>

              <Chip
                label={reservation.estado}
                color={
                  estadoColor[
                    reservation.estado
                  ] || "default"
                }
              />

            </Box>

            <Divider sx={{ my: 3 }} />

            {/* FECHA Y HORA */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 3,
              }}
            >

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Fecha de retiro
                </Typography>

                <Typography
                  fontWeight={600}
                  mt={0.5}
                >
                  {reservation.fechaRetiro}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Hora de retiro
                </Typography>

                <Typography
                  fontWeight={600}
                  mt={0.5}
                >
                  {reservation.horaRetiro}
                </Typography>
              </Box>

            </Box>

            <Divider sx={{ my: 3 }} />

            {/* LIBROS */}

            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
            >
              Libros reservados
            </Typography>

            <Stack spacing={1.5}>

              {reservation.libros.map(
                (book) => (
                  <Box
                    key={book.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      bgcolor: "#F6F8FB",
                      borderRadius: 2,
                    }}
                  >

                    <Box>
                      <Typography
                        fontWeight={600}
                      >
                        {book.titulo}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {book.autor}
                      </Typography>
                    </Box>

                    <Chip
                      label={`x${book.cantidad}`}
                      size="small"
                    />

                  </Box>
                )
              )}

            </Stack>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mt: 3,
              }}
            >

              <Typography
                color="text.secondary"
              >
                Total de ejemplares
              </Typography>

              <Typography
                fontWeight={700}
              >
                {reservation.totalEjemplares}
              </Typography>

            </Box>

            <Divider sx={{ my: 3 }} />

            {/* QR */}

            {reservation.estado ===
              "ACTIVA" && (
              <>
                <Box
                  sx={{
                    textAlign: "center",
                  }}
                >

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Código de retiro
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    mb={3}
                  >
                    Presenta este código QR
                    al retirar tus libros.
                  </Typography>

                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 2,
                      border:
                        "1px solid #E5E7EB",
                    }}
                  >
                    <QRCode
                      value={qrData}
                      size={180}
                    />
                  </Box>

                </Box>

                <Alert
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  El código QR corresponde
                  exclusivamente a esta reserva.
                </Alert>
              </>
            )}

            {/* CANCELAR */}

            {reservation.estado ===
              "ACTIVA" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  mt: 4,
                }}
              >

               <Button
                color="error"
                variant="outlined"
                onClick={() =>
                  setOpenCancelDialog(true)
                }
              >
                Cancelar reserva
              </Button>
              </Box>
            )}

            {reservation.estado ===
              "CANCELADA" && (
              <Alert
                severity="warning"
                sx={{ mt: 3 }}
              >
                Esta reserva fue cancelada.
              </Alert>
            )}

          </CardContent>
        </Card>

      </Box>


<Dialog
  open={openCancelDialog}
  onClose={() =>
    setOpenCancelDialog(false)
}
>
  <DialogTitle>
    Cancelar reserva
  </DialogTitle>

  <DialogContent>
    <DialogContentText>
      ¿Estás seguro de que deseas
      cancelar esta reserva?
    </DialogContentText>

    <DialogContentText
      sx={{ mt: 2 }}
    >
      Esta acción no se puede deshacer.
    </DialogContentText>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setOpenCancelDialog(false)
      }
    >
      Volver
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={handleCancelar}
    >
      Cancelar reserva
    </Button>
  </DialogActions>
</Dialog>
    </DashboardLayout>
  );
}