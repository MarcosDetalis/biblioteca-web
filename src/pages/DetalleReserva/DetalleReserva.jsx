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
  CircularProgress,
} from "@mui/material";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import QRCode from "react-qr-code";

import DashboardLayout from "@/layouts/DashboardLayout";
import { formatearFecha } from "@/utils/formatDate";
import {
  obtenerReservaPorIdRequest,
  cancelarReservaRequest,
} from "@/api/reservas.api";


export default function DetalleReserva() {

  const { id } = useParams();

  const navigate =
    useNavigate();


  /*
   * ==========================================
   * ESTADOS
   * ==========================================
   */

  const [
    reservation,
    setReservation,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  const [
    openCancelDialog,
    setOpenCancelDialog,
  ] = useState(false);


  const [
    cancelando,
    setCancelando,
  ] = useState(false);


  /*
   * ==========================================
   * CARGAR RESERVA DESDE BACKEND
   * ==========================================
   */

  useEffect(() => {

    const cargarReserva =
      async () => {

        try {

          setLoading(true);

          setError("");


          const result =
            await obtenerReservaPorIdRequest(id);


          /*
           * Backend:
           *
           * {
           *   success: true,
           *   data: {...}
           * }
           */

          const data =
            result?.data;


          if (!data) {

            throw new Error(
              "El servidor no devolvió los datos de la reserva."
            );

          }


          setReservation(data);


        } catch (error) {

          console.error(
            "Error obteniendo reserva:",
            error
          );


          setError(
            error.response?.data?.message ||
            error.message ||
            "No se pudo cargar la reserva."
          );


        } finally {

          setLoading(false);

        }

      };


    if (id) {

      cargarReserva();

    }

  }, [id]);


  /*
   * ==========================================
   * COLORES DEL ESTADO
   * ==========================================
   */

  const estadoColor = {

    ACTIVA: "success",

    PENDIENTE: "warning",

    CANCELADA: "error",

    RETIRADA: "info",

    VENCIDA: "default",

  };


  /*
   * ==========================================
   * CANCELAR RESERVA
   * ==========================================
   *
   * La cancelación ahora se realiza
   * directamente contra el backend.
   */

  const handleCancelar = async () => {

    if (!reservation) {

      return;

    }


    try {

      setCancelando(true);

      setError("");


      /*
       * ========================================
       * LLAMAR AL BACKEND
       * ========================================
       */

      const result =
        await cancelarReservaRequest(
          reservation.id
        );


      /*
       * ========================================
       * ACTUALIZAR PANTALLA
       * ========================================
       */

      setReservation(
        (prev) => ({
          ...prev,

          estado:
            result?.data?.estado ||
            "CANCELADA",
        })
      );


      /*
       * CERRAR DIALOG
       */

      setOpenCancelDialog(false);


    } catch (error) {

      console.error(
        "Error cancelando reserva:",
        error
      );


      setError(
        error.response?.data?.message ||
        error.message ||
        "No se pudo cancelar la reserva."
      );


    } finally {

      setCancelando(false);

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
            minHeight: 400,

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexDirection:
              "column",

            gap: 2,
          }}
        >

          <CircularProgress />


          <Typography
            color="text.secondary"
          >
            Cargando reserva...
          </Typography>

        </Box>

      </DashboardLayout>

    );

  }


  /*
   * ==========================================
   * ERROR / NO ENCONTRADA
   * ==========================================
   */

  if (
    error ||
    !reservation
  ) {

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
              {error ||
                "La reserva que intentas consultar no existe o ya no está disponible."
              }
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


  /*
   * ==========================================
   * QR
   * ==========================================
   */

  const qrData =
    reservation.codigoQR;


  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (

    <DashboardLayout>

      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
        }}
      >

        {/* ==================================== */}
        {/* VOLVER */}
        {/* ==================================== */}

        <Button
          variant="text"
          onClick={() =>
            navigate("/reservas")
          }
          sx={{
            mb: 2,
          }}
        >
          ← Volver a mis reservas
        </Button>


        {/* ==================================== */}
        {/* TITULO */}
        {/* ==================================== */}

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


        {/* ==================================== */}
        {/* ERROR DE CANCELACIÓN */}
        {/* ==================================== */}

        {error && (

          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>

        )}


        <Card>

          <CardContent
            sx={{
              p: {
                xs: 2,
                md: 4,
              },
            }}
          >

            {/* ================================ */}
            {/* ENCABEZADO */}
            {/* ================================ */}

            <Box
              sx={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                gap: 2,

                flexWrap:
                  "wrap",
              }}
            >

              <Box>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Reserva #{" "}
                  {reservation.numeroReserva ||
                    reservation.id
                  }
                </Typography>


                {reservation.fechaCreacion && (

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

                )}

              </Box>


              <Chip
                label={
                  reservation.estado ||
                  "PENDIENTE"
                }
                color={
                  estadoColor[
                    reservation.estado
                  ] || "default"
                }
              />

            </Box>


            <Divider
              sx={{
                my: 3,
              }}
            />


            {/* ================================ */}
            {/* FECHA Y HORA */}
            {/* ================================ */}

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
                  {
                    formatearFecha(reservation.fechaRetiro)
                  }
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
                  {
                    reservation.horaRetiro ||
                    "-"
                  }
                </Typography>

              </Box>

            </Box>


            <Divider
              sx={{
                my: 3,
              }}
            />


            {/* ================================ */}
            {/* LIBROS */}
            {/* ================================ */}

            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
            >
              Libros reservados
            </Typography>


            <Stack spacing={1.5}>

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
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "center",

                        gap: 2,

                        p: 2,

                        bgcolor:
                          "#F6F8FB",

                        borderRadius: 2,
                      }}
                    >

                      <Box>

                        <Typography
                          fontWeight={600}
                        >
                          {
                            book.titulo
                          }
                        </Typography>


                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {
                            book.autor
                          }
                        </Typography>

                      </Box>


                      <Chip
                        label={
                          `x${book.cantidad}`
                        }
                        size="small"
                      />

                    </Box>

                  )
                )}

            </Stack>


            {/* ================================ */}
            {/* TOTAL */}
            {/* ================================ */}

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
                {
                  reservation.totalEjemplares ??
                  0
                }
              </Typography>

            </Box>


            <Divider
              sx={{
                my: 3,
              }}
            />


            {/* ================================ */}
            {/* QR */}
            {/* ================================ */}

            {reservation.estado !==
              "CANCELADA" && (

              <>

                <Box
                  sx={{
                    textAlign:
                      "center",
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
                      display:
                        "inline-flex",

                      p: 2,

                      bgcolor:
                        "white",

                      borderRadius: 2,

                      border:
                        "1px solid #E5E7EB",
                    }}
                  >

                    <QRCode
                      value={
                        qrData ||
                        String(
                          reservation.id
                        )
                      }
                      size={200}
                    />

                  </Box>

                </Box>


                <Alert
                  severity="info"
                  sx={{
                    mt: 3,
                  }}
                >
                  El código QR corresponde
                  exclusivamente a esta
                  reserva.
                </Alert>

              </>

            )}


            {/* ================================ */}
            {/* CANCELAR */}
            {/* ================================ */}

            {reservation.estado ===
              "PENDIENTE" && (

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
                    setOpenCancelDialog(
                      true
                    )
                  }
                  disabled={cancelando}
                >
                  Cancelar reserva
                </Button>

              </Box>

            )}


            {/* ================================ */}
            {/* RESERVA CANCELADA */}
            {/* ================================ */}

            {reservation.estado ===
              "CANCELADA" && (

              <Alert
                severity="warning"
                sx={{
                  mt: 3,
                }}
              >
                Esta reserva fue cancelada.
              </Alert>

            )}

          </CardContent>

        </Card>


        {/* ==================================== */}
        {/* DIALOG CANCELACIÓN */}
        {/* ==================================== */}

        <Dialog
          open={openCancelDialog}
          onClose={() => {

            if (!cancelando) {

              setOpenCancelDialog(
                false
              );

            }

          }}
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
              sx={{
                mt: 2,
              }}
            >
              Esta acción no se puede
              deshacer.
            </DialogContentText>


            {error && (

              <Alert
                severity="error"
                sx={{
                  mt: 2,
                }}
              >
                {error}
              </Alert>

            )}

          </DialogContent>


          <DialogActions>

            <Button
              onClick={() =>
                setOpenCancelDialog(
                  false
                )
              }
              disabled={cancelando}
            >
              Volver
            </Button>


            <Button
              color="error"
              variant="contained"
              onClick={
                handleCancelar
              }
              disabled={cancelando}
            >

              {cancelando
                ? (
                  <>
                    <CircularProgress
                      size={18}
                      color="inherit"
                      sx={{
                        mr: 1,
                      }}
                    />

                    Cancelando...
                  </>
                )
                : (
                  "Cancelar reserva"
                )
              }

            </Button>

          </DialogActions>

        </Dialog>

      </Box>

    </DashboardLayout>

  );

}