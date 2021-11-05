import React, {useState} from "react";
import {
    CircularProgress,
    TextField, Typography
} from "@material-ui/core";
import {
    Autocomplete
} from "@material-ui/lab";
import {makeStyles} from "@material-ui/styles";
import clsx from "clsx";
import axiosInstance from "../../../../../../agent/agent";
import urls from "../../../../../../constants/urls";
import {getCurrentLanguage} from "../../../../../../common/language";

let searchAddressTiming;

const ComponentAddress = (props) => {
    const {title, hint, error, helperText, name, onChange, value, disabled} = props;

    const classes = useStyles();

    const [isLoading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [isOpen, setOpen] = useState(false);

    const handleChange = async (event, value) => {
        onChange({
            target: {
                name: name,
                value: value?.addressString || ''
            }
        })
    }
    const handleChangeSearch = async (searchValue) => {
        const language = getCurrentLanguage();
        const list = await axiosInstance
            .get(`${urls['get-address-suggestions']}?search=${searchValue}&language=${language}`)
            .then((response) => {
                return response.data.data.addressSuggestions;
            });

        setOptions(list);
    }

    if (true) {
        return (
            <>

                <Typography className={classes.title}>{ title }</Typography>

                <TextField
                    className={classes.root}
                    disabled={disabled}
                    variant="outlined"
                    error={error}
                    name={name}
                    value={value}
                    placeholder={props.placeholder || '...'}
                    fullWidth
                    multiline
                    onChange={onChange}
                />

                { ( Boolean(hint && !error) ) && (<Typography className={classes.caption}>{ hint }</Typography>) }
                { ( Boolean(error) ) && (<Typography className={clsx([classes.caption, classes.captionError])} color="error">{ props?.helperText }</Typography>) }

            </>
        )
    }

    return (
        <>
            <Typography className={classes.title}>{title}</Typography>

            <Autocomplete
                defaultValue={{
                    addressString: value
                }}
                getOptionSelected={(option, value) =>
                    null
                }
                disabled={disabled}
                getOptionLabel={(option) => option.addressString}
                options={options}
                loading={isLoading}
                open={isOpen && options.length > 0}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onInputChange={async (event, searchValue) => {
                    clearTimeout(searchAddressTiming);
                    if (!searchValue || searchValue === '') {
                        return null;
                    }
                    searchAddressTiming = setTimeout(async () => {
                        await handleChangeSearch(searchValue);
                    }, 500);
                }}
                onChange={handleChange}
                autoComplete={false}
                filterOptions={(list) => {
                    return list;
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={props.placeholder}
                        fullWidth
                        name='placeId'
                        variant='outlined'
                        error={error}
                    />
                )}
            />

            {(Boolean(hint && !error)) && (
                <Typography className={classes.caption}>{hint}</Typography>)
            }
            {(Boolean(error)) && (
                <Typography className={clsx([classes.caption, classes.captionError])} color="error">{props?.helperText}</Typography>
            )}

        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& textarea': {
            minHeight: 23
        }
    },

    title: {

        fontSize: 19,
        lineHeight: '19px',
        color: '#25233E',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 9

    },

    input: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: '19px',
        color: '#25233E'
    },

    caption: {
        fontSize: 10,
        lineHeight: '12px',
        color: '#999DB1',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginTop: 4
    },
    captionError: {
        color: '#e53935'
    }
}));

export default ComponentAddress
