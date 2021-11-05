import React, {useState} from "react";
import {
    Grid,
    Select,
    Button,
    MenuItem,
    TextField,
    Typography,
    FormControl
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    OrganizationAutocomplete,
    UserAutocomplete,
} from "../../../../../components";
import {
    NumericalReliability
} from "../../../../../helper/numericalReliability";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";

const Filter = (props) => {
    const {filter, listPackets, onSearch, onChange} = props;

    const [isOpenMoreFilter, setOpenMoreFilter] = useState(false);

    const classes = useStyles();

    const handleOnChange = ({target}) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[target.name] = target.value;

        onChange(newFilter);
    }
    const handleOnClearAll = () => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;

        newFilter['organization._id'] = '';
        newFilter['manager._id'] = '';
        newFilter['packet._id'] = '';

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

                        <Typography variant="formTitle">ID выплаты</Typography>

                        <TextField
                            name="_id"
                            placeholder="..."
                            value={filter["_id"]}
                            variant="outlined"
                            margin="normal"
                            fullWidth
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

                        <Typography variant="formTitle">Менеджер</Typography>

                        <UserAutocomplete
                            name="manager._id"
                            placeholder="..."
                            value={filter["manager._id"]}
                            initialValue={filter["manager._id"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Пакет</Typography>

                        <FormControl margin="normal" fullWidth>
                            <Select
                                name="packet._id"
                                variant="outlined"
                                value={filter['packet._id']}
                                onChange={handleOnChange}
                            >
                                <MenuItem value="">Сбросить</MenuItem>
                                {
                                    listPackets.map((packet) => (
                                        <MenuItem value={packet._id}>
                                            <Grid container spacing={1} alignItems="center" justify="space-between">
                                                <Grid item>
                                                    <Typography variant="subtitle1">{packet.name} <Typography variant="caption">({packet.period} {NumericalReliability(packet.period, ['месяц', 'месяца', 'месяцев'])})</Typography></Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1">{formatMoney(packet.price)} {currency[packet.currency]}</Typography>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

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

                {
                    false && (
                        <Grid item>
                            <Button
                                fullWidth
                                className={classes.button}
                                variant="outlined"
                                size="small"
                                onClick={() => setOpenMoreFilter(!isOpenMoreFilter)}
                            >{isOpenMoreFilter ? 'Свернуть' : 'Развернуть'}</Button>
                        </Grid>
                    )
                }

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
