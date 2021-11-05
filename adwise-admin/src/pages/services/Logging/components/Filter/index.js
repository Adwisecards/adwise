import React, {useState} from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    Typography,
    FormControl,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    TextField, Collapse, Paper
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import loggingEvents from "../../../../../constants/loggingEvents";
import {UserAutocomplete} from "../../../../../components";

const Filter = (props) => {
    const {onChange, filter, onSearch} = props;
    const [isOpenMoreFilter, setOpenMoreFilter] = useState(false);
    const classes = useStyles();

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        let newFilter = {...filter};
        newFilter[name] = value;
        onChange(newFilter)
    }
    const handleOnChangeBoolean = ({target}, value) => {
        const {name} = target;
        let newFilter = {...filter};
        newFilter[name] = value;
        onChange(newFilter)
    }

    const handleClearAll = () => {
        let newFilter = {
            sortBy: 'timestamp',
            order: -1,

            pageSize: 20,
            pageNumber: 1,

            event: '',
            platform: '',
            app: '',
            user: '',
            isError: '',
            message: ''
        };
        onChange(newFilter, true)
    }

    return (
        <>

            <Grid container spacing={2}>
                <Grid item style={{flex: 1}}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Typography variant="formTitle">Событие</Typography>
                            <FormControl margin="normal" fullWidth>
                                <Select
                                    variant="outlined"
                                    name="event"
                                    value={filter.event}
                                    onChange={handleOnChange}
                                >
                                    <MenuItem value="">Сбросить</MenuItem>
                                    {
                                        Object.keys(loggingEvents).map((key, idx) => (
                                            <MenuItem
                                                value={key}
                                                key={`logging-event-${key}-${idx}`}
                                            >{loggingEvents[key]}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="formTitle">Платформа</Typography>
                            <FormControl margin="normal" fullWidth>
                                <Select
                                    variant="outlined"
                                    name="platform"
                                    value={filter.platform}
                                    onChange={handleOnChange}
                                >
                                    <MenuItem value="">Сбросить</MenuItem>
                                    <MenuItem value="android">Android</MenuItem>
                                    <MenuItem value="ios">IOS</MenuItem>
                                    <MenuItem value="pc">PC</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="formTitle">Система</Typography>
                            <FormControl margin="normal" fullWidth>
                                <Select
                                    variant="outlined"
                                    name="app"
                                    value={filter.app}
                                    onChange={handleOnChange}
                                >
                                    <MenuItem value="">Сбросить</MenuItem>
                                    <MenuItem value="crm">CRM</MenuItem>
                                    <MenuItem value="web">AdWise Web</MenuItem>
                                    <MenuItem value="cards">AdWise Cards</MenuItem>
                                    <MenuItem value="business">AdWise Business</MenuItem>
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

                    <Collapse in={isOpenMoreFilter} style={{marginTop: 24}}>
                        <Paper elevation={0}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography variant="formTitle">Сообщение</Typography>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        name="message"
                                        value={filter.message}
                                        onChange={handleOnChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <FormControlLabel
                                        control={<Checkbox checked={filter.isError}
                                                           onChange={(event) => handleOnChangeBoolean(event, !filter.isError)}
                                                           name="isError"/>}
                                        label="Показать ошибки"
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
                            <Button size="small" className={classes.button} variant="contained"
                                    onClick={onSearch}>Поиск</Button>
                        </Grid>
                        <Grid item>
                            <Typography variant="formTitle">&#160;</Typography>
                            <Button size="small" className={classes.button} variant="outlined"
                                    onClick={handleClearAll}>Сбросить</Button>
                        </Grid>
                    </Grid>

                    <Button fullWidth size="small" className={classes.button} variant="contained"
                            onClick={() => setOpenMoreFilter(!isOpenMoreFilter)}>{isOpenMoreFilter ? 'Свернуть' : 'Развернуть'}</Button>
                </Grid>
            </Grid>

        </>
    )
}

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(2),
        padding: '1px 24px'
    }
}));

export default Filter
