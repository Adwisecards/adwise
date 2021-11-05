import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Typography,

    Box,
    Grid,

    Button,

    TextField,

    FormControl,
    Select,
    MenuItem,
    Tooltip, FormControlLabel, Checkbox
} from "@material-ui/core";
import {
    Autocomplete
} from "@material-ui/lab";
import {
    MobileDatePicker
} from "@material-ui/pickers";

import moment from "moment";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import alertNotification from "../../../../../common/alertNotification";

const initialFilter = {
    name: '',
    os: '',
    organizations: [],
    dateLastPurchase: null,
    hasPurchase: false
};


let timeoutUpdateOrganization;

const SampleCreated = (props) => {
    const { isOpen, onClose, onSubmit } = props;

    const refAutocompleteOrganization = useRef();

    const [filter, setFilter] = useState(initialFilter);
    const [organizations, setOrganizations] = useState([]);
    const [isLoadingOrganizations, setLoadingOrganizations] = useState(false);
    const [valueAutocompleteOrganization, setValueAutocompleteOrganization] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setFilter(initialFilter);
    }, [isOpen]);

    const handleFilter = ({ target }) => {
        const { name, value } = target;

        let newFilter = {...filter};
        newFilter[name] = value;

        setFilter(newFilter);
    }
    const handleFilterBoolean = ({ target }, value) => {
        const { name } = target;

        let newFilter = {...filter};
        newFilter[name] = value;

        setFilter(newFilter);
    }
    const handleFilterDate = (event) => {
        let newFilter = {...filter};
        newFilter.dateLastPurchase = moment(event).format('MM.DD.YYYY');

        setFilter(newFilter);
    }
    const handleFilterOrganizations = (event, organization) => {
        if (Boolean(filter.organizations.find(t => t._id === organization._id))){
            alertNotification({
                title: "Системное уведомление",
                message: "Организация уже добавлена в выборку",
                type: "info"
            })

            return null
        }

        let newFilter = {...filter};
        newFilter.organizations.push(organization);

        setFilter(newFilter);
        setOrganizations([]);
    }
    const handleFilterDeleteOrganization = (idx) => {
        let newFilter = {...filter};
        newFilter.organizations.splice(idx, 1);
        setFilter(newFilter);
    }

    const handleSearchOrganization = async (search) => {
        if (!search) {
            return null
        }

        setLoadingOrganizations(true);

        const filter = [
            'pageNumber=1',
            'pageSize=20',
            'sortBy=firstName',
            'order=1',
            `name=${ search }`
        ];
        const organizations = await axiosInstance.get(`${ apiUrls["find-organizations"] }?${ filter.join('&') }`).then((res) => {
            return res.data.data.organizations
        }).catch(() => {
            return []
        });

        setLoadingOrganizations(false);
        setOrganizations(organizations)
    }

    const handleSubmit = () => {
        onSubmit(filter)
    }

    return (
        <Dialog
            open={isOpen}
            maxWidth="lg"

            fullWidth

            onClose={onClose}
        >
            <DialogTitle>
                <Typography variant="h3">Создание выборки пользователей</Typography>
            </DialogTitle>

            <DialogContent>
                <Box mb={3}>
                    <Typography variant="h5">Наименование выборки</Typography>
                    <TextField
                        value={filter.name}
                        variant="outlined"
                        margin="normal"
                        name="name"
                        helperText="Используется для выборки пользователей при выборе отправки пуш уведомлений"
                        fullWidth
                        placeholder="Введите наименование выборки"

                        onChange={handleFilter}
                    />
                </Box>
                <Box mb={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h5">Операционная система устройства</Typography>

                            <FormControl fullWidth margin="normal">
                                <Select
                                    name="os"
                                    variant="outlined"
                                    value={filter.os}
                                    onChange={handleFilter}
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    <MenuItem value="android">Android</MenuItem>
                                    <MenuItem value="ios">IOS</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5">Дата последней покупки</Typography>

                            <MobileDatePicker
                                openTo="year"
                                mask="__.__.____"
                                format="dd.MM.yyyy"
                                views={["year", "month", "date"]}
                                value={filter.dateLastPurchase}
                                maxDate={new Date()}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}

                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                    />
                                )}

                                onChange={handleFilterDate}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box mb={1}>
                    <Typography variant="h5">Подписка на организацию</Typography>

                    <Autocomplete
                        options={organizations}
                        fullWidth
                        disableClearable
                        inputValue={valueAutocompleteOrganization}
                        getOptionLabel={(option) => {
                            return `${ option?.name }`
                        }}
                        filterOptions={(list) => {
                            return list;
                        }}
                        onInputChange={(event, search, reason) => {
                            if (reason === 'reset'){
                                setValueAutocompleteOrganization('');
                            }else{
                                setValueAutocompleteOrganization(search);
                            }

                            clearTimeout(timeoutUpdateOrganization);

                            timeoutUpdateOrganization = setTimeout( async () => {
                                await handleSearchOrganization(search)
                            }, 1000);
                        }}
                        onChange={handleFilterOrganizations}
                        loading={isLoadingOrganizations}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                margin="normal"
                            />
                        )}
                    />

                    <Box mt={1}>
                        <Grid container spacing={1}>
                            {
                                filter.organizations.map((organization, idx) => {
                                    return (
                                        <Grid item>
                                            <Tooltip title="Убрать организацию из выборки">
                                                <Button variant="outlined" key={`button-organization-${ idx }`} onClick={() => handleFilterDeleteOrganization(idx)}>
                                                    <Typography variant="subtitle1">{ organization?.name }</Typography>
                                                </Button>
                                            </Tooltip>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Box>

                </Box>
                <Box mb={1}>
                    <FormControlLabel
                        control={<Checkbox checked={filter.hasPurchase} onChange={(event) => handleFilterBoolean(event, !filter.hasPurchase)} name="hasPurchase" />}
                        label="Была ли совершенна покупка"
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Box px={2} py={1} width="100%">
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button size="small" variant="contained" onClick={handleSubmit}>Создать выборку</Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" variant="outlined" onClick={onClose}>Закрыть</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default SampleCreated
