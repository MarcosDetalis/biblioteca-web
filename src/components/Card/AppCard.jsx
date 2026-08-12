import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

export default function AppCard({
    children,
    ...props
}) {
    return (
        <Paper
            elevation={0}
            {...props}
            sx={{
                width: "100%",
                maxWidth: 430,
                p: 5,
                borderRadius: 5,
                background:
                    "rgba(255,255,255,.95)",
                backdropFilter:
                    "blur(20px)",
                boxShadow:
                    "0 20px 60px rgba(0,0,0,.12)",
                ...(props.sx || {}),
            }}
        >
            {children}
        </Paper>
    );
}

AppCard.propTypes = {
    children: PropTypes.node,
     sx: PropTypes.object,
};