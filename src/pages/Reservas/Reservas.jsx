import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { formatearFecha } from "@/utils/formatDate";
import { obtenerReservasRequest } from "@/api/reservas.api";

export default function Reservas() {

  const navigate =
    useNavigate();


  /*
   * ==========================================
   * ESTADOS
   * ==========================================
   */

  const [
    reservations,
    setReservations,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  /*
   * ==========================================
   * CARGAR RESERVAS DESDE API
   * ==========================================
   */

  useEffect(() => {

    const cargarReservas =
      async () => {

        try {

          setLoading(true);
          setError("");


          const result =
            await obtenerReservasRequest();


          /*
           * El backend devuelve:
           *
           * {
           *   success: true,
           *   data: [...]
           * }
           */

          setReservations(
            Array.isArray(
              result.data
            )
              ? result.data
              : []
          );


        } catch (error) {

          console.error(
            "Error cargando reservas:",
            error
          );


          setError(
            error.response?.data?.message ||
            error.message ||
            "No se pudieron cargar las reservas."
          );


        } finally {

          setLoading(false);

        }

      };


    cargarReservas();

  }, []);


  /*
   * ==========================================
   * COLOR DEL ESTADO
   * ==========================================
   */

  const getStatusColor =
    (estado) => {

      switch (
        String(
          estado || ""
        ).toUpperCase()
      ) {

        case "ACTIVA":
          return "success";

        case "PENDIENTE":
          return "warning";

        case "CANCELADA":
          return "error";

        case "RETIRADA":
          return "info";

        case "VENCIDA":
          return "default";

        default:
          return "default";

      }

    };


  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {

    return (

      <DashboardLayout>

        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >

          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Cargando reservas...
          </Typography>

        </Box>

      </DashboardLayout>

    );

  }


  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error) {

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


        <Alert
          severity="error"
        >
          {error}
        </Alert>

      </DashboardLayout>

    );

  }


  /*
   * ==========================================
   * PANTALLA
   * ==========================================
   */

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


      {/* ====================================== */}
      {/* SIN RESERVAS */}
      {/* ====================================== */}

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
                  navigate(
                    "/catalogo"
                  )
                }
              >
                Ir al catálogo
              </Button>

            </Box>

          </CardContent>

        </Card>

      ) : (

        /* ==================================== */
        /* LISTA */
        /* ==================================== */

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
                key={
                  reservation.id
                }
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection:
                    "column",
                }}
              >

                <CardContent
                  sx={{
                    flexGrow: 1,
                  }}
                >

                  {/* ======================== */}
                  {/* CABECERA */}
                  {/* ======================== */}

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                    flexWrap="wrap"
                  >

                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        Reserva
                      </Typography>


                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          reservation.numeroReserva ||
                          `#${reservation.id}`
                        }
                      </Typography>

                    </Box>


                    <Chip
                      label={
                        reservation.estado ||
                        "PENDIENTE"
                      }
                      color={
                        getStatusColor(
                          reservation.estado
                        )
                      }
                      size="small"
                    />

                  </Box>


                  <Divider
                    sx={{
                      my: 2,
                    }}
                  />


                  {/* ======================== */}
                  {/* FECHA */}
                  {/* ======================== */}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Fecha de retiro
                  </Typography>


                  <Typography
                    fontWeight={600}
                  >
                    {
                      formatearFecha(reservation.fechaRetiro)
                    }
                  </Typography>


                  {/* ======================== */}
                  {/* HORA */}
                  {/* ======================== */}

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
                    {
                      reservation.horaRetiro ||
                      "-"
                    }
                  </Typography>


                  {/* ======================== */}
                  {/* LIBROS */}
                  {/* ======================== */}

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

                    {Array.isArray(
                      reservation.libros
                    ) &&
                      reservation.libros.map(
                        (
                          book,
                          index
                        ) => (

                          <Box
                            key={
                              book.id ??
                              index
                            }
                            sx={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              gap: 2,
                            }}
                          >

                            <Typography>
                              {
                                book.titulo ||
                                "Libro"
                              }
                            </Typography>


                            <Typography
                              fontWeight={600}
                            >
                              x
                              {
                                book.cantidad ||
                                1
                              }
                            </Typography>

                          </Box>

                        )
                      )}

                  </Stack>


                  <Divider
                    sx={{
                      my: 2,
                    }}
                  />


                  {/* ======================== */}
                  {/* TOTAL */}
                  {/* ======================== */}

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
                        reservation.totalEjemplares ??
                        0
                      }
                    </Typography>

                  </Box>


                  {/* ======================== */}
                  {/* QR */}
                  {/* ======================== */}

                  {reservation.codigoQR &&
                    !["CANCELADA", "VENCIDA", "FINALIZADA"].includes(
                      reservation.estado
                    ) && (

                    <Alert
                      severity="success"
                      sx={{
                        mt: 2,
                      }}
                    >
                      Código QR disponible
                    </Alert>

                  )}

                </CardContent>


                {/* ========================== */}
                {/* BOTÓN */}
                {/* ========================== */}

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