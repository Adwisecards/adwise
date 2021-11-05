import React from "react";
import {
    Typography,

    TextField
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";

const ComponentPhone = (props) => {
    const { title, name, value, placeholder, caption, onChange } = props;
    const classes = useStyles();

    return (
        <>

            <Typography className={classes.title}>{ title }</Typography>

            <TextField
                variant="outlined"

                name={name}
                value={value}
                placeholder={placeholder}

                fullWidth
                onChange={onChange}
            />

            { ( !!caption ) && (<Typography className={classes.caption}>{ caption }</Typography>) }

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
    }
}));

export default ComponentPhone
