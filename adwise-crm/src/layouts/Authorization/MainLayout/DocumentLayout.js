import React, {Component} from "react";
import {
    Page
} from '../../../components';
import {
    Grid,
    Link,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from '@material-ui/styles';
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

const DocumentLayout = (props) => {
    const classes = useStyles();

    return (
        <Page className={classes.root}>
            <div className={classes.container}>
                {props.children}
            </div>

            <div className={classes.footer}>
                <Grid container spacing={3}>
                    <Grid item>
                        <Typography variant="body2">Сopyright © 2020. All rights reserved</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">Support@wise.win</Typography>
                    </Grid>
                    <Grid item>
                        <Link href="/user-agreement" target="_blank">{allTranslations(localization.layoutsAuthorizationUserAgreement)}</Link>
                    </Grid>
                    <Grid item>
                        <Link href="/privacy-policy" target="_blank">{allTranslations(localization.layoutsAuthorizationPrivacyPolicy)}</Link>
                    </Grid>
                </Grid>
            </div>

        </Page>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    container: {
        maxWidth: 1400,
        width: '100%',
        flex: 1,
        margin: '0 auto'
    },

    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        paddingTop: 16,
        paddingBottom: 16,

        '& .MuiGrid-item': {
            display: 'flex',
            alignItems: 'center'
        },
        '& .MuiLink-root': {
            fontSize: 12,
            lineHeight: '14px',
            fontFeatureSettings: "'ss03' on, 'ss06' on"
        },
        '& .MuiTypography-body2': {
            fontSize: 12,
            lineHeight: '14px',
            fontFeatureSettings: "'ss03' on, 'ss06' on",
            color: '#25233E'
        }
    }
}));

export default DocumentLayout
