import React from "react";
import {
    Box,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const MainForm = (props) => {
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

                <Typography variant="formTitle">{ allTranslations(localization['coupons_create.mainForm.name']) }</Typography>

                <TextField
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    placeholder={allTranslations(localization['coupons_create.mainForm.namePlaceholder'])}
                    margin="normal"
                    name="name"
                    value={values.name}
                    variant="outlined"
                    onChange={handleOnChange}
                />

            </Box>

            <Box mb={4}>

                <Typography variant="formTitle">{allTranslations(localization['coupons_create.mainForm.description'])}</Typography>

                <TextField
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                    placeholder={allTranslations(localization['coupons_create.mainForm.descriptionPlaceholder'])}
                    margin="normal"
                    name="description"
                    value={values.description}
                    variant="outlined"
                    onChange={handleOnChange}

                    rows={5}
                    multiline
                />

            </Box>



        </>
    )
}

export default MainForm
