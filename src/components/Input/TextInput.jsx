import { forwardRef } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const TextInput = forwardRef(
({ label, ...props }, ref) => {
return (
<TextField
{...props}
inputRef={ref}
label={label}
fullWidth
/>
);
}
);

TextInput.displayName = "TextInput";

TextInput.propTypes = {
label: PropTypes.string,
};

export default TextInput;
