import React from "react";
import {
    Typography,

    TextField
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";

const ComponentInput = (props) => {
    const { title, name, value, placeholder, hint, onChange } = props;
    const classes = useStyles();

    return (
        <>

            <Typography className={classes.title}>{ title }</Typography>

            <Typography variant="h5">{ value || 'Не заполнено' }</Typography>

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

export default ComponentInput
