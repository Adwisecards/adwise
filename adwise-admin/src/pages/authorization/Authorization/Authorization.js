import React, {Component} from "react";
import {
    Box,

    Backdrop,

    Typography,

    CircularProgress
} from "@material-ui/core";
import {
    FormAuthorization
} from "./form";

import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";

class Authorization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signInForm: {
                login: '',
                password: ''
            },

            isShowBackdrop: false
        };

        this.refSignInForm = React.createRef();
    }

    componentDidMount = () => {
    }

    onSignIn = (form, events) => {
        this.setState({isShowBackdrop: true});

        axiosInstance.post(apiUrls["sign-in"], form).then((response) => {
            const jwt = response.data.data.jwt;

            localStorage.setItem('jwt', jwt);

            axiosInstance.defaults.headers['authentication'] = jwt;

            this.getUser();
        }).catch((error) => {
            this.setState({isShowBackdrop: false});
        });
    }
    getUser = () => {
        axiosInstance.get(apiUrls["user-me"]).then((response) => {
            this.setState({ isShowBackdrop: false });
            const user = response.data.data.user;
            if (!user.admin && !user.adminGuest) {
                this.setState({isShowBackdrop: false});

                store.addNotification({
                    title: "Ошибка",
                    message: "Вы не являетесь администратором / гостем системы",
                    type: 'danger',
                    insert: 'top',
                    container: 'bottom-left',
                    dismiss: {
                        duration: 3000,
                        onScreen: false,
                        pauseOnHover: true,
                        delay: 0
                    }
                });

                axiosInstance.defaults.headers['authentication'] = null;

                localStorage.removeItem('jwt');

                return null
            }

            this.props.setAccount(user);
            this.props.setIsAdminGuest(user.adminGuest);
        }).catch((error) => {
            store.addNotification({
                title: "Ошибка",
                message: error.response.data,
                type: 'danger',
                insert: 'top',
                container: 'bottom-left',
                dismiss: {
                    duration: 3000,
                    onScreen: false,
                    pauseOnHover: true,
                    delay: 0
                }
            });
            axiosInstance.defaults.headers['authentication'] = null;
            localStorage.removeItem('jwt');
            this.setState({isShowBackdrop: false});
        });
    }

    onChangeForm = (signInForm) => {
        this.refSignInForm.current.setValues(signInForm);

        this.setState({signInForm});
    }

    render() {
        const {signInForm} = this.state;

        return (
            <Box>

                <Typography variant="h1">Авторизация</Typography>

                <FormAuthorization
                    setRef={this.refSignInForm}

                    form={signInForm}

                    onSignIn={this.onSignIn}
                    onChangeForm={this.onChangeForm}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </Box>
        );
    }
}

export default Authorization
