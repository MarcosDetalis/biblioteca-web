import Box from "@mui/material/Box";
import Background from "./Background";
import PropTypes from "prop-types";
export default function PageContainer({ children }) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg,#0F4C81,#2563EB)",
                overflow: "hidden",
                position: "relative",
                p: 3,
            }}
        >
            <Background />

            {children}
        </Box>
    );
}
PageContainer.propTypes = {
    children: PropTypes.node.isRequired  
};