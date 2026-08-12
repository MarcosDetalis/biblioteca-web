import PropTypes from "prop-types";
import {Drawer,
Toolbar,
Box,
List,
ListItemButton,
ListItemIcon,
ListItemText,
Typography,
Divider
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const drawerWidth = 260;

export default function AppSidebar({
mobileOpen,
onClose
}) {


const navigate = useNavigate();
const location = useLocation();

const { logout } = useAuth();

const menuItems = [
    {
        text: "Inicio",
        icon: <HomeIcon />,
        path: "/home"
    },
    {
        text: "Catálogo",
        icon: <MenuBookIcon />,
        path: "/catalogo"
    },
    {
        text: "Mis Reservas",
        icon: <BookmarkIcon />,
        path: "/reservas"
    },
    {
        text: "Perfil",
        icon: <PersonIcon />,
        path: "/perfil"
    }
];

const drawerContent = (
    <>
        <Toolbar>

            <Typography
                variant="h6"
                fontWeight={700}
            >
                📚 Biblioteca
            </Typography>

        </Toolbar>

        <Divider />

        <List>

            {menuItems.map((item) => (

                <ListItemButton
                    key={item.text}
                    selected={
                        location.pathname === item.path
                    }
                    onClick={() =>
                        navigate(item.path)
                    }
                >

                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>

                    <ListItemText
                        primary={item.text}
                    />

                </ListItemButton>

            ))}

        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <List>

            <ListItemButton
                onClick={() => {

                    logout();

                    navigate("/login");

                }}
            >

                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>

                <ListItemText
                    primary="Cerrar Sesión"
                />

            </ListItemButton>

        </List>
    </>
);

return (
    <>
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={onClose}
            sx={{
                display: {
                    xs: "block",
                    md: "none"
                },
                "& .MuiDrawer-paper": {
                    width: drawerWidth
                }
            }}
        >
            {drawerContent}
        </Drawer>

     <Drawer
    variant="permanent"
    open
    sx={{
        display: {
            xs: "none",
            md: "block"
        },
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column"
        }
    }}
>
            {drawerContent}
        </Drawer>
    </>
);
 

}

AppSidebar.propTypes = {
mobileOpen: PropTypes.bool,
onClose: PropTypes.func
};
