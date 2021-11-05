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
    OrganizationAutocomplete,
    TextFieldButtonClear, UserAutocomplete,
} from "../../../../../components";
import currency from "../../../../../constants/currency";
import transactionTypes from "../../../../../constants/transactionTypes";
import paymentTypes from "../../../../../constants/paymentTypes";
import originTypes from "../../../../../constants/originTypes";
import {DateRangeDelimiter, DateRangePicker} from "@material-ui/pickers";

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
    const handleOnChangeCheckBox = ({ target }, value) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[target.name] = value;

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

        newFilter.from = '';
        newFilter.to = '';
        newFilter.type = '';
        newFilter.context = '';
        newFilter.origin = '';
        newFilter.dateFrom = null;
        newFilter.dateTo = null;
        newFilter['organization._id'] = '';
        newFilter['from|to'] = '';

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

                        <Typography variant="formTitle">От кого</Typography>

                        <TextField
                            name="from"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.from}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.from} name="from" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Кому</Typography>

                        <TextField
                            name="to"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.to}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.to} name="to" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Связанные транзакции</Typography>

                        <TextField
                            name="context"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.context}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.context} name="context" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Тип транзакции</Typography>

                        <FormControl margin="normal" fullWidth>
                            <Select
                                name="type"
                                variant="outlined"
                                value={filter.type}
                                onChange={handleOnChange}
                            >
                                <MenuItem value="">Сбросить</MenuItem>

                                {
                                    Object.keys(transactionTypes).map((key) => {
                                        const value = key;
                                        const title = transactionTypes[key];

                                        return (
                                            <MenuItem value={ value }>{ title }</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>

                    </Grid>

                </Grid>

                <Collapse in={isOpenMoreFilter} style={{ marginTop: 24 }}>

                    <Paper elevation={0}>

                        <Grid container spacing={2}>

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

                                <Typography variant="formTitle">ID кошелька</Typography>

                                <TextField
                                    name="from|to"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."
                                    helperText="Использовать только при пустых фильтрах 'От кого', 'Кому'"

                                    value={filter['from|to']}

                                    fullWidth

                                    onChange={handleOnChange}

                                    InputProps={{
                                        endAdornment: <TextFieldButtonClear value={filter['from|to']} name="from|to" onClick={handleOnClearItem}/>
                                    }}
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Тип операции</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        name="origin"
                                        variant="outlined"
                                        value={filter.origin}
                                        onChange={handleOnChange}
                                    >
                                        <MenuItem value="">Сбросить</MenuItem>

                                        {
                                            Object.keys(originTypes).map((key) => {
                                                const value = key;
                                                const title = originTypes[key];

                                                return (
                                                    <MenuItem value={ value }>{ title }</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>

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

                        <Grid container spacing={2}>

                            <Grid item xs={3}>

                                <FormControlLabel
                                    control={<Checkbox checked={!filter.disabled && filter.disabled !== ''} name="disabled" onChange={(event) => handleOnChangeCheckBox(event, !filter.disabled)}/>}
                                    label="Показывать только включенные"
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
