import React from "react";
import {
    Typography,

    TextField, FormControl, Select, MenuItem
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import clsx from "clsx";

const ComponentSelect = (props) => {
    const { title, name, value, placeholder, hint, error, options, onChange } = props;
    const classes = useStyles();

    return (
        <>

            <Typography className={classes.title}>{ title }</Typography>

            <FormControl variant="outlined" fullWidth>
                <Select
                    value={value}
                    error={error}
                    name={name}
                    onChange={onChange}
                >
                    {
                        options.map((option, idx) => {
                            const { value, title } = option;
                            return (
                                <MenuItem key={`select-${name}-${idx}-${value}`} value={value}>{title}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>

            { ( Boolean(hint && !error) ) && (<Typography className={classes.caption}>{ hint }</Typography>) }
            { ( Boolean(error) ) && (<Typography className={clsx([classes.caption, classes.captionError])} color="error">{ props?.helperText }</Typography>) }

        </>
    )
};

const useStyles = makeStyles((theme) => ({
    title: {

        fontSize: 19,
        lineHeight: '19px',
        color: '#25233E',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 9

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

export default ComponentSelect
