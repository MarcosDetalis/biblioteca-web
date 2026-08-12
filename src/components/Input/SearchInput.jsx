import PropTypes from "prop-types";

import SearchIcon
from "@mui/icons-material/Search";

import {
    InputAdornment
} from "@mui/material";

import TextInput
from "./TextInput";

export default function SearchInput({
    ...props
}) {
    return (
        <TextInput
            placeholder="Buscar libro..."
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment
                            position="start"
                        >
                            <SearchIcon />
                        </InputAdornment>
                    )
                }
            }}
            {...props}
        />
    );
}

SearchInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};