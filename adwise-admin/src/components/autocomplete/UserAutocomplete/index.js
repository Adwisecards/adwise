import React, {useState, useRef, useEffect} from "react";
import {
    Autocomplete
} from "@material-ui/lab";
import {
    Box,
    Grid,
    Typography,
    TextField
} from "@material-ui/core";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import moment from "moment";

let timeoutUpdateOrganization;

const UserAutocomplete = (props) => {
    const {initialValue, value, name, placeholder, onChange} = props;

    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [valueAutocomplete, setValueAutocomplete] = useState(null);

    useEffect(() => {
        (async () => {
            if (initialValue) {
                await handleGetInitialUser();
            }
        })();
    }, []);
    useEffect(() => {
        handleClear();
    }, [value]);

    const handleGetInitialUser = async () => {
        if (!initialValue && initialValue === '') {
            return null
        }

        setLoading(true);

        const search = [
            'pageNumber=1',
            'pageSize=40',
            'sortBy=firstName',
            'order=1',
            `_id=${initialValue}`
        ];
        const users = await axiosInstance.get(`${apiUrls["find-users"]}?${search.join('&')}`).then((response) => {
            return response.data.data.users
        });

        setUsers(users);
        setLoading(false);
        setValueAutocomplete(users[0] || null);
    }
    const handleFindUsers = async (searchValue) => {
        if (!searchValue) {
            return null
        }

        const search = [
            'pageNumber=1',
            'pageSize=40',
            'sortBy=firstName',
            'order=1',
            `fullName=${searchValue}`
        ];
        const users = await axiosInstance.get(`${apiUrls["find-users"]}?${search.join('&')}`).then((response) => {
            return response.data.data.users
        });

        setUsers(users);
        setLoading(false);
    }

    const handleClear = () => {
        if (!!value || value !== '') {
            return null
        }

        setUsers([]);
        setValueAutocomplete([]);
    }

    const handleOnChange = ({target}, newValue) => {
        setValueAutocomplete(newValue);

        onChange({
            target: {
                name: name,
                value: newValue?._id || ""
            }
        })
    }
    const handleOnClear = () => {
        handleClear();
        onChange({
            target: {
                name: name,
                value: ""
            }
        })
    }

    const _getOptionLabel = (option) => {
        if (typeof option === 'object' && option.length <= 0) {
            return null
        }

        return `${option?.lastName || ''} ${option?.firstName || ''}`
    }
    const _renderOption = (option) => {
        return (
            <Box>
                <Box>{`${option.lastName} ${option.firstName}`}</Box>
                <Box>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <Typography variant="caption">Email: {option.email || '—'};</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">Телефон: {option.phone || '—'};</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        )
    }
    const _getOptionSelected = (option, value) => {
        return option._id === value._id
    }

    return (
        <Autocomplete
            value={valueAutocomplete}
            options={users}
            name={name}
            loading={isLoading}
            fullWidth
            getOptionLabel={_getOptionLabel}
            getOptionSelected={_getOptionSelected}
            renderOption={_renderOption}

            onChange={handleOnChange}
            onInputChange={(event, search, reason) => {
                setLoading(true);

                clearTimeout(timeoutUpdateOrganization);

                timeoutUpdateOrganization = setTimeout(async () => {
                    await handleFindUsers(search)
                }, 1000);
            }}
            filterOptions={(list) => {
                return list;
            }}

            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    margin="normal"
                    placeholder={placeholder || '...'}
                />
            )}
        />
    )
}

export default UserAutocomplete
