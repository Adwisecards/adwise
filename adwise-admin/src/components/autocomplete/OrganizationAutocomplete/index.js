import React, {useState, useRef, useEffect} from "react";
import {
    Autocomplete
} from "@material-ui/lab";
import {
    Box,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import organizationPaymentTypes from "../../../constants/organizationPaymentTypes";

let timeoutUpdateOrganization;

const OrganizationAutocomplete = (props) => {
    const {initialValue, value, name, placeholder, onChange} = props;

    const [organizations, setUsersOrganizations] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [valueAutocomplete, setValueAutocomplete] = useState(null);

    useEffect(() => {
        (async () => {
            await handleGetInitialUser();
        })();
    }, []);
    useEffect(() => {
        handleClear();
    }, [value]);

    const handleGetInitialUser = async () => {
        if (!initialValue) {
            return null
        }

        setLoading(true);

        const search = [
            'pageNumber=1',
            'pageSize=40',
            'sortBy=name',
            'order=1',
            `_id=${initialValue}`
        ];
        const organizations = await axiosInstance.get(`${apiUrls["find-organizations"]}?${search.join('&')}`).then((response) => {
            return response.data.data.organizations
        });

        setUsersOrganizations(organizations);
        setLoading(false);
        setValueAutocomplete(organizations[0] || null);
    }
    const handleFindUsers = async (searchValue) => {
        if (!searchValue) {
            return null
        }

        const search = [
            'pageNumber=1',
            'pageSize=40',
            'sortBy=name',
            'order=1',
            `name=${searchValue}`
        ];
        const organizations = await axiosInstance.get(`${apiUrls["find-organizations"]}?${search.join('&')}`).then((response) => {
            return response.data.data.organizations
        });

        setUsersOrganizations(organizations);
        setLoading(false);
    }

    const handleClear = () => {
        if (!!value || value !== '') {
            return null
        }

        setUsersOrganizations([]);
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
        return option.name;
    }
    const _renderOption = (option) => {
        return (
            <Box>
                <Box>{option.name}</Box>
                <Box>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            <Typography variant="caption">Наличные - {option.cash ? 'Да' : 'Нет'};</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">Плат. терм - {organizationPaymentTypes[option.paymentType]};</Typography>
                        </Grid>
                        <Grid item>
                            <Box width={20} height={20} borderRadius={999} bgcolor={option.disabled ? '#D8004E' : '#61AE2C'}/>
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
            options={organizations}
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

export default OrganizationAutocomplete
