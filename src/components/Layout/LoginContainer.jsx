import { Paper } from "@mui/material";
import PropTypes from "prop-types";

export default function LoginContainer({ children }) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                maxWidth: 1050,
                borderRadius: 6,
                overflow: "hidden",
                display: "flex",
                minHeight: 650,
                backdropFilter: "blur(20px)",
                background: "rgba(255,255,255,.95)",
                boxShadow: "0 25px 60px rgba(0,0,0,.18)",
            }}
        >
            {children}
        </Paper>
    );
}

LoginContainer.propTypes = {
    children: PropTypes.node,
};