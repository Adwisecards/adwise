import React, {Component} from 'react';
import {
    Box,
    Grid,
    Button,
    Typography, CircularProgress, Backdrop,
} from "@material-ui/core";
import {
    makeStyles,
    withStyles
} from "@material-ui/styles";
import {
    LogoSmall as LogoSmallIcon
} from "../../../icons";
import {
    CardType
} from "./components";
import {
    Buisnes,
    AdWiseDistributor
} from "../../../icons";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class RegistrationEntryType extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBackdrop: false
        }
    }

    onSetUserRole = (role) => {
        this.setState({ isBackdrop: true });

        axiosInstance.put(`${ urls["user-set-user-role"] }/${ this.props.app.account._id }`, {
            role
        }).then((response) => {
            this.onUpdateAccount();
        });
    }

    onUpdateAccount = () => {
        axiosInstance.get(urls["get-me"]).then((response) => {
            this.props.setAccount(response.data.data.user);

            this.setState({ isBackdrop: false });
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <Box py={10}>
                <Box className={classes.body}>

                    <Box className={classes.logo}><LogoSmallIcon/></Box>

                    <Box mb={2}>
                        <Typography variant="h1">{allTranslations(localization.profileSelectionTitle)}</Typography>
                    </Box>

                    <Box maxWidth={470} mb={10}>
                        <Typography className={classes.description}>{allTranslations(localization.profileSelectionCaption)}</Typography>
                    </Box>

                    <Box width={"100%"}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <CardType
                                    title={allTranslations(localization.profileSelectionBusinessTitle)}
                                    message={allTranslations(localization.profileSelectionBusinessMessage)}

                                    Icon={Buisnes}
                                    onClick={() => this.onSetUserRole('business')}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CardType
                                    title={allTranslations(localization.profileSelectionDistributorTitle)}
                                    message={allTranslations(localization.profileSelectionDistributorMessage)}

                                    Icon={AdWiseDistributor}

                                    onClick={() => this.onSetUserRole('manager')}
                                />
                            </Grid>
                            <Grid container justify="center" alignItems="center">
                                <Grid item>
                                    <Button onClick={() => this.onSetUserRole('common')} variant="text">{allTranslations(localization.profileSelectionButtonsSkip)}</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                </Box>

                <Backdrop open={this.state.isBackdrop} invisible={this.state.isBackdrop}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <CircularProgress size={80} style={{color: 'white'}}/>

                        <Box mt={3}>
                            <Typography style={{ textAlign: 'center', color: 'white', maxWidth: 180 }} variant="h4">{allTranslations(localization.profileSelectionMessageLoading)}</Typography>
                        </Box>
                    </Box>
                </Backdrop>
            </Box>
        );
    }
}

const styles = {
    body: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        '& .MuiTypography-h1': {
            fontSize: 48,
            fontWeight: '500',
            fontFeatureSettings: "'ss03' on"
        }
    },
    logo: {
        marginBottom: 44
    },

    description: {
        fontSize: 20,
        lineHeight: '24px',
        textAlign: 'center',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
};

export default withStyles(styles)(RegistrationEntryType)
