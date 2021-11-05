import React, {Component} from 'react';
import {
    Form
} from './components';
import {
    Typography,

    Box,

    Grid
} from '@material-ui/core';
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import queryString from 'query-string';

import './index.scss';
import {Link} from "react-router-dom";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import {getLegalOrganization} from "../../../common/organizationLegal";
import {getFormFromBody} from "../../../legalForms/helpers";

class Authorization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitForm: false
        }
    }

    componentDidMount = () => {
        this.checkAuthToken();
    }

    checkAuthToken = () => {
        let params = queryString.parse(window.location.search);
        this.props.history.replace('/', {});

        if (params.auth_token){
            this.setState({ isSubmitForm: true });

            this.onLoginWithWiseWin({"authToken": params.auth_token});
        }
    }

    onLogin = (form, events) => {
        this.setState({isSubmitForm: true});

        let body = {
            ...form,
            isCrm: 1
        }

        axiosInstance.post(urls["sign-in"], body).then(async (response) => {
            await this.onUpdateAxiosInstance(response.data.data.jwt);
            localStorage.setItem('jwt', response.data.data.jwt);
            await this.onUpdateUser();
        }).catch((error) => {
            this.setState({isSubmitForm: false});

            if (events){
                events.setFieldError('password', allTranslations(localization.errorsWrongLoginOrPassword));
            }
        })
    }
    onLoginWithWiseWin = (form) => {
        this.setState({isSubmitForm: true});

        axiosInstance.post(urls["sign-in-with-wisewin"], form).then(async (response) => {
            await this.onUpdateAxiosInstance(response.data.data.jwt);

            localStorage.setItem('jwt', response.data.data.jwt);

            await this.onUpdateUser();
        }).catch((error) => {
            this.setState({isSubmitForm: false});
        })
    }


    onUpdateAxiosInstance = (jwt) => {
        axiosInstance.defaults.headers['authentication'] = jwt;
    }

    onUpdateUser = async () => {
        axiosInstance.get(urls["get-me"]).then( async (response) => {
            const user = response.data.data.user;

            this.props.setAccount(user);

            if (!!user.wisewinId){
                this.onLoadManagerOrganization()
            }

            if (!!user.organization){
                await this.onUpdateOrganization()
            }else{
                this.setState({isSubmitForm: false});
            }

            this.onUpdateGlobal();
        })
    }
    onUpdateOrganization = async () => {
        const resOrganization = await axiosInstance.get(urls["get-me-organization"]).then((response) => {
            return response.data.data.organization
        }).catch(() => {
            return null
        });
        const legal = await getLegalOrganization(resOrganization._id);

        const organization = {
            ...resOrganization,
            legal: {
                ...legal,
                info: getFormFromBody(resOrganization, legal)
            },
        };

        await this.props.setOrganization(organization);

        await this.setState({isSubmitForm: false});
    }
    onLoadManagerOrganization = () => {
        axiosInstance.get(urls['get-manager-organizations']).then((response) => {
            this.props.setManagerOrganizations(response.data.data.organizations)
        })
    }

    onUpdateGlobal = () => {
        axiosInstance.get(urls["get-global"]).then((response) => {
            this.props.setGlobal(response.data.data.global);
            this.setState({isSubmitForm: false});
        }).catch(() => {
            this.setState({isSubmitForm: false});
        })
    }


    onLoginWiseWin = () => {
        window.location.href = urls["auth-wise-win"];
    }

    render() {
        return (
            <>
                <Typography variant="h1">{allTranslations(localization.authorizationTitle)}</Typography>

                <Form
                    onLogin={this.onLogin}
                    onLoginWiseWin={this.onLoginWiseWin}

                    isSubmitForm={this.state.isSubmitForm}
                />

                <Box mt={2}>
                    <Grid container spacing={3}>
                        <Grid item>
                            <Link class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary" to={'/password-reset'} variant="body2" style={{ color: 'black' }}>{allTranslations(localization.authorizationButtonsPasswordReset)}</Link>
                        </Grid>
                        <Grid item>
                            <Link class="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary" to={'/registration-account'}>{allTranslations(localization.authorizationButtonsRegistration)}</Link>
                        </Grid>
                    </Grid>
                </Box>
            </>
        );
    }
}

export default Authorization
