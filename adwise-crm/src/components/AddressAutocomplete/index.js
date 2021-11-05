import React, { useState, useEffect, useRef } from "react";
import {
    Box, CircularProgress, TextField,
    Typography,
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {
 makeStyles
} from "@material-ui/styles";
import axiosInstance from "../../agent/agent";
import urls from "../../constants/urls";
import alertNotification from "../../common/alertNotification";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";
import {getCurrentLanguage} from "../../common/language";

var timeoutSearchAddresses;

const AddressAutocomplete = (props) => {
    const { name, value, onChange, disabled, error, helperText, margin} = props;

    const classes = useStyles();

    const [addresses, setAddresses] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setSearch(value);
    }, [value]);

    const handleOnSearchAddress = async (value = search) => {

        if (!value || value.length < 3) {
            return null
        }

        setLoading(true);

        const language = getCurrentLanguage();
        const list = await axiosInstance.get(`${urls["get-address-suggestions"]}?search=${value}&language=${ language }`).then((response) => {
            let list = response?.data?.data?.addressSuggestions || [];
            return list.map((item) => {
                return {
                    addressString: item.addressString,
                    placeId: item.placeId,
                }
            })

        }).catch((error) => {
            return []
        });

        if (list.length <= 0) {
            alertNotification({
                title: allTranslations(localization['addressAutocomplete.warning']),
                message: allTranslations(localization['addressAutocomplete.noSearchResult']),
                type: "info"
            });
        }

        setAddresses(list);

        setLoading(false);

    }
    const handleOnChangePlaceId = (event, value) => {

        setSearch(value?.addressString || '');

        onChange({
            target: {
                name: name,
                value: value?.addressString || ''
            }
        })
    }

    const _getOptionSelected = (option, value) => {
        return (option?.addressString || 'option') === (value?.addressString || value)
    }
    const _getOptionLabel = (option) => {
        return option.addressString;
    }
    const _onInputChange = async (event, value, reason) => {

        clearTimeout(timeoutSearchAddresses);

        if (reason === 'reset') {
            return null
        }

        setSearch(value);

        timeoutSearchAddresses = setTimeout(async () => {
            await handleOnSearchAddress(value);
        }, 500);

    }
    const _filterOptions = (list) => {
        return list
    }

    return (
        <form autocomplete="off">

            <Autocomplete
                disabled={disabled}
                getOptionSelected={_getOptionSelected}
                value={{addressString: search}}
                getOptionLabel={_getOptionLabel}
                options={addresses}
                loading={isLoading}
                loadingText={allTranslations(localization['addressAutocomplete.loadingText'])}
                noOptionsText={allTranslations(localization['addressAutocomplete.noOptionsText'])}
                onInputChange={_onInputChange}
                onChange={handleOnChangePlaceId}
                autoComplete={true}
                filterOptions={_filterOptions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        error={error}
                        helperText={helperText}
                        margin={margin}
                        name={name}
                        variant='outlined'
                        className={classes.root}
                        multiline
                    />
                )}
            />

        </form>
    )
}

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiAutocomplete-inputRoot .MuiAutocomplete-input': {
            paddingRight: '32px!important'
        }
    }
}));

AddressAutocomplete.defaultProps = {
    margin: 'normal'
}

export default AddressAutocomplete
