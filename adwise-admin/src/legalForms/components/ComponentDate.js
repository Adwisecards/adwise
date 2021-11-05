import React from "react";
import {
    Typography,

    TextField
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";

const ComponentDate = (props) => {
    const {title, name, value, placeholder, caption, onChange} = props;
    const classes = useStyles();

    const handleOnChangeDate = (event) => {
        if (!event) {
            return null
        }

        const date = moment(event).format('DD.MM.YYYY');

        const body = {
            target: {
                name: name,
                value: date
            }
        }

        onChange(body)
    }
    const _getDate = (value) => {
        if (!value) {
            return new Date()
        }

        const dateSpite = value.split('.');

        if (dateSpite.length !== 3) {
            return new Date()
        }

        const date = [dateSpite[2], dateSpite[1], dateSpite[0]].join('-');

        return moment(date);
    }

    return (
        <>

            <Typography className={classes.title}>{title}</Typography>

            <Typography variant="h5">{ moment(_getDate(value)).format('DD.MM.YYYY') }</Typography>

            {(!!caption) && (<Typography className={classes.caption}>{caption}</Typography>)}

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

export default ComponentDate
