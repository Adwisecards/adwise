import React, { useState } from "react";
import {
    Box,

    Grid,

    FormHelperText,

    Select,
    MenuItem,
    FormControl
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";




const LegalForm = (props) => {
    const { value, onChangeLegal, organization, disabled } = props;
    const classes = useStyles();

    const legalList = [
        {
            title: allTranslations(localization.documentTypesIndividual),
            value: 'individual'
        },
        {
            title: allTranslations(localization.documentTypesIp),
            value: 'ip'
        },
        {
            title: allTranslations(localization.documentTypesOoo),
            value: 'ooo'
        }
    ];
    const legalListMini = [
        {
            title: allTranslations(localization.documentTypesIndividual),
            value: 'self'
        }
    ];

    const handleOnChangeSelect = (event, { props }) => {
        onChangeLegal(props.value)
    }

    const list = (organization && organization.packet || true) ? legalList : legalListMini;

    return (
        <Box>
            <FormControl
                fullWidth
                variant={"outlined"}
                name={'category'}
                placeholder={allTranslations(localization.organizationAboutPlaceholdersPleaseIndicate)}
                margin="normal"
            >
                <Select
                    value={value}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    placeholder={allTranslations(localization.organizationAboutPlaceholdersPleaseIndicate)}
                    onChange={handleOnChangeSelect}
                    disabled={disabled}
                >
                    {
                        list.map((legal, idx) => (
                            <MenuItem
                                idx={`category-${idx}`}
                                value={legal.value}
                            >{legal.title}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <FormHelperText className={classes.formHelperText}>{allTranslations(localization.organizationAboutIndicateLegalFormCompany)}</FormHelperText>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    formHelperText: {
        marginTop: -6
    }
}));

export default LegalForm
