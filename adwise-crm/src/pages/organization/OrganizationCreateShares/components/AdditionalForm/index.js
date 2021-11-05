import React from "react";
import {
    Box,
    Select,
    Button,
    MenuItem,
    TextField,
    Typography,
    FormControl, FormHelperText,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    AddressAutocomplete,
    AutocompleteCategory
} from "../../../../../components";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import couponTypes from "../../../../../constants/couponTypes";

const AdditionalForm = (props) => {
    const { values, touched, errors, onChange } = props;

    const handleOnChange = ({ target }) => {
        const { name, value } = target;

        let newValues = {...values};
        newValues[name] = value;

        onChange(newValues)
    }

    return (
        <>

            <Box mb={4}>

                <Typography variant="formTitle">{allTranslations(localization['coupons_create.additionalForm.type'])}</Typography>

                <FormControl
                    fullWidth
                    name={'type'}
                    variant={"outlined"}
                    helperText={touched.type && errors.type}
                    error={Boolean(touched.type && errors.type)}
                    margin="normal"
                >
                    <Select
                        value={values.type}
                        name={'type'}
                        placeholder={allTranslations(localization.couponsCreatePlaceholdersTypeSelected)}
                        onChange={handleOnChange}
                        helperText={touched.type && errors.type}
                        error={Boolean(touched.type && errors.type)}
                    >
                        <MenuItem value="">{allTranslations(localization.commonReset)}</MenuItem>
                        {
                            Object.keys(couponTypes).map((key, idx) => {
                                const value = key;
                                const label = couponTypes[key];

                                return (
                                    <MenuItem
                                        idx={`category-${idx}`}
                                        value={value}
                                    >{label}</MenuItem>
                                )
                            })
                        }
                    </Select>
                    {
                        Boolean(touched.type && errors.type) && (
                            <FormHelperText>{touched.type && errors.type}</FormHelperText>
                        )
                    }
                </FormControl>
            </Box>

            <Box mb={4}>

                <Typography variant="formTitle">{allTranslations(localization['coupons_create.additionalForm.category'])}</Typography>

                <AutocompleteCategory
                    name="couponCategoryIds"
                    value={values.couponCategoryIds}
                    error={Boolean(touched.couponCategoryIds && errors.couponCategoryIds)}
                    helperText={touched.couponCategoryIds && errors.couponCategoryIds}
                    onChange={handleOnChange}
                    multiple
                />
            </Box>

            <Box mb={4}>
                <Typography variant="formTitle">{allTranslations(localization['coupons_create.additionalForm.quantity'])}</Typography>

                <TextField
                    fullWidth
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    placeholder="100"
                    margin="normal"
                    type="number"
                    name="quantity"
                    value={values.quantity}
                    variant="outlined"
                    onChange={handleOnChange}
                />
            </Box>

            <Box mb={4}>
                <Typography variant="formTitle">{allTranslations(localization['coupons_create.additionalForm.locationAddressId'])}</Typography>

                <AddressAutocomplete
                    value={values.locationAddressId}
                    name="locationAddressId"
                    onChange={handleOnChange}
                    error={Boolean(touched.locationAddressId && errors.locationAddressId)}
                    helperText={touched.locationAddressId && errors.locationAddressId}
                />
            </Box>

        </>
    )
}

const useStyles = makeStyles(() => ({

}));

export default AdditionalForm
