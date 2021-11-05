import React, {Component} from "react";
import {
    Backdrop,
    Box, CircularProgress,
    Grid,
    Typography,
    Button,
} from "@material-ui/core";
import {
    AppForm,
    SettingsForm
} from "./form";
import {
    BankDetails
} from "./components";

import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";
import global from "../../../globalStore";

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                managerPercent: '',
                minimalPayment: '',
                balanceUnfreezeTerms: '',
                purchasePercent: '',
                contactEmail: '',
                tipsMinimalAmount: '',
                paymentGatewayPercent: '',
                paymentGatewayMinimalFee: '',
                maximumPayment: '',
                paymentRetention: '',
                technicalWorks: false,
                spareContactEmails: []
            },
            global: {},

            isOpenBankDetails: false
        };

        this.formRef = React.createRef();
        this.formRefApp = React.createRef();
        this.globalPaymentShopId = props.global;
    }

    componentDidMount = () => {
        this.getSettings();
    }

    getSettings = () => {
        axiosInstance.get(apiUrls["get-global"]).then((response) => {
            const data = response.data.data.global;

            const form = {
                contactEmail: data.contactEmail,
                managerPercent: data.managerPercent,
                minimalPayment: data.minimalPayment,
                purchasePercent: data.purchasePercent,
                balanceUnfreezeTerms: data.balanceUnfreezeTerms,
                tipsMinimalAmount: data.tipsMinimalAmount,
                paymentGatewayPercent: data.paymentGatewayPercent,
                paymentGatewayMinimalFee: data.paymentGatewayMinimalFee,
                maximumPayment: data.maximumPayment,
                paymentRetention: data.paymentRetention,
                spareContactEmails: data.spareContactEmails || [],
                technicalWorks: data.technicalWorks || false,


                "app.cards.ios.versions.deprecated": data?.app?.cards?.ios?.versions?.deprecated || '0.0.0',
                "app.cards.ios.versions.latest": data?.app?.cards?.ios?.versions?.latest || '1.0.0',
                "app.cards.ios.versions.stable": data?.app?.cards?.ios?.versions?.stable || '1.0.0',
                "app.cards.android.versions.deprecated": data?.app?.cards?.ios?.versions?.deprecated || '0.0.0',
                "app.cards.android.versions.latest": data?.app?.cards?.ios?.versions?.latest || '1.0.0',
                "app.cards.android.versions.stable": data?.app?.cards?.ios?.versions?.stable || '1.0.0',
                "app.business.ios.versions.deprecated": data?.app?.business?.ios?.versions?.deprecated || '0.0.0',
                "app.business.ios.versions.latest": data?.app?.business?.ios?.versions?.latest || '1.0.0',
                "app.business.ios.versions.stable": data?.app?.business?.ios?.versions?.stable || '1.0.0',
                "app.business.android.versions.deprecated": data?.app?.business?.ios?.versions?.deprecated || '0.0.0',
                "app.business.android.versions.latest": data?.app?.business?.ios?.versions?.latest || '1.0.0',
                "app.business.android.versions.stable": data?.app?.business?.ios?.versions?.stable || '1.0.0',
            };

            this.setState({
                form,
                global: data
            });
            this.formRef.current.setValues(form);
            this.formRefApp.current.setValues(form);
        })
    }

    onChangeForm = (form) => {
        form.tipsMinimalAmount = Number(form.tipsMinimalAmount)
        form.paymentGatewayPercent = Number(form.paymentGatewayPercent)
        form.maximumPayment = Number(form.maximumPayment)
        form.paymentRetention = Number(form.paymentRetention)

        this.setState({form});
    }

    onSaveSettings = (form) => {
        this.setState({
            isShowBackdrop: true
        });

        const body = this._getSaveForm(form);

        axiosInstance.put(apiUrls["update-global"], body).then((response) => {
            this.setState({
                isShowBackdrop: false
            });

            this.getSettings();

            alertNotification({
                title: 'Системное уведомление',
                message: 'Настройки успешно изменены',
                type: 'success'
            })
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            });

            alertNotification({
                title: 'Системное уведомление',
                message: 'Ошибка изменения настроек',
                type: 'danger'
            })
        });
    }
    _getSaveForm = (data) => {
        let body = {...data};

        body.app = {
            "cards": {
                "ios": {
                    "versions": {
                        "stable": data['app.cards.ios.versions.stable'] || "1.0.0",
                        "latest": data['app.cards.ios.versions.latest'] || "1.0.0",
                        "deprecated": data['app.cards.ios.versions.deprecated'] || "0.0.0"
                    }
                },
                "android": {
                    "versions": {
                        "stable": data['app.cards.android.versions.stable'] || "1.0.0",
                        "latest": data['app.cards.android.versions.latest'] || "1.0.0",
                        "deprecated": data['app.cards.android.versions.deprecated'] || "0.0.0"
                    }
                }
            },
            "business": {
                "ios": {
                    "versions": {
                        "stable": data['app.business.ios.versions.stable'] || "1.0.0",
                        "latest": data['app.business.ios.versions.latest'] || "1.0.0",
                        "deprecated": data['app.business.ios.versions.deprecated'] || "0.0.0"
                    }
                },
                "android": {
                    "versions": {
                        "stable": data['app.business.android.versions.stable'] || "1.0.0",
                        "latest": data['app.business.android.versions.latest'] || "1.0.0",
                        "deprecated": data['app.business.android.versions.deprecated'] || "0.0.0"
                    }
                }
            }
        };

        return body
    }


    render() {
        const {global} = this.state;

        return (
            <>

                <Box mb={4}>
                    <Typography variant="h1">Настройки</Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Box p={4} borderRadius={8} style={{border: '0.5px solid rgba(168, 171, 184, 0.6)'}}>

                            <SettingsForm
                                innerRef={this.formRef}
                                initialForm={this.state.form}

                                onChangeForm={this.onChangeForm}
                                onSaveSettings={this.onSaveSettings}
                            />

                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box p={4} borderRadius={8} style={{border: '0.5px solid rgba(168, 171, 184, 0.6)'}}>

                            <AppForm
                                innerRef={this.formRefApp}
                                initialForm={this.state.form}

                                onChangeForm={this.onChangeForm}
                                onSaveSettings={this.onSaveSettings}
                            />

                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box p={4} borderRadius={8} style={{border: '0.5px solid rgba(168, 171, 184, 0.6)'}}>

                            {
                                Boolean(global.paymentShopId) ? (
                                    <Typography variant="subtitle1">Платежный идентификатор магазина: <Typography
                                        variant="h5" color="primary">{global.paymentShopId}</Typography></Typography>
                                ) : (
                                    <Button variant="contained"
                                            onClick={() => this.setState({isOpenBankDetails: true})}>Заполнить банк.
                                        реквезиты</Button>
                                )
                            }

                        </Box>
                    </Grid>
                </Grid>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

                <BankDetails
                    isOpen={this.state.isOpenBankDetails}

                    onClose={() => this.setState({isOpenBankDetails: false})}
                    onSuccesSubmit={() => this.setState({isOpenBankDetails: false})}
                />

            </>
        );
    }
}

export default Settings
