import React, {Component, useState} from 'react';
import {
    Box,

    Grid,

    Button,
    IconButton,

    Typography,

    CircularProgress,

    Backdrop,

    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent, TextField
} from '@material-ui/core';
import {
    TariffCard,
    NotManager,
    NotOrganizationTariff,
    ActiveOrganizationTariff
} from './components';
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {store} from "react-notifications-component";
import getErrorMessage from "../../../helper/getErrorMessage";
import {formatMoney} from "../../../helper/format";
import {
    InvoiceRequestForm
} from './form';
import {makeStyles} from "@material-ui/styles";
import currency from "../../../constants/currency";
import {NumericalReliability} from "../../../helper/numericalReliability";
import alertNotification from "../../../common/alertNotification";

class OrganizationTariffs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            packets: [],

            email: '',

            replenishmentAmount: 100,

            activePacket: null,

            isSubmitting: false,
            isLoadPurchase: false,
            isOpenPayment: false,
            isSuccessSendForm: false
        }
    }

    componentDidMount = () => {
        this.onGetPacketsList()
    }

    onGetPacketsList = () => {
        axiosInstance.get(urls["get-packets"]).then((response) => {
            this.setState({
                packets: response.data.data.packets,

                isLoading: false
            })
        }).catch((error) => {
            this.setState({isLoading: false})
        });
    }

    onSelectTariff = (packet) => {
        if (this.state.activePacket === packet._id) {
            this.setState({
                activePacket: null
            });

            return null
        }

        this.setState({
            activePacket: packet._id
        })
    }

    onBuyPacket = () => {
        this.setState({isSubmitting: true, organizationId});

        const organizationId = this.props.app.organization._id;

        axiosInstance.put(`${urls["add-packet-organization"]}${this.state.activePacket}`, {
            packetId: this.state.activePacket,
            organizationId
        }).then((response) => {
            this.updateOrganization();
        }).catch((error) => {
            const errorMessage = getErrorMessage(error);

            alertNotification({
                title: errorMessage.title,
                message: (<>{errorMessage.message}</>),
                type: 'danger',
            })

            this.setState({
                isSubmitting: false,
                activePacket: null
            })
        })
    }

    updateOrganization = () => {
        axiosInstance.get(urls["get-me-organization"]).then((response) => {
            this.props.setOrganization(response.data.data.organization)
            this.setState({
                isSubmitting: false,
                activePacket: null
            });

            alertNotification({
                title: 'Успешно',
                message: 'Пакет успешно добавлен.',
                type: 'success',
            })

        })
    }

    onChangeReplenishmentAmount = ({ target }) => {
        let value = target.value;

        if (value <= 1){
            value = 1
        }

        this.setState({
            replenishmentAmount: value
        })
    }

    onDepositWallet = () => {
        const form = {
            sum: this.state.replenishmentAmount,
            isLoadPurchase: true
        };

        axiosInstance.post(urls["pay-deposit-wallet"], form).then((response) => {
            const newTab = window.open(response.data.data.payment.paymentUrl, '_blank');
            newTab.focus();

            this.setState({
                isOpenPayment: false,
            })
        }).catch((error) => {
            const errorMessage = getErrorMessage(error);

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })

        })
    }

    sendFormEmail = ({ email }) => {
        this.setState({
            isLoadPurchase: true,
            email
        });

        const body = {
            email: email,
            packetId: this.state.activePacket
        };

        axiosInstance.post(urls['request-packet'], body).then((response) => {
            this.setState({
                isLoadPurchase: false,
                isSuccessSendForm: true
            })
        }).catch((error) => {
            error = getErrorMessage(error);

            this.setState({
                isLoadPurchase: false
            })

            alertNotification({
                title: error.title,
                message: error.message,
                type: 'success',
            })
        })
    }

    render() {
        const account = this.props.app.account;
        const organization = this.props.app.organization;
        const isOrganization = Boolean(organization && organization._id);
        const isPacket = Boolean( isOrganization && organization.packet && organization.packet._id );
        const userAmount = (isOrganization && organization.wallet) ? organization.wallet.points : 0;

        return (
            <Box>
                <Box mb={4}>
                    <Typography variant="h1">Тариф и оплата</Typography>
                </Box>

                {
                    (!isPacket && isOrganization) && (
                        <NotOrganizationTariff
                            organization={organization}
                            setOrganization={this.props.setOrganization}
                        />
                    )
                }

                {
                    (isPacket) && (
                        <ActiveOrganizationTariff
                            organization={organization}
                            setOrganization={this.props.setOrganization}
                        />
                    )
                }

                <Box>
                    <Grid container spacing={3} alignItems="flex-start">
                        {
                            this.state.packets.map((packet, idx) => {
                                const isPacketLimit = packet.limit > 999;
                                const isDisabled = this.state.activePacket && this.state.activePacket !== packet._id;
                                const isSelected = this.state.activePacket && this.state.activePacket === packet._id;
                                const limit = Boolean(packet.limit >= 999) ? "∞" : packet.limit;

                                return (
                                    <Grid idx={`packet-${idx}`} item>
                                        <TariffCard
                                            tariffName={packet.name}
                                            limit={packet.limit}
                                            contribution={`${packet.price}${ currency[packet.currency] }`}
                                            durationOfContribution={`${packet.period} ${NumericalReliability(packet.period, ['месяц', 'месяца', 'месяцев'])}`}
                                            restrictions={isPacketLimit ? `Без ограничений` : `${limit} сотрудник ${limit} акция`}
                                            isWineWin={packet.wiseDefault}

                                            disabled={isDisabled}
                                            selected={isSelected}


                                            onClick={() => this.onSelectTariff(packet)}
                                        />
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>

                {
                    (!!this.state.activePacket) && (
                        <Box mt={4}>
                            <InvoiceRequestForm
                                account={account}
                                sendFormEmail={this.sendFormEmail}
                            />
                        </Box>
                    )
                }

                <Backdrop open={this.state.isSubmitting} invisible={this.state.isSubmitting}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={this.state.isOpenPayment}
                    onClose={() => this.setState({ isOpenPayment: false })}
                >
                    <DialogTitle>
                        <Typography variant="h3">Пополнения счета</Typography>
                    </DialogTitle>

                    <DialogContent>
                        <Typography variant="formTitle">Сумма пополнения</Typography>

                        <TextField
                            fullWidth
                            placeholder={"100"}
                            margin="normal"
                            type="number"
                            value={this.state.replenishmentAmount}
                            variant="outlined"
                            onChange={this.onChangeReplenishmentAmount}
                        />

                        <Button variant="contained" size="small" fullWidth style={{ marginTop: 24 }} onClick={this.onDepositWallet}>
                            Пополнить
                        </Button>
                        <Button variant="outlined" size="small" fullWidth style={{ marginTop: 8 }} onClick={() => this.setState({ isOpenPayment: false })}>
                            Отменить
                        </Button>
                    </DialogContent>

                </Dialog>

                <ModalWithdrawalFunds
                    isOpen={this.state.isSuccessSendForm}
                    email={this.state.email}

                    onClose={() => this.setState({ isSuccessSendForm: false })}
                />

                <Backdrop open={this.state.isLoadPurchase} invisible={this.state.isLoadPurchase}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </Box>
        );
    }
}

const ModalWithdrawalFunds = (props) => {
    const { isOpen, onClose, email } = props;

    const classes = useStyles();

    return (
        <Dialog
            open={isOpen}
            maxWidth="sm"
            fullWidth
            onClose={onClose}
        >
            <Box className={classes.modalContainer}>
                <Typography variant="h3" className={classes.modalTitle}>Спасибо за Заказ!</Typography>

                <Typography className={classes.modalDescription}>
                    С Вами свяжется Ваш персональный менеджер. <br/>
                    Также мы вышлем счёт на оплату по готовности на ваш электронный ящик: <b>{ email }</b>
                </Typography>

                <Button variant="contained" className={classes.modalButton} onClick={props.onClose}>Принять</Button>
            </Box>

        </Dialog>
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
    },
    modalButton: {
        textTransform: 'initial'
    }
}));

export default OrganizationTariffs
