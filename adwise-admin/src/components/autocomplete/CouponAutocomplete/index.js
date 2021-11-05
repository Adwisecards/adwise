import React, {useState, useRef, useEffect} from "react";
import {
    Autocomplete
} from "@material-ui/lab";
import {
    Box,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import moment from "moment";
import organizationPaymentTypes from "../../../constants/organizationPaymentTypes";

let timeoutUpdateOrganization;

const CouponAutocomplete = (props) => {
    const {initialValue, value, name, placeholder, onChange} = props;

    const [coupons, setCoupons] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [valueAutocomplete, setValueAutocomplete] = useState(null);

    useEffect(() => {
        (async () => {
            await handleGetInitialCoupon();
        })();
    }, []);
    useEffect(() => {
        handleClear();
    }, [value]);

    const handleGetInitialCoupon = async () => {
        if (!initialValue) {
            return null
        }

        setLoading(true);

        const search = [
            'pageNumber=1',
            'pageSize=40',
            'sortBy=firstName',
            'order=1',
            `_id=${initialValue}`
            // `name=${initialValue}`
        ];
        const coupons = await axiosInstance.get(`${apiUrls["find-coupons"]}?${search.join('&')}`).then((response) => {
            return response.data.data.coupons
        });

        setCoupons(coupons);
        setLoading(false);
        setValueAutocomplete(coupons[0] || null);
    }
    const handleFindCoupons = async (searchValue) => {
        if (!searchValue) {
            return null
        }

        const search = [
            'pageNumber=1',
            'pageSize=40',
            'sortBy=firstName',
            'order=1',
            `name=${searchValue}`
        ];
        const coupons = await axiosInstance.get(`${apiUrls["find-coupons"]}?${search.join('&')}`).then((response) => {
            return response.data.data.coupons
        });

        setCoupons(coupons);
        setLoading(false);
    }

    const handleClear = () => {
        if (!!value || value !== '') {
            return null
        }

        setCoupons([]);
        setValueAutocomplete([]);
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

    const handleOnChange = ({target}, newValue) => {
        setValueAutocomplete(newValue);

        onChange({
            target: {
                name: name,
                value: newValue?._id || ""
            }
        })
    }

    const _getOptionLabel = (option) => {
        return option.name
    }
    const _renderOption = (option) => {
        return (
            <Box>
                <Box>{option?.name}</Box>
                <Box>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            <Typography variant="caption">Дата начала - {moment(option.startDate).format('DD.MM.YYYY')}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="caption">Кол-во - {option.quantity}шт</Typography>
                        </Grid>
                        <Grid item>
                            <Box width={10} height={10} borderRadius={999} bgcolor={option.disabled ? '#D8004E' : '#61AE2C'}/>
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
            options={coupons}
            name={name}
            loading={isLoading}
            fullWidth
            getOptionLabel={_getOptionLabel}
            getOptionSelected={_getOptionSelected}
            renderOption={_renderOption}

            onChange={handleOnChange}
            onInputChange={(event, search, reason) => {
                // if (reason === 'reset'){
                //     setValueAutocomplete('');
                // }
                // if (reason === 'reset' && search === ""){
                //     handleOnClear();
                // }

                setLoading(true);

                clearTimeout(timeoutUpdateOrganization);

                timeoutUpdateOrganization = setTimeout(async () => {
                    await handleFindCoupons(search)
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

export default CouponAutocomplete
