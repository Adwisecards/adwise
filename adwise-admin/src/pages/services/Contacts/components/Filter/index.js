import React, {useState} from "react";
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
    OrganizationAutocomplete,
    TextFieldButtonClear, UserAutocomplete
} from "../../../../../components";
import currency from "../../../../../constants/currency";
import transactionTypes from "../../../../../constants/transactionTypes";
import paymentTypes from "../../../../../constants/paymentTypes";
import originTypes from "../../../../../constants/originTypes";
import userContactsType from "../../../../../constants/userContactsType";

const Filter = (props) => {
    const {filter, onSearch, onChangeFilter} = props;

    const [isOpenMoreFilter, setOpenMoreFilter] = useState(false);

    const classes = useStyles();

    const handleOnChange = ({target}) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[target.name] = target.value;

        onChangeFilter(newFilter);
    }

    const handleOnClearItem = (name) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[name] = '';

        onChangeFilter(newFilter);
    }
    const handleOnClearAll = () => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;

        newFilter.ref = '';
        newFilter._id = '';
        newFilter.type = '';
        newFilter.organization = '';

        onChangeFilter(newFilter, true);
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

                        <Typography variant="formTitle">Пользователь</Typography>

                        <UserAutocomplete
                            name="ref"
                            placeholder="..."
                            value={filter["ref"]}
                            initialValue={filter["ref"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Организация</Typography>

                        <OrganizationAutocomplete
                            name="organization"
                            placeholder="..."
                            value={filter["organization"]}
                            initialValue={filter["organization"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Тип визитной карточки</Typography>

                        <FormControl margin="normal" fullWidth>
                            <Select
                                name="type"
                                variant="outlined"
                                value={filter.type}
                                onChange={handleOnChange}
                            >
                                <MenuItem value="">Сбросить</MenuItem>

                                {
                                    Object.keys(userContactsType).map((key) => {
                                        const value = key;
                                        const title = userContactsType[key];

                                        return (
                                            <MenuItem value={ value }>{ title }</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">ID визитной карточки</Typography>


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
