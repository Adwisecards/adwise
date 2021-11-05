import React, {Component} from 'react';
import {
    Backdrop,
    Box,
    CircularProgress,
    Grid,
    Link,
    Typography,

    Dialog,
    DialogTitle,
    DialogContent,

    Button
} from "@material-ui/core";
import {
    Form,
    FormCode
} from "./components";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import getErrorMessage from "../../../helper/getErrorMessage";
import {store} from "react-notifications-component";
import {makeStyles} from "@material-ui/styles";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import alertNotification from "../../../common/alertNotification";

class PasswordReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitForm: false,

            restorationId: null,

            views: [1, 0],

            isOpenModalSuccessReset: false,
        }
    }

    componentDidMount = () => {}

    onCreateRestoration = (form, events) => {
        this.setState({isSubmitForm: true});

        axiosInstance.post(urls["create-restoration"], form).then((response) => {
            this.setState({
                restorationId: response.data.data.restorationId,
                views: [0, 1],

                isSubmitForm: false
            })
        }).catch((error) => {
            const errorMessage = getErrorMessage(error);
            this.setState({isSubmitForm: false});

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })

        })
    }
    onConfirmRestoration = (form, event) => {
        this.setState({isSubmitForm: true});

        axiosInstance.put(`${urls['confirm-restoration']}${this.state.restorationId}`, form).then((response) => {
            this.setState({
                isSubmitForm: false,
                isOpenModalSuccessReset: true
            });
        }).catch((error) => {
            const errorMessage = getErrorMessage(error);
            this.setState({isSubmitForm: false});

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })
        })
    }

    onCloseModalSuccess = () => {
        this.props.history.goBack();
    }

    onGoBack = () => {
        this.setState({views: [1, 0]})
    }

    render() {
        const {views} = this.state;

        return (
            <>
                <Box mb={2}>
                    <Typography variant="h1">{allTranslations(localization.resetPasswordTitle)}</Typography>
                </Box>

                {
                    Boolean(views[0]) && (
                        <SectionEmail
                            onPasswordReset={this.onCreateRestoration}
                            isSubmitForm={this.state.isSubmitForm}
                        />
                    )
                }

                {
                    Boolean(views[1]) && (
                        <SectionCode
                            onPasswordReset={this.onConfirmRestoration}
                            isSubmitForm={this.state.isSubmitForm}
                            goBack={this.onGoBack}
                        />
                    )
                }

                <Backdrop open={this.state.isSubmitForm} invisible={this.state.isSubmitForm}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>


                <Dialog
                    open={this.state.isOpenModalSuccessReset}

                    maxWidth="sm"

                    onClose={this.onCloseModalSuccess}
                >
                    <ModalContent onClose={this.onCloseModalSuccess}/>
                </Dialog>
            </>
        );
    }
}

const SectionEmail = (props) => {
    return (
        <>
            <Box mb={2}>
                <Typography variant="body2">{allTranslations(localization.resetPasswordCaption)}</Typography>
            </Box>

            <Form
                onPasswordReset={props.onPasswordReset}
                isSubmitForm={props.isSubmitForm}
            />
        </>
    )
}
const SectionCode = (props) => {
    return (
        <>
            <Box mb={2}>
                <Typography variant="body2">{allTranslations(localization.resetPasswordCaption2)}</Typography>
            </Box>

            <FormCode
                onPasswordReset={props.onPasswordReset}
                isSubmitForm={props.isSubmitForm}
                goBack={props.goBack}
            />
        </>
    )
}

const ModalContent = (props) => {
    const classes = useStyles();

    return (
        <Box className={classes.modalContainer}>
            <Typography variant="h3" className={classes.modalTitle}>Сброс пароля</Typography>

            <Typography className={classes.modalDescription}>Вы успешно сбросили пароль. <br/>Новый пароль отправлен вам на почту.</Typography>

            <Button variant="contained" onClick={props.onClose}>Авторизовать</Button>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    modalContainer: {
        padding: 42,

        borderRadius: 12,

        backgroundColor: 12
    },
    modalTitle: {
        marginBottom: 24
    },
    modalDescription: {
        fontSize: 20,
        lineHeight: '24px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 24
    }
}));

export default PasswordReset
