import React from "react";
import {
    Box,
    Grid,
    Button,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import clsx from "clsx";
import allTranslations from "../../../../../../localization/allTranslations";
import localization from "../../../../../../localization/localization";
import {useHistory} from "react-router-dom";

const Footer = (props) => {
    const { countClients, onCreate } = props;
    const history = useHistory();
    const classes = useStyles();

    const _routeGoBack = () => {
        history.goBack();
    }

    return (
        <Box className={classes.root}>

            <Box className={classes.container}>

                <Grid container justify="space-between" alignItems="center">

                    <Grid item>

                        <Grid container spacing={4} alignItems="center">

                            <Grid item>

                                <Button
                                    className={clsx({
                                        [classes.buttonCreate]: true,
                                        [classes.buttonCreateDisabled]: Boolean(countClients <= 0),
                                    })}
                                    variant="contained"
                                    disabled={Boolean(countClients <= 0)}
                                    onClick={onCreate}
                                >
                                    {allTranslations(localization['push_notification.createPushNotification.footer.buttonCreate'])}
                                </Button>

                            </Grid>

                            <Grid item>
                                <Typography
                                    variant="paginationTitle"
                                    dangerouslySetInnerHTML={{__html: allTranslations(localization['push_notification.createPushNotification.footer.selectCountClients'], {countClients})}}
                                />
                            </Grid>

                        </Grid>

                    </Grid>

                    <Grid item>
                        <Button
                            variant="text"
                            className={classes.buttonCancel}
                            onClick={_routeGoBack}
                        >
                            {allTranslations(localization['push_notification.createPushNotification.footer.buttonCancel'])}
                        </Button>
                    </Grid>

                </Grid>

            </Box>

        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: 0,
        right: 24,
        width: "100%",
        paddingLeft: 316
    },
    container: {
        backgroundColor: 'white',
        boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.15)',
        borderRadius: '10px 10px 0px 0px',
        padding: 24
    },

    buttonCreate: {
        padding: '0 46px'
    },
    buttonCreateDisabled: {
        backgroundColor: '#808080!important',
        opacity: '1!important'
    },

    buttonCancel: {
        color: '#EE6A6A'
    }
}));

export default Footer
