import React, {Component} from 'react';
import {
    Box,

    Grid,

    Typography,

    Button, CircularProgress, Backdrop,
} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';
import {
    UploadPicture
} from './components';
import {
    FormMain,
    FormSecurity,
    FormSecondary,
    FormEntryType
} from './form';
import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import getErrorMessage from "../../../helper/getErrorMessage";
import alertNotification from "../../../common/alertNotification";

class PersonalArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: this.props.account,

            role: this.props.account.role || '',

            picture: null
        }

        this.refFormMain = React.createRef();
        this.refFormSecurity = React.createRef();
        this.refFormSecondary = React.createRef();
    }

    componentDidMount = () => {
    }

    onChangeAccount = (account) => {
        this.refFormMain.current.setValues(account);
        this.refFormSecondary.current.setValues(account);

        this.setState({account});
    }
    onChangePicture = (picture) => {
        this.setState({picture})
    }

    onChangeUser = async () => {
        const isValid = await this.onCheckValidationForm();

        if (!isValid) {
            return null
        }

        this.setState({ isSubmittingForm: true });

        let body = this.onGetFormData();

        axiosInstance.put(urls["update-user"], body).then((response) => {
            this.onUpdateAccount();
        }).catch((error) => {
            const errorMessage = getErrorMessage(error);
            this.setState({ isSubmittingForm: false });

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })
        })
    }
    onCheckValidationForm = async () => {
        let isValid = true;

        let refFormMain = this.refFormMain.current;
        let refFormSecondary = this.refFormSecondary.current;

        await refFormMain.submitForm();
        await refFormSecondary.submitForm();

        const errorsFormMain = await refFormMain.validateForm();
        const errorsFormSecondary = await refFormSecondary.validateForm();

        let isValidFormMain = Object.keys(errorsFormMain).length <= 0;
        let isValidFormSecondary = Object.keys(errorsFormSecondary).length <= 0;

        if (!isValidFormMain) {
            isValid = false;
        }
        if (!isValidFormSecondary) {
            isValid = false;
        }

        if (!isValid) {

            alertNotification({
                title: 'Ошибка',
                message: 'Данные компании заполнены не правильно.',
                type: 'danger',
            })

        }

        return isValid
    }
    onGetFormData = () => {
        let form = {...this.state.account};
        let body = new FormData();

        body.append('firstName', form.firstName);
        body.append('lastName', form.lastName);
        body.append('email', form.email);

        if (form.phone) {
            body.append('phone', form.phone);
        }

        if ( this.state.picture ){
            body.append('picture', this.state.picture);
        }

        return body
    }
    onUpdateAccount = () => {
        axiosInstance.get(urls["get-me"]).then((response) => {

            alertNotification({
                title: 'Успешно',
                message: 'Профиль изменен',
                type: 'success',
            })

            this.setState({ isSubmittingForm: false });

            this.props.setAccount(response.data.data.user)
        }).catch(error => {
            this.setState({ isSubmittingForm: false });
        })
    }

    onChangeRole = () => {
        this.setState({ isSubmittingForm: true });

        axiosInstance.put(`${ urls["user-set-user-role"] }/${ this.state.account._id }`, {
            role: this.state.role
        }).then(() => {
            this.onUpdateAccount();
        })
    }

    render() {
        const {classes} = this.props;

        return (
            <Box>
                <Box mb={3}>
                    <Typography variant={'h1'}>Личный кабинет</Typography>
                </Box>

                <Box className={classes.container}>
                    <Box mb={5}>
                        <Grid container spacing={8}>
                            <Grid item xs={4}>
                                <FormMain
                                    setRef={this.refFormMain}

                                    account={this.state.account}

                                    onChange={this.onChangeAccount}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormSecondary
                                    setRef={this.refFormSecondary}

                                    account={this.state.account}
                                    picture={this.state.picture}

                                    onChange={this.onChangeAccount}
                                    onChangePicture={this.onChangePicture}
                                />
                            </Grid>
                            <Grid item xs={4}>

                                <Box mb={4}>

                                    <Box mb={2}>
                                        <Typography variant="h4">Изменение пароля</Typography>
                                    </Box>

                                    <FormSecurity
                                        setRef={this.refFormSecurity}

                                        account={this.state.account}

                                        onChange={this.onChangeAccount}
                                    />
                                </Box>

                                <Box mb={4}>

                                    <Box mb={2}>
                                        <Typography variant="h4">Изменение типа профиля</Typography>
                                    </Box>

                                    <FormEntryType
                                        role={this.state.role}

                                        onChange={(role) => this.setState({ role })}
                                        onSave={this.onChangeRole}
                                    />

                                </Box>

                            </Grid>
                        </Grid>
                    </Box>

                    <Box>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="contained" onClick={this.onChangeUser}>Сохранить</Button>
                            </Grid>
                            <Grid item></Grid>
                        </Grid>
                    </Box>
                </Box>

                <Backdrop open={this.state.isSubmittingForm} invisible={this.state.isSubmittingForm}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </Box>
        );
    }
}

const styles = {
    container: {
        paddingRight: 250
    }
};

export default withStyles(styles)(PersonalArea)
