import { forwardRef, useState } from "react";
import PropTypes from "prop-types";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordField = forwardRef(
({ label = "Contraseña", ...props }, ref) => {


    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            {...props}
            inputRef={ref}
            label={label}
            type={showPassword ? "text" : "password"}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            edge="end"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <VisibilityOff />
                            ) : (
                                <Visibility />
                            )}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}


);

PasswordField.displayName = "PasswordField";

PasswordField.propTypes = {
label: PropTypes.string,
};

export default PasswordField;
