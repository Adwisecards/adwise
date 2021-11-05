import React from "react";
import {
    Box,
    Grid,
    Tooltip,
    TextField,
    Typography,
    InputAdornment, FormControlLabel, Checkbox,
} from "@material-ui/core";
import {HelpBadge} from "../../../../../components";
import {DateRangePicker} from "@material-ui/pickers";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import currency from "../../../../../constants/currency";

const SettingsForm = (props) => {
    const { values, touched, errors, onChange } = props;

    const handleOnChange = ({ target }) => {
        const { name, value } = target;
        let newValues = {...values};
        newValues[name] = value;

        onChange(newValues)
    }
    const handleOnChangeDate = ([startDate, endDate]) => {
        let newValues = {...values};

        newValues.startDate = startDate;
        newValues.endDate = endDate;

        onChange(newValues)
    }
    const handleOnChangeBoolean = ({ target: { name } }, value) => {
        let newValues = {...values};
        newValues[name] = value;

        onChange(newValues)
    }
    const handleOnChangeAge = ({ target: { name } }, value, type) => {
        let newValues = {...values};

        newValues[name] = Boolean(type === values[name]) ? '' : type;

        onChange(newValues)
    }

    return (
        <>

            <Box mb={3}>

                <Typography variant="formTitle">{allTranslations(localization['coupons_create.settingsForm.price'])}</Typography>

                <TextField
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                    placeholder="14 000"
                    margin="normal"
                    name="price"
                    type="number"
                    value={values.price}
                    variant="outlined"
                    onChange={handleOnChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{currency.rub}</InputAdornment>,
                    }}
                />

            </Box>

            <Box mb={5}>
                <Box>
                    <FormControlLabel
                        onChange={handleOnChangeBoolean}
                        value={values.floating}
                        control={<Checkbox name="floating" checked={values.floating}/>}
                        label={(<Box display="flex">{allTranslations(localization['coupons_create.settingsForm.floating'])} <HelpBadge tooltip={allTranslations(localization['coupons_create.settingsForm.floatingTooltip'])}/></Box>)} />
                </Box>
                <Box>
                    <FormControlLabel
                        onChange={(event, value) => handleOnChangeAge(event, value, 'cigarettes')}
                        control={<Checkbox name="ageRestricted" checked={Boolean(values.ageRestricted === 'cigarettes')} />}
                        label={(<Box display="flex">{allTranslations(localization['coupons_create.settingsForm.cigarettes'])} <HelpBadge tooltip={allTranslations(localization['coupons_create.settingsForm.ageRestrictedTooltip'])}/></Box>)} />
                </Box>
                <Box>
                    <FormControlLabel
                        onChange={(event, value) => handleOnChangeAge(event, value, 'alcohol')}
                        control={<Checkbox name="ageRestricted" checked={Boolean(values.ageRestricted === 'alcohol')} />}
                        label={(<Box display="flex">{allTranslations(localization['coupons_create.settingsForm.alcohol'])} <HelpBadge tooltip={allTranslations(localization['coupons_create.settingsForm.ageRestrictedTooltip'])}/></Box>)} />
                </Box>
            </Box>

            <Box>
                <DateRangePicker
                    calendars={3}
                    value={[values.startDate, values.endDate]}
                    onChange={handleOnChangeDate}
                    renderInput={(startProps, endProps) => (
                        <Grid container>
                            <Grid item xs={12}>
                                <Box mb={2}>
                                    <Typography variant="formTitle">{allTranslations(localization['coupons_create.settingsForm.startDate'])}</Typography>
                                    <TextField {...startProps} label="" helperText="" placeholder="01.01.2020" fullWidth margin="normal"/>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="formTitle">{allTranslations(localization['coupons_create.settingsForm.endDate'])}</Typography>
                                    <TextField {...endProps} label="" helperText="" placeholder="01.01.2020" fullWidth margin="normal"/>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                />
            </Box>

        </>
    )
}

export default SettingsForm
