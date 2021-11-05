import React, { useState } from "react";
import {
    Grid,

    Typography,

    TextField,
    FormControlLabel,
    Checkbox,

    Button,

    Collapse,
    Paper, Select, MenuItem, FormControl,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    TextFieldButtonClear,
    UserAutocomplete
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
    const handleOnChangeBoolean = ({target}, value) => {
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter[target.name] = value;

        onChange(newFilter);
    }
    const handleOnChangeSources = ({target}) => {
        const { value } = target;
        let newFilter = {...filter};

        newFilter.pageNumber = 1;
        newFilter.sources = value;

        if (value === 'app'){
            newFilter.email = '';
            newFilter.phone = '.';
        }
        if (value === 'crm'){
            newFilter.email = '.';
            newFilter.phone = '';
        }
        if (value === 'old'){
            newFilter.email = '.';
            newFilter.phone = '.';
        }
        if (value === ''){
            newFilter.email = '';
            newFilter.phone = '';
        }

        onChange(newFilter);
    }
    const handleOnChangeParentCrm = ({target}) => {
        const { name, value } = target;

        let newFilter = {...filter};
        newFilter[name] = value;
        newFilter.email = ".";
        newFilter.phone = "";
        newFilter.parentApp = "";

        onChange(newFilter);
    }
    const handleOnChangeParentApp = ({target}) => {
        const { name, value } = target;

        let newFilter = {...filter};
        newFilter[name] = value;
        newFilter.email = "";
        newFilter.phone = ".";
        newFilter.parentCrm = "";

        onChange(newFilter);
    }
    const handleShowParentApp = ({target}, value) => {
        let newFilter = {...filter};

        newFilter.email = "";
        newFilter.phone = value ? "." : "";
        newFilter.parentApp = "";
        newFilter.parentCrm = "";
        newFilter.parentExists = value ? "1" : "";

        onChange(newFilter);
    }
    const handleShowParentCrm = (event, value) => {
        let newFilter = {...filter};

        newFilter.email = value ? "." : "";
        newFilter.phone = "";
        newFilter.parentApp = "";
        newFilter.parentCrm = "";
        newFilter.parentExists = value ? "1" : "";

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

        newFilter.wisewinId = '';
        newFilter.email = '';
        newFilter._id = '';
        newFilter.wallet = '';
        newFilter.phone = '';
        newFilter.firstName = '';
        newFilter.lastName = '';
        newFilter.sources = '';
        newFilter.wallet = '';
        newFilter.organization = '';
        newFilter.parent = '';
        newFilter.admin = false;

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

                        <Typography variant="formTitle">Фамилия пользователя</Typography>

                        <TextField
                            name="lastName"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.lastName}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.lastName} name="lastName" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Имя пользователя</Typography>

                        <TextField
                            name="firstName"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.firstName}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.firstName} name="firstName" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Email пользователя</Typography>

                        <TextField
                            name="email"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.email}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.email} name="email" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                    <Grid item xs={3}>

                        <Typography variant="formTitle">Wise Win ID</Typography>

                        <TextField
                            name="wisewinId"
                            variant="outlined"
                            margin="normal"
                            placeholder="..."

                            value={filter.wisewinId}

                            fullWidth

                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: <TextFieldButtonClear value={filter.wisewinId} name="wisewinId" onClick={handleOnClearItem}/>
                            }}
                        />

                    </Grid>

                </Grid>

                <Collapse in={isOpenMoreFilter} style={{ marginTop: 24 }}>

                    <Paper elevation={0}>

                        <Grid container spacing={2}>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">ID организации</Typography>

                                <TextField
                                    name="organization"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    value={filter.organization}

                                    fullWidth

                                    onChange={handleOnChange}

                                    InputProps={{
                                        endAdornment: <TextFieldButtonClear value={filter.organization} name="organization" onClick={handleOnClearItem}/>
                                    }}
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">ID пользователя</Typography>

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

                                <Typography variant="formTitle">ID кошелька</Typography>

                                <TextField
                                    name="wallet"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    value={filter.wallet}

                                    fullWidth

                                    onChange={handleOnChange}

                                    InputProps={{
                                        endAdornment: <TextFieldButtonClear value={filter.wallet} name="wallet" onClick={handleOnClearItem}/>
                                    }}
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Номер телефона</Typography>

                                <TextField
                                    name="phone"
                                    variant="outlined"
                                    margin="normal"
                                    placeholder="..."

                                    value={filter.phone}

                                    fullWidth

                                    onChange={handleOnChange}

                                    InputProps={{
                                        endAdornment: <TextFieldButtonClear value={filter.phone} name="phone" onClick={handleOnClearItem}/>
                                    }}
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Источник</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        variant="outlined"
                                        value={filter.sources}
                                        onChange={handleOnChangeSources}
                                    >
                                        <MenuItem value="">Сбросить</MenuItem>
                                        <MenuItem value="crm">CRM</MenuItem>
                                        <MenuItem value="app">Приложение</MenuItem>
                                        <MenuItem value="old">Проблемные пользователи</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Куратор CRM</Typography>

                                <UserAutocomplete
                                    name="parentCrm"
                                    value={filter.parentCrm}
                                    onChange={handleOnChangeParentCrm}
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <Typography variant="formTitle">Куратор APP</Typography>

                                <UserAutocomplete
                                    name="parentApp"
                                    value={filter.parentApp}
                                    onChange={handleOnChangeParentApp}
                                />

                            </Grid>

                        </Grid>

                        <Grid container spacing={2}>

                            <Grid item xs={3}>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filter.admin}
                                            onChange={(event) => handleOnChangeBoolean(event, !filter.admin)}
                                            name="admin"
                                        />
                                    }
                                    label="Показать только админов"
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <FormControlLabel
                                    control={
                                        <Checkbox onChange={handleShowParentApp}/>
                                    }
                                    label="Показать пользователей APP с родителями"
                                />

                            </Grid>

                            <Grid item xs={3}>

                                <FormControlLabel
                                    control={
                                        <Checkbox onChange={handleShowParentCrm}/>
                                    }
                                    label="Показать пользователей CRM с родителями"
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
