import React from "react";
import {
    Box,

    Grid,

    Button,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {useHistory} from 'react-router-dom';
import CutawayOrganization from '../CutawayOrganization/CutawayOrganization';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const MyCompanyCard = (props) => {
    const { organization } = props;
    const classes = useStyles();
    const history = useHistory();

    const handleEdit = () => {
        history.push(`/organization`)
    }

    return (
        <Box className={classes.root}>
            <Grid container justify="space-between" alignItems="flex-end" className={classes.header}>
                <Grid item>
                    <Typography className={classes.title} dangerouslySetInnerHTML={{ __html: allTranslations(localization.dashboardMyCompany) }}/>
                </Grid>

                <Grid item>
                    <Button variant="text" className={classes.buttonEdit} onClick={handleEdit}>{allTranslations(localization.commonEdit)}</Button>
                </Grid>
            </Grid>

            <CutawayOrganization
                organization={organization}
            />
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 16,
        lineHeight: '19px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    header: {
        marginBottom: 12
    },

    buttonEdit: {
        fontSize: 14,
        lineHeight: '17px',
        fontWeight: 'normal',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        padding: 0
    },
}));

export default MyCompanyCard
