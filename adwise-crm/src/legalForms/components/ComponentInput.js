import React from "react";
import {
    Typography,

    TextField
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import clsx from "clsx";

const ComponentInput = (props) => {
    const { title, name, value, placeholder, hint, onChange } = props;
    const classes = useStyles();

    const isError = Boolean(props?.helperText && props?.error);

    return (
        <>

            <Typography className={classes.title}>{ title }</Typography>

            <TextField
                variant="outlined"

                error={isError}
                name={name}
                value={value}
                placeholder={placeholder}

                fullWidth
                onChange={onChange}
            />

            { ( Boolean(hint && !isError) ) && (<Typography className={classes.caption}>{ hint }</Typography>) }
            { ( Boolean(isError) ) && (<Typography className={clsx([classes.caption, classes.captionError])} color="error">{ props?.helperText }</Typography>) }

        </>
    )
};

const useStyles = makeStyles((theme) => ({
    title: {

        fontSize: 14,
        lineHeight: '17px',
        color: '#999DB1',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 4

    },

    input: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: '19px',
        color: '#25233E'
    },

    caption: {
        fontSize: 10,
        lineHeight: '12px',
        color: '#999DB1',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginTop: 4
    },
    captionError: {
        color: '#e53935'
    }
}));

export default ComponentInput
