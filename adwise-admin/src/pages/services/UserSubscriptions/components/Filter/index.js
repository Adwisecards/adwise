import React, {useState} from "react";
import {
    Grid,

    Typography,

    TextField,

    Button, Select, MenuItem, FormControl
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    OrganizationAutocomplete,
    TextFieldButtonClear, UserAutocomplete
} from "../../../../../components";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import {Autocomplete} from "@material-ui/lab";
import transactionTypes from "../../../../../constants/transactionTypes";
import couponTypes from "../../../../../constants/couponTypes";
import {DateRangeDelimiter, DateRangePicker} from "@material-ui/pickers";

const Filter = (props) => {
    const {filter, onSearch, onChange} = props;

    const classes = useStyles();

    const handleOnChange = ({target}) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[target.name] = target.value;

        onChange(newFilter);
    }
    const handleOnChangeDateRange = (dates) => {
        let newFilter = {...filter};

        newFilter.dateFrom = dates[0];
        newFilter.dateTo = dates[1];

        onChange(newFilter);
    }

    const handleOnClearItem = (name) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[name] = '';

        onChange(newFilter);
    }
    const handleOnClearAll = () => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;

        newFilter.invitee = '';
        newFilter.inviter = '';
        newFilter['organization._id'] = '';

        onChange(newFilter, true);
    }

    return (
        <Grid
            container
            spacing={2}

            onKeyDown={({keyCode}) => (keyCode === 13) && onSearch()}
        >

            <Grid item style={{ flex: 1 }}>

                <Grid container spacing={2}>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Приглашенный</Typography>

                        <UserAutocomplete
                            name="invitee"
                            placeholder="..."
                            value={filter["invitee"]}
                            initialValue={filter["invitee"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Приглашающий</Typography>

                        <UserAutocomplete
                            name="inviter"
                            placeholder="..."
                            value={filter["inviter"]}
                            initialValue={filter["inviter"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Организация</Typography>

                        <OrganizationAutocomplete
                            name="organization._id"
                            placeholder="..."
                            value={filter["organization._id"]}
                            initialValue={filter["organization._id"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Временной промежуток</Typography>

                        <DateRangePicker
                            calendars={3}
                            value={[filter.dateFrom, filter.dateTo]}
                            onChange={handleOnChangeDateRange}
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField margin="normal" {...startProps} label="" helperText="" placeholder="01.01.2020" fullWidth/>
                                    <DateRangeDelimiter> По </DateRangeDelimiter>
                                    <TextField margin="normal" {...endProps} label="" helperText="" placeholder="01.01.2020" fullWidth/>
                                </React.Fragment>
                            )}
                        />

                    </Grid>

                </Grid>

            </Grid>

            <Grid item>

                <Grid container spacing={2}>

                    <Grid item>
                        <Typography variant="formTitle">&#160;</Typography>

                        <Button className={classes.button} variant="contained" size="small" onClick={onSearch}>Поиск</Button>
                    </Grid>

                    <Grid item>
                        <Typography variant="formTitle">&#160;</Typography>

                        <Button className={classes.button} variant="outlined" size="small" onClick={handleOnClearAll}>Сбросить</Button>
                    </Grid>

                </Grid>

            </Grid>

        </Grid>
    )
};

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(2),
        padding: '1px 24px'
    }
}));

export default Filter
