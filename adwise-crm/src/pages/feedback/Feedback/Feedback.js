import React, {Component} from 'react';
import {
    Backdrop,
    Box, CircularProgress,
    Grid,
    Typography
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/styles";
import {
    FeedBackPeople as FeedBackPeopleIcon
} from "../../../icons";
import {
    FormFeedBack
} from "./form";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {store} from "react-notifications-component";
import getErrorMessage from "../../../helper/getErrorMessage";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import alertNotification from "../../../common/alertNotification";

class Feedback extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onSubmit = (form, onClearForm) => {
        this.setState({isSubmittingForm: true});

        axiosInstance.post(urls["send-document"], form).then((response) => {

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.feedbackSuccessAplicetionSend),
                type: 'success',
            })

            this.setState({
                isSubmittingForm: false
            });

            onClearForm();

        }).catch((error) => {
            const errorMessage = getErrorMessage(error);
            this.setState({isSubmittingForm: false});

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <Box className={classes.root}>

                <Box mb={4}>
                    <Typography variant="h1">{allTranslations(localization.feedbackTitle)}</Typography>
                </Box>

                <Grid container spacing={4} wrap="nowrap">

                    <Grid item style={{ width: '100%', maxWidth: 700 }}>

                        <Box className={classes.containerForm}>

                            <FormFeedBack
                                onSubmit={this.onSubmit}
                            />

                        </Box>

                    </Grid>

                </Grid>


                <Box className={classes.iconAbsoluteContainer}>
                    <FeedBackPeopleIcon/>
                </Box>

                <Backdrop open={this.state.isSubmittingForm} invisible={this.state.isSubmittingForm}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </Box>
        );
    }
}

const styles = {
    root: {
        position: "relative",
        height: '100%'
    },

    containerForm: {
        border: '0.5px solid rgba(168, 171, 184, 0.6)',
        borderRadius: 10,

        padding: 32
    },

    informationTitle: {
        fontSize: 14,
        lineHeight: '22px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1',

        fontWeight: '600'
    },
    informationDescription: {
        fontSize: 14,
        lineHeight: '22px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1'
    },

    iconAbsoluteContainer: {
        position: 'absolute',
        right: 0,
        bottom: -40
    }
};

export default withStyles(styles)(Feedback)
