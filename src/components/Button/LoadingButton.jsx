import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import AppButton from "./AppButton";

export default function LoadingButton({
    loading,
    children,
    ...props
}) {
    return (
        <AppButton
            disabled={loading}
            {...props}
        >
            {loading ? (
                <CircularProgress
                    size={24}
                    color="inherit"
                />
            ) : (
                children
            )}
        </AppButton>
    );
}

LoadingButton.propTypes = {
    loading: PropTypes.bool,
    children: PropTypes.node,
};