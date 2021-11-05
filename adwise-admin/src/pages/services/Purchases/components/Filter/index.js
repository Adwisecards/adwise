import React, { useState, useEffect } from "react";
import {
    Grid,

    Typography,

    TextField,

    Button, Select, MenuItem, FormControl, Paper, Collapse
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    CouponAutocomplete, OrganizationAutocomplete,
    TextFieldButtonClear, UserAutocomplete
} from "../../../../../components";
import { DateRangePicker, DateRangeDelimiter } from "@material-ui/pickers";
import transactionTypes from "../../../../../constants/transactionTypes";
import paymentTypes from "../../../../../constants/paymentTypes";

const listStatus = {
    'confirmed.!complete.!processing.!canceled':'ОПЛАЧЕН',
    '!confirmed.!complete.!processing.!canceled':'НЕОПЛАЧЕН',
    '!confirmed.!complete.processing.!canceled':'В ПРОЦЕССЕ',
    'confirmed.complete.!processing.!canceled':'ЗАВЕРШЁН',
    '!confirmed.!complete.!processing.canceled':'ОТМЕНЕН',
};
const listTerminal = {
    "false_false_false": "Класический терминал",
    "true_false_false": "Наличная оплата",
    "false_true_false": "Безопасная сделка",
    "false_false_true": "Сплитование",
};

