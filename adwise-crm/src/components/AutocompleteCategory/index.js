import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Typography
} from "@material-ui/core";
import {
    Autocomplete
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import axiosInstance from "../../agent/agent";
import urls from "../../constants/urls";
import {compose} from "recompose";
import {connect} from "react-redux";

let timeoutSearch;

const AutocompleteCategory = (props) => {
    const { name, value, error, helperText, onChange, global, multiple } = props;
    const classes = useStyles();

    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isCreated, setCreated] = useState(false);
    const [valueAutocomplete, setValueAutocomplete] = useState([]);

    useEffect(() => {
        ( async () => {
            await handleGetCategories();
        })();
    }, []);
    useEffect(() => {
        let category = categories.find((t) => t._id === value);
        if (!!category) {
            setValueAutocomplete(category);
        }
    }, [value]);

    const handleGetCategories = async () => {
        setLoading(true);

        const response = await axiosInstance.get(`${ urls["coupon-category-get"] }/${ global.organization._id }`).then((res) => {
            return res.data.data.couponCategories
        }).catch(() => {
            return []
        });

        setCategories(response);
        setLoading(false);
    }

    const handleOnChange = async (event, value, reason) => {
        if (reason === 'reset') {
            return null
        }
        setSearch(value);
    }
    const onSelectCategory = async (event, item) => {
        const createdElement = item.find((t) => t._id.indexOf('create_') > -1);

        if ( Boolean(createdElement) ) {
            setCreated(true);
            let name = createdElement._id.split('create_')[1];
            createdElement._id = await createCategory(name);
            createdElement.name = name;
            setCreated(false);
        }

        onChange({
            target: {
                name,
                value: item
            }
        });
        setValueAutocomplete(item);
    }
    const createCategory = async (name) => {
        return await axiosInstance.post(`${ urls["coupon-category-create"] }`, {
            name: name,
            organizationId: global.organization._id
        }).then((response) => {
            return response.data.data.couponCategoryId
        }).catch((error) => {
            return null
        })
    }

    const _getOptionSelected = (option, value) => {
        return (option?._id || 'option') === (value?._id)
    }
    const _getOptionLabel = (option) => {
        return option.name;
    }
    const _filterOptions = (options, { inputValue }) => {
        const filtered = options.filter((t) => t.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

        if (filtered.length <= 0 && inputValue !== '') {
            filtered.push({
                _id: `create_${inputValue}`,
                name: `Создать "${inputValue}"`,
            });
        }

        return filtered;
    }

    return (
        <form autoComplete="off" action="javascript:void(0);">

            <Autocomplete
                value={valueAutocomplete}
                getOptionLabel={_getOptionLabel}
                getOptionSelected={_getOptionSelected}
                options={categories}
                loading={isLoading}
                className={classes.autocomplete}
                loadingText="Загружаем список адресов..."
                noOptionsText="Ничего не найдено"
                onInputChange={handleOnChange}
                onChange={onSelectCategory}
                autoComplete={true}
                multiple={multiple}
                filterOptions={_filterOptions}
                renderInput={(params) => (
                    <>

                        {
                            isCreated && (
                                <Box className={classes.loading}>
                                    <Typography>Идет загрузка...</Typography>
                                </Box>
                            )
                        }

                        <TextField
                            {...params}
                            fullWidth
                            error={error}
                            helperText={helperText}
                            margin="normal"
                            name={name}
                            variant='outlined'
                            className={classes.root}
                        />

                    </>
                )}
            />

        </form>
    )
}

const useStyles = makeStyles(() => ({

    autocomplete: {
        position: 'relative'
    },

    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: 5,
        background: 'rgba(255,255,255,0.8)',
        height: 40,
        marginTop: 16
    }
}));

export default compose(
    connect(
        state => ({
            global: state.app
        }),
        dispatch => ({}),
    ),
)(AutocompleteCategory);
