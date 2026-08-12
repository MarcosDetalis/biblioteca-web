import Button from "@mui/material/Button";
import PropTypes from "prop-types";

export default function AppButton({
    children,
    onClick,
    type = "button",
    color = "primary",
    fullWidth = true,
    disabled = false,
}) {
    return (
        <Button
            variant="contained"
            color={color}
            type={type}
            fullWidth={fullWidth}
            disabled={disabled}
            onClick={onClick}
            sx={{
                height: 52,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: 16,
                boxShadow: "0 8px 20px rgba(15,76,129,.25)",
                transition: ".3s",

                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 25px rgba(15,76,129,.35)",
                },
            }}
        >
            {children}
        </Button>
    );
}
AppButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    color: PropTypes.string,
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
};