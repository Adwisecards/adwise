import React, {PureComponent} from "react";
import {
    Box,
    Grid,
    Typography,
    Button,
    Tooltip,
    CircularProgress,
    Backdrop, Link
} from "@material-ui/core";
import DialogPrevPaymentInfo from "./DialogPrevPaymentInfo";
import {HelpBadge} from "../../../../../components";
import {compose} from "recompose";
import {connect} from "react-redux";
import {setOrganization} from "../../../../../AppState";
import {store} from "react-notifications-component";
import organizationPaymentTypes from "../../../../../constants/organizationPaymentTypes";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import alertNotification from "../../../../../common/alertNotification";

class FormOrganizationBankDetails extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            legals: [],

            paymentTypes: props.organization.paymentType,
            prevPaymentInfo: {},
            currentLegal: {},

            isShowBackdrop: false
        }
    }

    componentDidMount = async () => {
        await this.getLegals();
    }

    getLegals = async () => {

        const legals = await axiosInstance.get(`/v1/legal/get-organization-legals/${ this.props.organization._id }`).then((res) => {
            return res.data.data.legals.filter(t => !!t.paymentShopId)
        });
        const currentLegal = legals.find((t) => t.relevant) || {};

        await this.setState({
            legals,
            currentLegal
        })

    }

    onCreateBankPoint = async () => {
        this.setState({isShowBackdrop: true});

        const {organization} = this.props;
        const info = organization?.legal?.info || {};

        const response = await axiosInstance.put(`${urls["create-organization-shop"]}/${organization?._id}`, {
            organizationId: organization?._id,
            ...info
        }).catch((error) => {
            return null
        });

        if (!response) {

            alertNotification({
                title: allTranslations(localization.notificationErrorTitle),
                message: allTranslations(localization.notificationErrorBankPointCreationError),
                type: 'danger',
            })

            this.setState({isShowBackdrop: false});

            return null
        }

        alertNotification({
            title: allTranslations(localization.notificationSuccessTitleSuccess),
            message: allTranslations(localization.notificationSuccessBankPointChangedSuccessfully),
            type: 'success',
        })

        await this.onUpdateOrganization();
    }
    onSavePaymentTypes = async () => {
        const {organization} = this.props;
        const form = organization?.legal?.form || "";
        this.setState({isShowBackdrop: true});

        const response = await axiosInstance.post(`${urls["organizations-request-payment-type"]}/${this.props.organization._id}`, {
            paymentType: (form === "ooo" || form === "ip") ? "split" : "safe"
        }).catch((err) => {
            return null
        });

        if (!response) {

            alertNotification({
                title: allTranslations(localization.notificationErrorTitle),
                message: allTranslations(localization.notificationErrorPaymentTerminalChangeError),
                type: 'danger',
            })

            this.setState({isShowBackdrop: false});
        }

        alertNotification({
            title: allTranslations(localization.notificationSuccessTitleSuccess),
            message: allTranslations(localization.notificationSuccessRequestChangePaymentTerminalsent),
            type: 'success',
        })

        await this.onUpdateOrganization();
    }

    onUpdateOrganization = async () => {
        const organizationAjax = await axiosInstance.get(`${urls["get-me-organization"]}`).then((res) => {
            return res.data.data.organization;
        });
        this.props.setOrganization(organizationAjax);

        this.setState({isShowBackdrop: false});
    }

    getTooltip = () => {
        const {organization} = this.props;
        const form = organization?.legal?.form || "";

        if (form === "ooo" || form === "ip") {
            return allTranslations(localization.organizationAboutRequestPaymentTerminalChange, {
                from: organizationPaymentTypes[organization?.paymentType || "default"],
                to: organizationPaymentTypes['split']
            });
        }
        if (form === "individual") {
            return allTranslations(localization.organizationAboutRequestPaymentTerminalChange, {
                from: organizationPaymentTypes[organization?.paymentType || "default"],
                to: organizationPaymentTypes['safe']
            });
        }
    }

    getPreviousPaymentInfo = (items) => {
        return JSON.parse(JSON.stringify([...items])).reverse();
    }

    isDisabledButtonCreate = () => {
        const { organization } = this.props;

        if ((organization.previousPaymentInfo || []).length <= 0){
            return false
        }

        let currentInfo = {...organization.legal.info};
        let prevInfo = {...organization.previousPaymentInfo[0]['info']};

        return Boolean(
            currentInfo.bankAccount_account === prevInfo.bankAccount_account &&
            currentInfo.bankAccount_bankName === prevInfo.bankAccount_bankName &&
            currentInfo.bankAccount_bik === prevInfo.bankAccount_bik &&
            currentInfo.bankAccount_korAccount === prevInfo.bankAccount_korAccount
        )
    }

    render() {
        const {legals, currentLegal, prevPaymentInfo, paymentTypes, isShowBackdrop} = this.state;
        const {organization, account} = this.props;

        return (
            <Box maxWidth={900}>

                <Grid container spacing={5}>
                    <Grid item xs={7}>
                        <Box mb={3}>
                            <Grid container alignItems="center">
                                <Grid item>
                                    <Typography variant="h4">{allTranslations(localization.organizationAboutBankPoints)}</Typography>
                                </Grid>
                                <Grid item>
                                    <HelpBadge tooltip={allTranslations(localization.organizationAboutBankPointsTooltip)}/>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mb={3}>
                            <Button
                                variant="text"
                                disabled={this.isDisabledButtonCreate()}
                                onClick={this.onCreateBankPoint}
                            >{allTranslations(localization.organizationAboutButtonsCreateBankPoint)}</Button>
                        </Box>

                        {
                            Boolean(Object.keys(currentLegal).length > 0) && (
                                <Box mb={4} px={3} py={2} border="1px solid rgba(168, 171, 184, 0.6)" borderRadius={5}>
                                    <Typography variant="h5">{allTranslations(localization.organizationAboutCurrentBankPoint)}: {currentLegal.paymentShopId}</Typography>
                                </Box>
                            )
                        }

                        {
                            Boolean((legals || []).length > 0) && (
                                <Box mb={4} px={3} py={2} border="1px solid rgba(168, 171, 184, 0.6)" borderRadius={5}>
                                    <Grid container spacing={1}>
                                        {
                                            legals.map((paymentInfo) => (
                                                <Grid item xs={12}>
                                                    <Typography variant="h5">{allTranslations(localization.organizationAboutLastBankPoint)}: <Link onClick={() => this.setState({ prevPaymentInfo: paymentInfo })}>{paymentInfo.paymentShopId}</Link></Typography>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </Box>
                            )
                        }
                    </Grid>

                    {
                        Boolean(organization?.paymentShopId) && (
                            <Grid item xs={5}>
                                <Box mb={3}>
                                    <Grid container spacing={0} alignItems="center">
                                        <Grid item>
                                            <Typography variant="h4">{allTranslations(localization.organizationAboutPaymentTerminal)}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <HelpBadge tooltip={allTranslations(localization.organizationAboutPaymentTerminalTooltip)}/>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box mb={3}>
                                    <Typography variant="h5">{allTranslations(localization.organizationAboutCurrentPaymentTerminal)}:<br/>{organizationPaymentTypes[paymentTypes || "default"]}</Typography>
                                </Box>

                                <Tooltip title={this.getTooltip()} arrow>
                                    <Button variant="contained" size="small" fullWidth onClick={this.onSavePaymentTypes}>{allTranslations(localization.organizationAboutButtonsRequestPaymentTerminalChange)}</Button>
                                </Tooltip>
                            </Grid>
                        )
                    }
                </Grid>

                <Backdrop open={isShowBackdrop} invisible={isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

                <DialogPrevPaymentInfo
                    isOpen={Object.keys(prevPaymentInfo).length > 0}
                    data={prevPaymentInfo}
                    onClose={() => this.setState({prevPaymentInfo: {}})}
                />

            </Box>
        )
    }
}

export default compose(
    connect(
        state => ({
            organization: state.app.organization,
            account: state.app.account
        }),
        dispatch => ({
            setOrganization: (organization) => dispatch(setOrganization(organization))
        }),
    ),
)(FormOrganizationBankDetails);
