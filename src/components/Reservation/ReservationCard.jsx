import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Divider,
} from "@mui/material";

import QRCode from "react-qr-code";

export default function ReservationCard({
  reservation,
}) {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Reserva  #
  {reservation.id.slice(0, 8)}
        </Typography>

        <Typography
          color="text.secondary"
        >
          {reservation.fechaRetiro}
          {" - "}
          {reservation.horaRetiro}
        </Typography>

        <Box mt={2}>
          <Chip
            label={reservation.estado}
            color={
              reservation.estado ===
              "ACTIVA"
                ? "success"
                : "error"
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          fontWeight={700}
          mb={1}
        >
          Libros reservados
        </Typography>

        {reservation.libros.map(
          (book) => (
            <Typography
              key={book.id}
              variant="body2"
              sx={{ mb: 1 }}
            >
              • {book.titulo}
              {" "}
              x
              {book.cantidad}
            </Typography>
          )
        )}

        <Typography
          mt={2}
          color="text.secondary"
        >
          Total de ejemplares:
          {" "}
          {reservation.totalEjemplares}
        </Typography>

        <Box
          mt={3}
          sx={{
            display: "flex",
            justifyContent:
              "center",
            background: "white",
            p: 2,
            borderRadius: 2,
          }}
        >
          <QRCode
            value={JSON.stringify({
              id:
                reservation.id,
              fecha:
                reservation.fechaRetiro,
              hora:
                reservation.horaRetiro,
            })}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

ReservationCard.propTypes = {
  reservation:
    PropTypes.object,
};