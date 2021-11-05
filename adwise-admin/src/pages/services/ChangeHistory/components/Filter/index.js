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
import changeHistoryTypes from "../../../../../constants/changeHistoryTypes";

const Filter = (props) => {
    const {filter, onSearch, onChange} = props;

    const classes = useStyles();

    const handleOnChange = ({target}) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[target.name] = target.value;

        onChange(newFilter, true);
    }
    const handleOnClearAll = () => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter.type = 'crm';

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

                        <Typography variant="formTitle">Система</Typography>

                        <FormControl margin="normal" fullWidth>
                            <Select
                                name="type"
                                variant="outlined"
                                value={filter.type}
                                onChange={handleOnChange}
                            >
                                {
                                    Object.keys(changeHistoryTypes).map((key) => {
                                        const value = key;
                                        const title = changeHistoryTypes[key];

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
