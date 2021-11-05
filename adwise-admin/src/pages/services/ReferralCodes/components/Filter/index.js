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

        newFilter._id = "";
        newFilter.code = "";
        newFilter.user = "";
        newFilter.type = "";
        newFilter.mode = "";

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

                        <Typography variant="formTitle">ID</Typography>

                        <TextField
                            name="_id"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter['_id']}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter['_id']} name="_id" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Реферальный код</Typography>

                        <TextField
                            name="code"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter['code']}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter['code']} name="code" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    {
                        false && (
                            <Grid item xs={3}>

                                <Typography variant="formTitle">Пользователя</Typography>

                                <UserAutocomplete
                                    name="user"
                                    placeholder="..."
                                    value={filter["user"]}
                                    initialValue={filter["user"]}

                                    onChange={handleOnChange}
                                />

                            </Grid>
                        )
                    }

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

                <Collapse in={isOpenMoreFilter} style={{ marginTop: 24 }}>

                    <Paper elevation={0}>

                        <Grid container spacing={2}>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Mode</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        name="mode"
                                        variant="outlined"
                                        value={filter.mode}
                                        onChange={handleOnChange}
                                    >
                                        <MenuItem value="">Сбросить</MenuItem>

                                        {
                                            Object.keys(referralCodeMode).map((key) => {
                                                const value = key;
                                                const title = referralCodeMode[key];

                                                return (
                                                    <MenuItem value={ value }>{ title }</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Type</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        name="type"
                                        variant="outlined"
                                        value={filter.type}
                                        onChange={handleOnChange}
                                    >
                                        <MenuItem value="">Сбросить</MenuItem>

                                        {
                                            Object.keys(referralCodeType).map((key) => {
                                                const value = key;
                                                const title = referralCodeType[key];

                                                return (
                                                    <MenuItem value={ value }>{ title }</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>

                            </Grid>

                        </Grid>

                    </Paper>

                </Collapse>

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

                <Grid item>
                    <Button
                        fullWidth
                        className={classes.button}
                        variant="outlined"
                        size="small"
                        onClick={() => setOpenMoreFilter(!isOpenMoreFilter)}
                    >{isOpenMoreFilter ? 'Свернуть' : 'Развернуть'}</Button>
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
