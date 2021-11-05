import React, {Component} from 'react';
import {
    Box,
    Backdrop,
    Typography,
    CircularProgress
} from "@material-ui/core";
import {
    Form
} from "./components";
import queryString from 'query-string';
import urls from "../../../constants/urls";
import axiosInstance from "../../../agent/agent";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class RegistrationСonfirmationAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                confirmationCode: ''
            },

            isProcessingCreateUser: false
        }

        this.verificationId = localStorage.getItem('verificationId');
        this.initJwt = localStorage.getItem('initJwt');

        let search = queryString.parse(window.location.search);
        this.email = search.email;

        axiosInstance.defaults.headers['authentication'] = this.initJwt;
    }

    componentDidMount = () => {
        if (!this.verificationId || !this.initJwt){
            this.props.history.replace('/');
        }
    }

    onСonfirmationUser = (form, events) => {
        this.setState({ isProcessingCreateUser: true });
        let url = `${ urls["delete-verification"] }${ this.verificationId }?code=${ form.confirmationCode }`;

        axiosInstance.delete(url).then((response) => {
            localStorage.setItem('jwt', this.initJwt);

            localStorage.removeItem('initJwt');
            localStorage.removeItem('verificationId');

            this.onUpdateUser();
        }).catch((error) => {
            events.setFieldError('confirmationCode', allTranslations(localization.registrationConfirmationErrorCode));
            this.setState({isProcessingCreateUser: false});
        })
    }

    onUpdateUser = () => {
        axiosInstance.get(urls["get-me"]).then((response) => {
            const user = response.data.data.user;

            this.props.setAccount(user);

            if (!!user.organization){
                this.onUpdateOrganization()
            }else{
                this.props.history.push('/');
                this.setState({isProcessingCreateUser: false});
            }
            this.onUpdateGlobal();
        })
    }
    onUpdateOrganization = () => {
        axiosInstance.get(urls["get-me-organization"]).then((response) => {
            this.props.setOrganization(response.data.data.organization);
            this.props.history.push('/');
            this.setState({isProcessingCreateUser: false});
        }).catch(() => {
            this.props.history.push('/');
            this.setState({isProcessingCreateUser: false});
        })
    }
    onUpdateGlobal = () => {
        axiosInstance.get(urls["get-global"]).then((response) => {
            this.props.setGlobal(response.data.data.global);
        }).catch(() => {
            this.setState({isProcessingCreateUser: false});
        })
    }

    render() {
        return (
            <Box>
                <Box mb={2}>
                    <Typography variant="h1">{allTranslations(localization.registrationConfirmationTitle)}</Typography>
                </Box>

                <Box mb={7}>
                    <Typography
                        variant="subtitle2">{allTranslations(localization.registrationConfirmationCaption, {email: this.email})}</Typography>
                </Box>

                <Form
                    form={this.state.form}
                    onChange={(form) => this.setState({ form })}

                    onСonfirmationUser={this.onСonfirmationUser}
                    isProcessingCreateUser={this.state.isProcessingCreateUser}
                />

                <Backdrop open={this.state.isProcessingCreateUser} invisible={this.state.isProcessingCreateUser}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </Box>
        );
    }
}

export default RegistrationСonfirmationAccount
