import React, {useState} from "react";
import {
    Grid,

    Typography,

    TextField,

    Button, Select, MenuItem, FormControl, Paper, Collapse, Checkbox, FormControlLabel
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    CouponAutocomplete,
    OrganizationAutocomplete,
    TextFieldButtonClear, UserAutocomplete,
} from "../../../../../components";
import currency from "../../../../../constants/currency";
import transactionTypes from "../../../../../constants/transactionTypes";
import paymentTypes from "../../../../../constants/paymentTypes";
import originTypes from "../../../../../constants/originTypes";
import {DateRangeDelimiter, DateRangePicker} from "@material-ui/pickers";
import referralCodeMode from "../../../../../constants/referralCodeMode";
import referralCodeType from "../../../../../constants/referralCodeType";

const Filter = (props) => {
    const {filter, onSearch, onChange} = props;

    const [isOpenMoreFilter, setOpenMoreFilter] = useState(false);

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

        newFilter['subscription.parent._id'] = "";
        newFilter['subscription.subscriber._id'] = "";
        newFilter['organization._id'] = "";
        newFilter['coupon._id'] = "";
        newFilter['dateFrom'] = "";
        newFilter['dateTo'] = "";

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

                        <Typography variant="formTitle">????????????????</Typography>

                        <UserAutocomplete
                            name="subscription.parent._id"
                            placeholder="..."
                            value={filter["subscription.parent._id"]}
                            initialValue={filter["subscription.parent._id"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">??????????????????</Typography>

                        <UserAutocomplete
                            name="subscription.subscriber._id"
                            placeholder="..."
                            value={filter["subscription.subscriber._id"]}
                            initialValue={filter["subscription.subscriber._id"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">??????????????????????</Typography>

                        <OrganizationAutocomplete
                            name="organization._id"
                            placeholder="..."
                            value={filter["organization._id"]}
                            initialValue={filter["organization._id"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">??????????</Typography>

                        <CouponAutocomplete
                            name="coupon._id"
                            placeholder="..."
                            value={filter["coupon._id"]}
                            initialValue={filter["coupon._id"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                </Grid>

                <Collapse in={isOpenMoreFilter} style={{ marginTop: 24 }}>

                    <Paper elevation={0}>

                        <Grid container spacing={2}>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">?????????????????? ????????????????????</Typography>

                                <DateRangePicker
                                    calendars={3}
                                    value={[filter.dateFrom, filter.dateTo]}
                                    onChange={handleOnChangeDateRange}
                                    renderInput={(startProps, endProps) => (
                                        <React.Fragment>
                                            <TextField margin="normal" {...startProps} label="" helperText="" placeholder="01.01.2020" fullWidth/>
                                            <DateRangeDelimiter> ???? </DateRangeDelimiter>
                                            <TextField margin="normal" {...endProps} label="" helperText="" placeholder="01.01.2020" fullWidth/>
                                        </React.Fragment>
                                    )}
                                />

                            </Grid>

                        </Grid>

                    </Paper>

                </Collapse>

            </Grid>

            <Grid item>

                <Grid container spacing={2}>

                    <Grid item>
                        <Typography variant="formTitle">&#160;</Typography>

                        <Button className={classes.button} variant="contained" size="small" onClick={onSearch}>??????????</Button>
                    </Grid>

                    <Grid item>
                        <Typography variant="formTitle">&#160;</Typography>

                        <Button className={classes.button} variant="outlined" size="small" onClick={handleOnClearAll}>????????????????</Button>
                    </Grid>

                </Grid>

                <Grid item>
                    <Button
                        fullWidth
                        className={classes.button}
                        variant="outlined"
                        size="small"
                        onClick={() => setOpenMoreFilter(!isOpenMoreFilter)}
                    >{isOpenMoreFilter ? '????????????????' : '????????????????????'}</Button>
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
