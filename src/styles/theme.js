import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0F4C81",
        },
        secondary: {
            main: "#2563EB",
        },
        background: {
            default: "#F6F8FB",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#1F2937",
            secondary: "#6B7280",
        },
    },

    typography: {
        fontFamily: [
            "Poppins",
            "sans-serif"
        ].join(","),
    },

    shape: {
        borderRadius: 16,
    },

    components: {

        MuiButton: {

            styleOverrides: {

                root: {

                    textTransform: "none",

                    borderRadius: 14,

                    fontWeight: 600,

                    height: 48,

                },

            },

        },

        MuiPaper: {

            styleOverrides: {

                root: {

                    borderRadius: 20,

                },

            },

        },

        MuiCard: {

            styleOverrides: {

                root: {

                    borderRadius: 20,

                    boxShadow:
                        "0px 10px 30px rgba(0,0,0,.08)",

                },

            },

        },

        MuiTextField: {

            defaultProps: {

                variant: "outlined",

                fullWidth: true,

            },

        },

    },

});

export default theme;