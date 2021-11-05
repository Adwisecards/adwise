import React from "react";
import {IconButton, InputAdornment} from "@material-ui/core";
import {X as XIcon} from "react-feather";

const TextFieldButtonClear = (props) => {
    const { name, value, onClick } = props;

    if (!value){
        return null
    }

    const handleOnClear = () => {
        onClick(name)
    }

    return (
        <InputAdornment position="end">
            <IconButton onClick={handleOnClear}><XIcon size={20} color="#8152E4"/></IconButton>
        </InputAdornment>
    )
};

export default TextFieldButtonClear