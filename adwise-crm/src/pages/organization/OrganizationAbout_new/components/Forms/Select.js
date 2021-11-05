import React from "react";
import {
    Select as SelectRoot,
    Typography,
    FormControl,
    MenuItem
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";

const Select = (props) => {
    const { label, options } = props;
    const classes = useStyles();

    console.log(props)

    return (
        <>

            <Typography className={classes.title}>{ label }</Typography>

            <FormControl
                fullWidth
                variant="outlined"
            >
                <SelectRoot
                    {...props}

                    fullWidth
                    variant="outlined"
                    label=""
                >
                    {
                        options.map((option, idx) => (
                            <MenuItem key={`${props.name}-${idx}-${option.value}`} value={option.value}>{option.label}</MenuItem>
                        ))
                    }
                </SelectRoot>
            </FormControl>

        </>
    )
}

const useStyles = makeStyles(() => ({
    title: {
        fontSize: 16,
        lineHeight: '19px',
        color: "#25233E",
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 8
    }
}));

export default Select
