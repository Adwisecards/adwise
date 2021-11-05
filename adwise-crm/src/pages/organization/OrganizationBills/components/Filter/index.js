import React from "react";
import {
    Box,
    Grid,
    Button,
    Typography
} from "@material-ui/core";
import DatePicker from "./DatePicker";
import {makeStyles} from "@material-ui/styles";
import clsx from "clsx";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import {
    ClientAutocomplete,
    CashierAutocomplete
} from "../../../../../components";

const Filter = (props) => {
    const { filter, onChange } = props;
    const classes = useStyles();

    const handleOnChange = ({ target }) => {
        const { name, value } = target;

        let newFilter = {...filter};
        newFilter[name] = value;
        newFilter.page = 1;

        onChange(newFilter, true);
    }
    const handleOnClear = () => {
        let newFilter = {...filter};

        newFilter.page = 1;
        newFilter['purchaserContactId'] = "";
        newFilter['cashierContactId'] = "";
        newFilter.dateFrom = "";
        newFilter.dateTo = "";

        onChange(newFilter, true);
    }

    const handleOnChangeStatus = () => {
        let newFilter = {...filter};

        newFilter['types[]'] = Boolean(filter['types[]']) ? '' : 'archived';
        newFilter.page = 1;

        onChange(newFilter, true)
    }

    return (
        <>

            <Grid container justify="space-between" wrap="nowrap">

                <Grid item>

                    <Grid container spacing={2}>

                        <Grid item>

                            <DatePicker
                                title={allTranslations(localization.billsFilterDateFrom)}
                                color="#ED8E00"
                                value={filter.dateFrom}
                                name="dateFrom"
                                onChange={handleOnChange}
                            />

                        </Grid>

                        <Grid item>

                            <DatePicker
                                title={allTranslations(localization.billsFilterDateTo)}
                                color="#8152E4"
                                value={filter.dateTo}
                                name="dateTo"
                                onChange={handleOnChange}
                            />

                        </Grid>

                        <Grid item>

                            <Box width={300} className={classes.clients}>
                                <ClientAutocomplete
                                    value={filter['purchaserContactId']}
                                    name="purchaserContactId"
                                    placeholder="ФИО клиента"
                                    onChange={handleOnChange}
                                />
                            </Box>

                        </Grid>

                        <Grid item>

                            <Box width={300} className={classes.clients}>
                                <CashierAutocomplete
                                    value={filter['cashierContactId']}
                                    name="cashierContactId"
                                    placeholder="ФИО сотрудника"
                                    onChange={handleOnChange}
                                />
                            </Box>

                        </Grid>

                        <Grid item>

                            <Button variant="outlined" className={classes.buttonClear} onClick={handleOnClear}>
                                <Typography className={classes.buttonClearTitle}>{allTranslations(localization.billsFilterButtonCreate)}</Typography>
                            </Button>

                        </Grid>

                    </Grid>

                </Grid>

                <Grid item>

                    <Button
                        className={clsx({
                            [classes.buttonStatus]: true,
                            [classes.buttonStatusGreen]: Boolean(filter['types[]']),
                        })}
                        onClick={handleOnChangeStatus}
                    >
                        { Boolean(filter['types[]']) ? allTranslations(localization.billsFilterAllPurchases) : allTranslations(localization.billsFilterArchivedPurchases) }

                        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: 10}}>
                            <path d="M5.61644 0L0.383562 0.000453949C0.153425 0.000453949 0 0.153879 0 0.384016V13.6169C0 13.847 0.153425 14.0005 0.383562 14.0005L5.61644 14C5.84658 14 6 13.8466 6 13.6164V0.383562C6 0.153425 5.80822 0 5.61644 0ZM2.97 11.8909C2.31794 11.8909 1.81931 11.3922 1.81931 10.7402C1.81931 10.0881 2.31794 9.58949 2.97 9.58949C3.62205 9.58949 4.12068 10.0881 4.12068 10.7402C4.12068 11.3922 3.58369 11.8909 2.97 11.8909ZM3.81383 4.67991H2.12616C1.85767 4.67991 1.66589 4.44977 1.66589 4.18128C1.66589 3.91278 1.89602 3.68265 2.12616 3.68265H3.81383C4.08232 3.68265 4.31246 3.91278 4.31246 4.18128C4.27411 4.48813 4.08232 4.67991 3.81383 4.67991ZM3.81383 2.7621H2.12616C1.85767 2.7621 1.62753 2.57032 1.62753 2.30182C1.62753 2.03333 1.85767 1.84155 2.0878 1.84155H3.77548C4.08232 1.80319 4.27411 2.03333 4.27411 2.30182C4.27411 2.57032 4.08232 2.7621 3.81383 2.7621Z" fill="#FF0000"/>
                            <path d="M12.6164 0L7.38356 0.000453949C7.15342 0.000453949 7 0.153879 7 0.384016V13.6169C7 13.847 7.15342 14.0005 7.38356 14.0005L12.6164 14C12.8466 14 13 13.8466 13 13.6164V0.383562C13 0.153425 12.8082 0 12.6164 0ZM9.97 11.8909C9.31794 11.8909 8.81931 11.3922 8.81931 10.7402C8.81931 10.0881 9.31794 9.58949 9.97 9.58949C10.6221 9.58949 11.1207 10.0881 11.1207 10.7402C11.1207 11.3922 10.5837 11.8909 9.97 11.8909ZM10.8138 4.67991H9.12616C8.85767 4.67991 8.66589 4.44977 8.66589 4.18128C8.66589 3.91278 8.89602 3.68265 9.12616 3.68265H10.8138C11.0823 3.68265 11.3125 3.91278 11.3125 4.18128C11.2741 4.48813 11.0823 4.67991 10.8138 4.67991ZM10.8138 2.7621H9.12616C8.85767 2.7621 8.62753 2.57032 8.62753 2.30182C8.62753 2.03333 8.85767 1.84155 9.0878 1.84155H10.7755C11.0823 1.80319 11.2741 2.03333 11.2741 2.30182C11.2741 2.57032 11.0823 2.7621 10.8138 2.7621Z" fill="#FF0000"/>
                        </svg>
                    </Button>

                </Grid>


            </Grid>

        </>
    )
}

const useStyles = makeStyles((theme) => ({

    buttonClear: {
        height: 46,

        display: 'flex',
        alignItems: 'center',

        cursor: 'pointer',

        padding: '12px 16px',
        borderColor: '#EDE3FE',
        borderRadius: 5


    },
    buttonClearTitle: {

        fontSize: 14,
        lineHeight: '16px',
        fontWeight: '500',
        color: '#8152E4'

    },

    buttonStatus: {
        display: 'flex',
        alignItems: 'center',

        cursor: 'pointer',

        minHeight: "initial",
        padding: '12px 16px',
        backgroundColor: '#ffd9d9',
        borderRadius: 5,

        fontSize: 14,
        lineHeight: '16px',
        fontWeight: "normal",
        color: '#000000'
    },
    buttonStatusGreen: {
        backgroundColor: '#d1ddcb'
    },

    clients: {
        '& .MuiInputBase-root': {
            padding: '11px 8px!important'
        }
    }
}));

export default Filter
