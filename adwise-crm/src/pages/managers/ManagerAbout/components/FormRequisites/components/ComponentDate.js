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
import allTranslations from "../../../../../../localization/allTranslations";
import localization from "../../../../../../localization/localization";

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
            return null
        }

        const dateSpite = value.split('.');

        if (dateSpite.length !== 3) {
            return new Date()
        }

        const date = [dateSpite[2], dateSpite[1], dateSpite[0]].join('-');

        return moment(date);
    }

    const isError = Boolean(props?.helperText && props?.error);

    return (
        <>

            <Typography className={classes.title}>{title}</Typography>

            <DatePicker
                fullWidth
                disableFuture
                openTo="year"
                name={name}
                mask="__.__.____"
                format="dd.MM.yyyy"
                views={["year", "month", "date"]}
                value={_getDate(value)}
                onChange={handleOnChangeDate}
                renderInput={(props) => <TextField variant="outlined" fullWidth {...props} helperText="" error={isError}/>}
            />

            {(!!caption && !isError) && (<Typography className={classes.caption}>{caption}</Typography>)}
            {(isError) && (<Typography className={classes.caption} style={{ color: '#e53935' }}>{allTranslations(localization.yupValidationDate)}</Typography>)}

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
    }
}));

export default ComponentDate
