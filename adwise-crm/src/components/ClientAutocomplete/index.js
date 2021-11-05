import React, {useState, useEffect} from "react";
import {
    Box,
    Grid,
    Avatar,
    TextField,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Autocomplete
} from "@material-ui/lab";
import axiosInstance from "../../agent/agent";
import urls from "../../constants/urls";
import {compose} from "recompose";
import {connect} from "react-redux";

let timeoutUpdateOrganization;

const ClientAutocomplete = (props) => {
    const {value, name, onChange, placeholder, global, margin} = props;
    const classes = useStyles();

    const [clients, setClients] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [valueAutocomplete, setValueAutocomplete] = useState(null);

    useEffect(() => {
        if (!value) {
            setValueAutocomplete(null);
        }
    }, [value]);

    const handleFindClients = async (search) => {

        const filter = `?page=1&limit=20&search=${ search }&order=-1&sortBy=user`;
        const response = await axiosInstance.get(`${ urls["get-clients"] }${ global.organization._id }${ filter }`).then((res) => {
            return res.data.data.clients;
        }).catch((error) => {
            return []
        });

        setClients(response);
        setLoading(false);

    }
    const handleOnChange = (event, value) => {

        setValueAutocomplete(value);

        onChange({
            target: {
                name,
                value: value?.contact._id || value?.contact || ''
            }
        })
    }

    const _getOptionLabel = (option) => {
        return `${ option?.contact?.firstName?.value } ${ option?.contact?.lastName?.value }`
    }
    const _renderOption = (option) => {
        return (
            <Box>
                <Grid container spacing={2}>
                    <Grid item>
                        <Avatar
                            src={option?.contact?.picture?.value || '/img/user_empty.png'}
                            className={classes.avatar}
                        />
                    </Grid>
                    <Grid item>
                        <Box><Typography>{`${ option?.contact?.firstName?.value } ${ option?.contact?.lastName?.value }`}</Typography></Box>
                    </Grid>
                </Grid>
            </Box>
        )
    }
    const _getOptionSelected = (option, value) => {
        return option._id === value._id
    }

    return (
        <Autocomplete
            value={valueAutocomplete}
            options={clients}
            name={name}
            loading={isLoading}
            fullWidth
            getOptionLabel={_getOptionLabel}
            getOptionSelected={_getOptionSelected}
            renderOption={_renderOption}

            noOptionsText="По вашему запросу ничего не найдено"
            loadingText="Идет загрузка клиентов, ожидайте"

            onChange={handleOnChange}
            onInputChange={(event, search, reason) => {
                if (reason === 'reset') {
                    return null
                }

                setLoading(true);

                clearTimeout(timeoutUpdateOrganization);

                timeoutUpdateOrganization = setTimeout(async () => {
                    await handleFindClients(search)
                }, 1000);
            }}
            filterOptions={(list) => {
                return list;
            }}

            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    margin={margin}
                    fullWidth
                    placeholder={placeholder || '...'}
                />
            )}
        />
    )

}

const useStyles = makeStyles(() => ({
    avatar: {
        width: 40,
        height: 40
    }
}));

export default compose(
    connect(
        state => ({
            global: state.app
        }),
        dispatch => ({}),
    ),
)(ClientAutocomplete);
