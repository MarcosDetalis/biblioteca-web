import { useState } from "react";
import PropTypes from "prop-types";

import { Box } from "@mui/material";

import AppHeader from "@/components/Header/AppHeader";
import AppSidebar from "@/components/Sidebar/AppSidebar";
//import { drawerWidth }from "@/components/Sidebar/AppSidebar";
export default function DashboardLayout({ children }) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerOpen = () => {
        setMobileOpen(true);
    };

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };

    return (
       <Box
  sx={{
    display: "flex",
    minHeight: "100vh",
    bgcolor: "#F6F8FB"
  }}
>
  <AppSidebar
    mobileOpen={mobileOpen}
    onClose={handleDrawerClose}
  />

  <Box
    sx={{
      flexGrow: 1
    }}
  >
    <AppHeader
      onMenuClick={handleDrawerOpen}
    />

   <Box
    component="main"
    sx={{
        flexGrow: 1,
        p: 4,
        overflow: "auto"
    }}
>
      {children}
    </Box>
  </Box>
</Box>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node,
};