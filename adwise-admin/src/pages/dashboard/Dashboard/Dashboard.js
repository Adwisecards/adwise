import React, { Component } from "react";
import {
    Box, FormControl,
    Grid, MenuItem, Select,
    Typography
} from "@material-ui/core";

import {store} from "react-notifications-component";
import transactionTypes from "../../../constants/transactionTypes";

const initialSettings = {
    display: 'min'
};

class Dashboard extends Component {
    constructor(props) {
        super(props);

        let settings = localStorage.getItem('settings_system');

        if (!settings) {
            settings = JSON.stringify(initialSettings)
        }

        this.state = {
            settings: JSON.parse(settings)
        };
    }

    componentDidMount = () => {}

    onChangeSettings = ({ target }) => {
        const { name, value } = target;

        let settings = {...this.state.settings};

        settings[name] = value;

        localStorage.setItem('settings_system', JSON.stringify(settings));

        this.setState({ settings });
    }

    render() {
        const { settings } = this.state;

        return (
            <>
                <Grid container spacing={4}>

                    <Grid item xs={4}>

                        <Box mb={3}>
                            <Typography variant="h3">Настройка отображения системы</Typography>
                        </Box>

                        <Box mb={2}>

                            <Typography variant="formTitle">Отображение</Typography>

                            <FormControl margin="normal" fullWidth>
                                <Select
                                    name="display"
                                    variant="outlined"
                                    value={settings.display}
                                    onChange={this.onChangeSettings}
                                >
                                    <MenuItem value="max">Максимальное</MenuItem>
                                    <MenuItem value="min">Минимальное</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box mb={2}>

                            <Typography variant="formTitle">Форматирование сумм</Typography>

                            <FormControl margin="normal" fullWidth>
                                <Select
                                    name="formattingAmounts"
                                    variant="outlined"
                                    value={settings.formattingAmounts}
                                    onChange={this.onChangeSettings}
                                >
                                    <MenuItem>Выберите</MenuItem>
                                    <MenuItem value="normal">Нормальное (0.00)</MenuItem>
                                    <MenuItem value="none">Нет (0,0000000)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                    </Grid>

                </Grid>
            </>
        );
    }
}

export default Dashboard
