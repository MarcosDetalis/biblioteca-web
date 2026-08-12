import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar
} from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useReservationCart } from "@/context/ReservationCartContext";
import { useNavigate } from "react-router-dom";
export default function AppHeader({
  onMenuClick
}) {
  const { user } = useAuth();
  const { cart } = useReservationCart();
  const navigate = useNavigate();

  return (
   <AppBar
    position="sticky"
    elevation={0}
    sx={{
        background: "#0F4C81"
    }}
>
      <Toolbar>
        <IconButton
          color="inherit"
          sx={{
            mr: 2,
            display: {
              xs: "flex",
              md: "none"
            }
          }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

                  <Typography
                variant="h6"
                fontWeight={700}
            >
                📚 Biblioteca UNINORTE
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton
                color="inherit"
                onClick={() =>
                    navigate("/carrito")
                }
                sx={{
                    mr: 2
                }}
            >
                <Badge
                    badgeContent={cart.length}
                    color="error"
                    invisible={cart.length === 0}
                >
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>

            <Avatar
                sx={{
                    bgcolor: "#2563EB",
                    mr: 1
                }}
            >
                {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>

            <Typography>
                {user?.nombre || "Invitado"}
            </Typography>
      </Toolbar>
    </AppBar>
  );
}

AppHeader.propTypes = {
  onMenuClick: PropTypes.func
};