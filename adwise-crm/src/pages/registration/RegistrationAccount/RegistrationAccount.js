import React, {Component} from 'react';
import {
    Box,
    Grid,
    Typography,

    Backdrop,
    CircularProgress
} from '@material-ui/core';
import {
    Form
} from './components';
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {Link} from "react-router-dom";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class RegistrationAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isProcessingCreateUser: false
        };
    }

    componentDidMount = () => {}

    onCheckUserPresence = (form, event) => {
        this.setState({ isProcessingCreateUser: true });

        axiosInstance.get(urls["check-login"] + form.email).then((response) => {
            const { exists } = response.data.data;

            if (exists){
                event.setFieldError('email', allTranslations(localization.errorsEmailAlreadyRegisteredSystem))
                this.setState({ isProcessingCreateUser: false });

                return null
            }

            this.onCreateUser(form, event)
        }).catch((error) => {
            event.setFieldError('email', allTranslations(localization.errorsEmailAlreadyRegisteredSystem))
            this.setState({ isProcessingCreateUser: false })
        })
    }
    onCreateUser = (form, event) => {
        const body = this.getFormCreateUser(form);

        axiosInstance.post(urls["create-user"], body).then((response) => {
            const { verificationId, jwt } = response.data.data;

            localStorage.setItem('initJwt', jwt);
            localStorage.setItem('verificationId', verificationId);

            this.props.history.push(`/registration-confirmation?email=${ form.email }`);
        }).catch((error) => {
            event.setFieldError('email', allTranslations(localization.errorsEmailAlreadyRegisteredSystem))
            this.setState({ isProcessingCreateUser: false })
        })
    }

    getFormCreateUser = (form) => {
        let body = new FormData();

        for ( let key in form ){
            let item = form[key];

            if (!!item) {
                body.append(key, item)
            }
        }

        return body
    }

    render() {
        return (
            <>
                <Box mb={2}>
                    <Typography variant="h1">{allTranslations(localization.registrationTitle)}</Typography>
                </Box>

                <Box mb={7}>
                    <Typography variant="subtitle2">{allTranslations(localization.registrationCaption)}</Typography>
                </Box>

                <Form
                    onCreateUser={this.onCheckUserPresence}

                    isProcessingCreateUser={this.state.isProcessingCreateUser}
                />

                <Box mt={2}>
                    <Grid container spacing={3}>
                        <Grid item><Link class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary" to={'/'}>{allTranslations(localization.registrationButtonsAlreadyHaveAccountCome)}</Link></Grid>
                    </Grid>
                </Box>

                <Backdrop open={this.state.isProcessingCreateUser} invisible={this.state.isProcessingCreateUser}>
                    <CircularProgress size={ 80 } style={{ color: 'white' }}/>
                </Backdrop>
            </>
        );
    }
}

export default RegistrationAccount
