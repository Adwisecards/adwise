import React, {useState } from "react";
import {
    Box,
    Typography,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
} from "material-ui-pickers3";
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import moment from "moment";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const DatePicker = (props) => {
    const { title, color, value, name, onChange } = props;
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleOnChange = (value) => {
        onChange({
            target: {
                name,
                value
            }
        })
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>

            <Box className={classes.buttonDate} onClick={() => setOpen(true)}>

                <Typography className={classes.buttonDateTitle}>{ title }</Typography>

                {
                    Boolean(value) && (
                        <Typography className={classes.buttonDateValue}>: {moment(value).format('DD MMMM HH:mm')}</Typography>
                    )
                }

                <Box ml={1}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.7273 1.33331H11.4546V0H10.1818V3.33334H8.90908V1.33334H5.09089V0H3.81818V3.33334H2.54545V1.33334H1.27274C0.570819 1.33331 0 1.932 0 2.66666V12.6667C0 13.4013 0.570819 14 1.27274 14H12.7273C13.4292 14 14 13.4013 14 12.6667V2.66666C14 1.93131 13.4292 1.33331 12.7273 1.33331ZM4.45454 12H1.90909V9.33334H4.45454V12ZM4.45454 8H1.90909V5.33334H4.45454V8ZM8.27272 12H5.72728V9.33334H8.27272V12ZM8.27272 8H5.72728V5.33334H8.27272V8ZM12.0909 8H9.54546V5.33334H12.0909V8Z"
                            fill={ color }
                        />
                    </svg>
                </Box>

            </Box>

            <KeyboardDateTimePicker
                open={open}
                hideTabs={true}
                variant="dialog"
                value={value}
                name={name}
                onChange={handleOnChange}
                TextFieldComponent={() => (<></>)}
                onClose={() => setOpen(false)}
                ampm={false}

                okLabel={allTranslations(localization.billsFilterDateOk)}
                cancelLabel={allTranslations(localization.billsFilterDateCancel)}
            />

        </MuiPickersUtilsProvider>
    )
}

const useStyles = makeStyles((theme) => ({

    buttonDate: {

        display: 'flex',
        alignItems: 'center',

        cursor: 'pointer',

        padding: '12px 16px',
        backgroundColor: '#EDE3FE',
        borderRadius: 5


    },
    buttonDateTitle: {

        fontSize: 14,
        lineHeight: '16px',
        color: '#000000'

    },
    buttonDateValue: {
        fontSize: 14,
        lineHeight: '16px',
        fontWeight: '500',
        color: '#000000'
    },
    buttonDateIcon: {}

}));

export default DatePicker
