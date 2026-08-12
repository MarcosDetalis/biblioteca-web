import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/poppins";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "@/styles/theme";

import "@/styles/global.css";

import App from "./App";
import { AuthProvider } from "@/context/AuthContext";
import {
  ReservationProvider,
} from "@/context/ReservationContext";
import {
  ReservationCartProvider,
} from "@/context/ReservationCartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>

        <ThemeProvider theme={theme}>

            <CssBaseline />
<AuthProvider>
  <ReservationProvider>
    <ReservationCartProvider>
      <App />
    </ReservationCartProvider>
  </ReservationProvider>
</AuthProvider>

        </ThemeProvider>

    </React.StrictMode>
); 