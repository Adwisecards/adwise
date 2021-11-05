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
    TextFieldButtonClear,
    UserAutocomplete,
} from "../../../../../components";
import transactionTypes from "../../../../../constants/transactionTypes";
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

        newFilter.accumulationId = '';
        newFilter.user = '';
        newFilter.closed = '';

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

                        <Typography variant="formTitle">ID копилки</Typography>

                        <TextField
                            name="accumulationId"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.accumulationId}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.accumulationId} name="accumulationId" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Статус копилки</Typography>

                        <FormControl margin="normal" fullWidth>
                            <Select
                                name="closed"
                                variant="outlined"
                                value={filter.closed}
                                onChange={handleOnChange}
                            >
                                <MenuItem value="">Сбросить</MenuItem>
                                <MenuItem value="false">Открыта</MenuItem>
                                <MenuItem value="true">Закрыта</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Пользователь</Typography>

                        <UserAutocomplete
                            name="user"
                            placeholder="..."
                            value={filter["user"]}
                            initialValue={filter["user"]}

                            onChange={handleOnChange}
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