const Filter = (props) => {
    const {filter, onSearch, onChange} = props;

    const [activeStatus, setActiveStatus] = useState('');
    const [activeTerminal, setActiveTerminal] = useState('');
    const [isOpenMoreFilter, setOpenMoreFilter] = useState(false);

    useEffect(() => {
        handleSetStatusPurchase();
        handleSetTerminal();
    }, [filter]);

    const classes = useStyles();

    const handleOnChange = ({target}) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[target.name] = target.value;

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

        newFilter._id = '';
        newFilter['organization._id'] = '';
        newFilter['coupons._id'] = '';
        newFilter['ref.code'] = '';
        newFilter['payment.cash'] = '';
        newFilter['payment.safe'] = '';
        newFilter['payment.split'] = '';
        newFilter.description = '';
        newFilter.dateFrom = null;
        newFilter.dateTo = null;
        newFilter.type = null;
        newFilter.complete = '';
        newFilter.confirmed = '';
        newFilter['purchaser._id'] = '';
        newFilter['user._id'] = '';
        newFilter.processing = '';

        onChange(newFilter, true);
    }
    const handleOnChangeDateRange = (dates) => {
        let newFilter = {...filter};

        newFilter.dateFrom = dates[0];
        newFilter.dateTo = dates[1];

        onChange(newFilter);
    }
    const handleOnChangeStatus = ({ target }) => {
        let newFilter = {...filter};
        const { value } = target;

        if (value === ''){
            newFilter.confirmed = "";
            newFilter.processing = "";
            newFilter.complete = "";
            newFilter.canceled = "";

            onChange(newFilter);

            return null
        }

        newFilter.confirmed = Boolean(value.indexOf('confirmed') > -1 && value.indexOf('!confirmed') === -1);
        newFilter.processing = Boolean(value.indexOf('processing') > -1 && value.indexOf('!processing') === -1);
        newFilter.complete = Boolean(value.indexOf('complete') > -1 && value.indexOf('!complete') === -1);
        newFilter.canceled = Boolean(value.indexOf('canceled') > -1 && value.indexOf('!canceled') === -1);

        onChange(newFilter);
    }
    const handleOnChangeTerminal = ({ target }) => {
        let newFilter = {...filter};
        const { value } = target;

        if (!value) {
            newFilter['payment.cash'] = '';
            newFilter['payment.safe'] = '';
            newFilter['payment.split'] = '';

            onChange(newFilter);

            return null
        }

        const split = value.split('_');

        newFilter['payment.cash'] = Boolean(split[0] === 'true');
        newFilter['payment.safe'] = Boolean(split[1] === 'true');
        newFilter['payment.split'] = Boolean(split[2] === 'true');

        onChange(newFilter);
    }

    const handleSetStatusPurchase = () => {
        let key = [];

        if (filter.confirmed !== '') {
            key.push(`${filter.confirmed ? '' : '!'}confirmed`);
        }
        if (filter.complete !== '') {
            key.push(`${filter.complete ? '' : '!'}complete`);
        }
        if (filter.processing !== '') {
            key.push(`${filter.processing ? '' : '!'}processing`);
        }
        if (filter.canceled !== '') {
            key.push(`${filter.canceled ? '' : '!'}canceled`);
        }

        console.log('key: ', key);
        console.log('key.join(\'.\'): ', key.join('.'));

        setActiveStatus(key.join('.'));
    }
    const handleSetTerminal = () => {
        if (filter['payment.cash'] === '' && filter['payment.safe'] === '' && filter['payment.split'] === ''){
            setActiveTerminal('');

            return null
        }

        let cash = (filter['payment.cash'] !== '') ? (filter['payment.cash']) ? 'true' : 'false' : 'false';
        let safe = (filter['payment.safe'] !== '') ? (filter['payment.safe']) ? 'true' : 'false' : 'false';
        let split = (filter['payment.split'] !== '') ? (filter['payment.split']) ? 'true' : 'false' : 'false';

        let data = [cash, safe, split];

        setActiveTerminal(data.join('_'));
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

                        <Typography variant="formTitle">Покупатель</Typography>

                        <UserAutocomplete
                            name="user._id"
                            placeholder="..."
                            value={filter["user._id"]}
                            initialValue={filter["user._id"]}

                            onChange={handleOnChange}
                        />

                        <Typography variant="caption">Визитная карточка</Typography>

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Купон</Typography>

                        <CouponAutocomplete
                            name="coupons._id"
                            placeholder="..."
                            value={filter["coupons._id"]}
                            initialValue={filter["coupons._id"]}

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

                        <Typography variant="formTitle">Статус сделки</Typography>

                        <FormControl margin="normal" fullWidth>
                            <Select
                                variant="outlined"
                                value={activeStatus}
                                onChange={handleOnChangeStatus}
                            >
                                <MenuItem value="">Сбросить</MenuItem>

                                {
                                    Object.keys(listStatus).map((key) => {
                                        const value = key;
                                        const title = listStatus[key];

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

                                <Typography variant="formTitle">ID покупки</Typography>

                                <TextField
                                    name="_id"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    value={filter._id}

                                    fullWidth

                                    onChange={handleOnChange}

                                    InputProps={{
                                        endAdornment: <TextFieldButtonClear value={filter._id} name="_id" onClick={handleOnClearItem}/>
                                    }}
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Тип терминала</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        variant="outlined"
                                        value={activeTerminal}
                                        onChange={handleOnChangeTerminal}
                                    >
                                        <MenuItem value="">Сбросить</MenuItem>

                                        {
                                            Object.keys(listTerminal).map((key) => {
                                                const value = key;
                                                const title = listTerminal[key];

                                                return (
                                                    <MenuItem value={ value }>{ title }</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Код покупки</Typography>

                                <TextField
                                    name="ref.code"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    value={filter['ref.code']}

                                    fullWidth

                                    onChange={handleOnChange}

                                    InputProps={{
                                        endAdornment: <TextFieldButtonClear value={filter['ref.code']} name="ref.code" onClick={handleOnClearItem}/>
                                    }}
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Описание</Typography>

                                <TextField
                                    name="description"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    value={filter.description}

                                    fullWidth

                                    onChange={handleOnChange}

                                    InputProps={{
                                        endAdornment: <TextFieldButtonClear value={filter.description} name="description" onClick={handleOnClearItem}/>
                                    }}
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

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Тип операции</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        name="type"
                                        variant="outlined"
                                        value={filter.type}
                                        onChange={handleOnChange}
                                    >
                                        <MenuItem value="">Сбросить</MenuItem>

                                        {
                                            Object.keys(paymentTypes).map((key) => {
                                                const value = key;
                                                const title = paymentTypes[key];

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
