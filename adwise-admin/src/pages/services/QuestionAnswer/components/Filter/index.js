import React, {useState} from "react";
import {
    Grid,

    Typography,

    Button,
    Select,
    MenuItem,
    FormControl,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";

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

                        <Typography variant="formTitle">Платформа</Typography>

                        <FormControl fullWidth margin="normal">
                            <Select
                                value={filter.type}
                                name="type"
                                onChange={handleOnChange}
                                variant="outlined"
                            >
                                <MenuItem value={'crm'}>CRM</MenuItem>
                                <MenuItem value={'cards'}>AdWise Cards</MenuItem>
                                <MenuItem value={'business'}>AdWise Business</MenuItem>
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
