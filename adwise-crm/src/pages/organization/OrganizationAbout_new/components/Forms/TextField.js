import React from "react";
import {
    TextField as TextFieldRoot,
    Typography,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";

const TextField = (props) => {
    const { label } = props;
    const classes = useStyles();

    return (
        <>

            <Typography className={classes.title}>{ label }</Typography>

            <TextFieldRoot
                {...props}

                fullWidth
                variant="outlined"
                label=""
            />

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

export default TextField
