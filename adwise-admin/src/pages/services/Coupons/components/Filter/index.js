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
    TextFieldButtonClear
} from "../../../../../components";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import {Autocomplete} from "@material-ui/lab";
import transactionTypes from "../../../../../constants/transactionTypes";
import couponTypes from "../../../../../constants/couponTypes";

const Filter = (props) => {
    const {filter, onSearch, onChange} = props;

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
        newFilter.type = '';
        newFilter.organization = '';

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

                        <Typography variant="formTitle">ID купона</Typography>

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

                        <Typography variant="formTitle">Наименование купона</Typography>

                        <TextField
                            name="name"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.name}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.name} name="name" onClick={handleOnClearItem}/>
                            }}
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

                        <Typography variant="formTitle">Тип купона</Typography>

                        <FormControl margin="normal" fullWidth>
                            <Select
                                name="type"
                                variant="outlined"
                                value={filter.type}
                                onChange={handleOnChange}
                            >
                                <MenuItem value="">Сбросить</MenuItem>

                                {
                                    Object.keys(couponTypes).map((key) => {
                                        const value = key;
                                        const title = couponTypes[key];

                                        return (
                                            <MenuItem value={ value }>{ title }</MenuItem>
                                        )
                                    })
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
