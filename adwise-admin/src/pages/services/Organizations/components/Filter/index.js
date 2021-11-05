import React, {useState, useRef} from "react";
import {
    Grid,

    Typography,

    TextField,
    Checkbox,

    Button,

    Paper,
    Collapse,

    FormControlLabel,

} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    TextFieldButtonClear, UserAutocomplete
} from "../../../../../components";

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

    const handleOnClearItem = (name) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[name] = '';

        onChange(newFilter);
    }
    const handleOnClearAll = () => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;

        newFilter.name = '';
        newFilter._id = '';
        newFilter.manager = '';
        newFilter.verified = '';
        newFilter.disabled = '';

        onChange(newFilter, true);
    }

    const handleOnChangeCheckBox = (name, value, activeValue) => {
        let newValue = '';

        if (value === '' || value !== activeValue){
            newValue = activeValue;
        }
        if (value === activeValue) {
            newValue = ''
        }

        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[name] = newValue;

        onChange(newFilter);
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

                        <Typography variant="formTitle">Название организации</Typography>

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

                        <Typography variant="formTitle">Менеджер</Typography>

                        <UserAutocomplete
                            name="manager"
                            placeholder="..."
                            value={filter["manager"]}
                            initialValue={filter["manager"]}

                            onChange={handleOnChange}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">ID организации</Typography>

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

                <Collapse in={isOpenMoreFilter} style={{ marginTop: 24 }}>

                    <Paper elevation={0}>

                        <Grid container spacing={2}>

                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={<Checkbox checked={filter.disabled === true} onChange={() => handleOnChangeCheckBox('disabled', filter.disabled, true)}/>}
                                    label="Показывать только заблокированные"
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={<Checkbox checked={filter.disabled === false} onChange={() => handleOnChangeCheckBox('disabled', filter.disabled, false)}/>}
                                    label="Показывать только активные"
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={<Checkbox checked={filter.verified === false} onChange={() => handleOnChangeCheckBox('verified', filter.verified, false)}/>}
                                    label="Показывать только неподтвержденные"
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={<Checkbox checked={filter.verified === true} onChange={() => handleOnChangeCheckBox('verified', filter.verified, true)}/>}
                                    label="Показывать только подтвержденные"
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
