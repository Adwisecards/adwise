import React, {Component} from 'react';
import {
    Box,
    Tab,
    Grid,
    Tabs,
    Button,
    Tooltip,
    Backdrop,
    Typography,
    CircularProgress
} from '@material-ui/core';
import {withStyles} from "@material-ui/styles";
import {formatMoney} from "../../../helper/format";
import {
    InfoCard,
    TableTransaction,
    TableOrganization,
    FormRequisites,
    DialogWithdrowalRequest
} from './components'
import {FlagGold, SmallLogo} from '../../../icons'
import prettify from '../../../utils/prettifyNumber';
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import currency from "../../../constants/currency";
import alertNotification from "../../../common/alertNotification";
import {getPageFromCount} from "../../../common/pagination";

class ManagerAbout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organizations: [],
            transacrtions: [],

            activeTab: 'organization', // organization || transaction

            totalStats: {},
            managerStats: {},
            pagination: {
                page: 1
            },
            filterTransacrtions: {
                page: 1,
                limit: 20
            },

            isLoading: false,
            isUpdate: true,
            isLoadingTransacrtions: true,
            isDialogWithdrowalRequest: false,
            isShowBackdrop: false
        }
    }

    componentDidMount = () => {
        this.onStartPage();
    }

    onStartPage = () => {
        this.onLoadManagerOrganization();
        this.onGetManagerStatics();
        this.onGetManagerOperation();
    }

    onLoadManagerOrganization = () => {
        axiosInstance.get(urls["get-manager-organizations"]).then((response) => {
            this.setState({
                organizations: response.data.data.organizations,
                isLoading: false
            })
        });
    }
    onGetManagerStatics = () => {
        axiosInstance.get(urls['get-wisewin-statistics']).then((response) => {
            this.setState({
                managerStats: response.data.data
            })
        })
    }

    onGetManagerOperation = () => {
        this.setState({ isLoadingTransacrtions: true });

        const searchUrl = this.getFilterManagerOperation();

        axiosInstance.get(`${ urls["manager-get-manager-operations"] }${ searchUrl }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filterTransacrtions.limit);

            this.setState({
                transacrtions: response.data.data.operations,
                pagination: pagination,
                isLoadingTransacrtions: false
            })
        });
    }
    getFilterManagerOperation = () => {
        let filter = [];
        const filterTransacrtions = {...this.state.filterTransacrtions};

        Object.keys(filterTransacrtions).map((key) => {
            filter.push(`${ key }=${ filterTransacrtions[key] }`)
        });

        return `?${ filter.join('&') }`
    }
    onChangeFilterManagerOperation = (filterTransacrtions) => {
        this.setState({
            filterTransacrtions
        }, () => {
            this.onGetManagerOperation();
        })
    }

    downloadRequisites = () => {
        window.open(this.props.app.account.application);
    }

    onCreateLegalWithdrawalRequest = async ({ deposit: amount }) => {

        this.setState({ isShowBackdrop: true });

        const form = {
            walletId: this.props?.app?.account?.wallet?._id,
            comment: `${allTranslations(localization['managerAbout.withdrawalRequestAmount'])} ${amount}${currency.rub}`,
            timestamp: new Date(),
            sum: amount
        };
        const response = await axiosInstance.post(`/v1/finance/create-legal-withdrawal-request`, form).then((response) => {
            return response
        }).catch((error) => {
           return {error: true, ...error.response}
        });

        this.setState({ isShowBackdrop: false });

        if (response.error) {
            return null
        }

        alertNotification({
            title: allTranslations(localization["notificationSystemNotification"]),
            message: allTranslations(localization['managerAbout.successfullyCreatedWithdrawalRequest']),
            type: "success"
        })

        this.setState({ isDialogWithdrowalRequest: false });

    }

    _getFrozenPoints = (managerStats) => {
        const wallet = this.props?.app?.account?.wallet || {};
        return wallet?.frozenPointsSum || 0
    }
    _getManagerPoints = () => {
        const wallet = this.props?.app?.account?.wallet || {};
        return wallet.points;
    }


    render() {
        const {classes, app} = this.props;
        const {
            isLoading,
            isLoadingTransacrtions,

            organizations,

            transacrtions,
            filterTransacrtions,

            managerStats,

            pagination
        } = this.state;

        const isShowButtonDownloadRequisites = Boolean(app?.account?.application || false);
        const frozenPoints = this._getFrozenPoints(managerStats);

        return (
            <Grid container>
                <Grid container item xs={12}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h1" component="h1">
                                {allTranslations(localization.managerTitle)}
                            </Typography>
                        </Grid>
                        {
                            isShowButtonDownloadRequisites && (
                                <Grid item>

                                    <Box css={{border: "1px solid rgba(168, 171, 184, 0.6)"}} px={3} pt={2} pb={1} borderRadius={4} className={classes.buttonDownloadRequisites} onClick={this.downloadRequisites}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M26.25 3.75H25.3125V2.8125C25.3125 1.26169 24.0508 0 22.5 0H3.75C2.19919 0 0.9375 1.26169 0.9375 2.8125V25.4375C0.9375 26.9883 2.19919 28.25 3.75 28.25H4.6875V29.1875C4.6875 30.7383 5.94919 32 7.5 32H26.25C27.8008 32 29.0625 30.7383 29.0625 29.1875V6.5625C29.0625 5.01169 27.8008 3.75 26.25 3.75ZM5.51125 7.22544C4.98 7.75663 4.6875 8.46287 4.6875 9.21412V26.375H3.75C3.23306 26.375 2.8125 25.9544 2.8125 25.4375V2.8125C2.8125 2.29556 3.23306 1.875 3.75 1.875H22.5C23.0169 1.875 23.4375 2.29556 23.4375 2.8125V3.75H10.1516C9.40037 3.75 8.69412 4.04256 8.16294 4.57375L5.51125 7.22544ZM10.3125 5.625V9.375H6.5625V9.21412C6.5625 8.96375 6.66 8.72831 6.83706 8.55125L9.48875 5.89956C9.66581 5.7225 9.90125 5.625 10.1516 5.625H10.3125ZM27.1875 29.1875C27.1875 29.7044 26.7669 30.125 26.25 30.125H7.5C6.98306 30.125 6.5625 29.7044 6.5625 29.1875V11.25H11.25C11.7677 11.25 12.1875 10.8302 12.1875 10.3125V5.625H26.25C26.7669 5.625 27.1875 6.04556 27.1875 6.5625V29.1875Z"/>
                                                </svg>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h5">{allTranslations(localization.commonDownloadRequisites)}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>
                <Grid container item xs={12} className={classes.wrapTitle}>
                    <Typography variant="h2" component="h2" className={classes.secondTitle}>
                        {allTranslations(localization.managerSubtitle)}
                    </Typography>
                </Grid>
                <Grid container item xs={12} className={classes.cardsW}>
                    <Grid item xs="auto" className={classes.card} style={{minWidth: '154px'}}>
                        <Box>
                            <Typography variant="h4" component="h4" className={classes.cardTitle}>
                                {allTranslations(localization.managerWisewinTariff)}
                            </Typography>
                            <Grid container justify="flex-start">
                                <FlagGold color={managerStats.tariffName}/>
                                <Typography className={classes.goldText} style={{ color: managerStats.tariffName }}>{ managerStats.wisewinPacket }</Typography>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.card}>
                        <Box>
                            <Typography variant="h4" component="h4" className={classes.cardTitle}>
                                {allTranslations(localization.managerYourBalance)}
                            </Typography>
                            <Grid container justify="space-between" alignItems="center">
                                <Typography variant="h5" component="h5" className={classes.cardValue} style={{padding: '0 5px 0 0',}}>
                                    {formatMoney(this._getManagerPoints(), 2, '.')}
                                </Typography>
                                {/*<Typography variant="h5" component="h5" className={classes.cardValue} style={{padding: '0 5px 0 0',}}>*/}
                                {/*    {formatMoney((managerStats.wallet) ? managerStats.wallet.points : 0, 2, '.')}*/}
                                {/*</Typography>*/}
                                <SmallLogo/>
                                <Typography variant="body2" style={{padding: '0 5px',}}>
                                    {allTranslations(localization.managerFrozenPoints)}
                                </Typography>
                                <Typography variant="h5" component="h5" className={classes.cardValue}>
                                    {formatMoney(frozenPoints, 2, '.')}
                                </Typography>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container item xs={3} className={classes.card}>
                        <Box style={{width: '70%'}}>
                            <Typography
                                variant="h4"
                                component="h4"
                                className={classes.cardTitle}
                                style={{marginBottom: '0', lineHeight: '19px'}}
                            >
                                {allTranslations(localization.managerCountFreeLicenses)}
                            </Typography>
                        </Box>
                        <Box style={{width: '30%', alignSelf: "flex-end", paddingBottom: '4px'}}>
                            <Typography variant="h5" component="h5" className={classes.cardValue}
                                        style={{textAlign: 'end'}}>
                                {prettify(managerStats.remainingPackets)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container item xs={12} className={classes.cards}>
                    <Grid item xs="auto" className={classes.card}>
                        <InfoCard title={`${allTranslations(localization.managerManagerPercentSum)} ${currency.rub}`} value={formatMoney(managerStats.managerPercentSum, 2, '.')}/>
                    </Grid>
                    <Grid item xs="auto" className={classes.card}>
                        <InfoCard title={`${allTranslations(localization.managerPacketSum)} ${currency.rub}`} value={formatMoney(managerStats.packetSum, 2, '.')}/>
                    </Grid>
                    <Grid item xs="auto" className={classes.card}>
                        <InfoCard title={`${allTranslations(localization.managerPacketRefSum)} ${currency.rub}`} value={formatMoney(managerStats.packetRefSum, 2, '.')}/>
                    </Grid>
                    <Grid item xs="auto" className={classes.card}>
                        <InfoCard title={`${allTranslations(localization.managerDepositSum)} ${currency.rub}`} value={formatMoney(managerStats.depositSum, 2, '.')}/>
                    </Grid>
                    <Grid item xs="auto" className={classes.card}>
                        <InfoCard title={allTranslations(localization.managerManagerOrganizations)} value={formatMoney(managerStats.managerOrganizations)}/>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Box mt={2}>
                        <Grid container spacing={4}>
                            <Grid item>
                                <Tabs value={this.state.activeTab} onChange={(event, activeTab) => this.setState({ activeTab })}>
                                    <Tab style={{ maxWidth: 'initial' }} value="organization" label={allTranslations(localization.managerTabsOrganization)}/>
                                    <Tab style={{ maxWidth: 'initial' }} value="transaction" label={allTranslations(localization.managerTabsTransaction)}/>
                                    <Tab style={{ maxWidth: 'initial' }} value="requisites" label={allTranslations(localization.managerTabsRequisiteson)}/>
                                </Tabs>
                            </Grid>
                            <Grid item>
                                <Tooltip title={allTranslations(localization['managerAbout.createWithdrawalRequest'])}>
                                    <Button variant="contained" onClick={() => this.setState({isDialogWithdrowalRequest: true})}>{allTranslations(localization['managerAbout.createWithdrawalRequest'])}</Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid container item xs={12} className={classes.table}>

                    {
                        ( this.state.activeTab === 'organization' ) && (
                            <TableOrganization
                                rows={organizations}
                                isLoading={isLoading}
                            />
                        )
                    }

                    {
                        ( this.state.activeTab === 'transaction' ) && (
                            <TableTransaction
                                rows={transacrtions}
                                pagination={pagination}
                                filter={filterTransacrtions}
                                isLoading={isLoadingTransacrtions}
                                onChangeFilter={this.onChangeFilterManagerOperation}
                            />
                        )
                    }

                    {
                        (this.state.activeTab === "requisites") && (
                            <FormRequisites/>
                        )
                    }

                </Grid>

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

                <DialogWithdrowalRequest
                    isOpen={this.state.isDialogWithdrowalRequest}
                    organizationPoint={this._getManagerPoints()}
                    onClose={() => this.setState({isDialogWithdrowalRequest: false})}
                    onSubmit={this.onCreateLegalWithdrawalRequest}
                />
            </Grid>
        );
    }
}

const styles = {
    wrapTitle: {
        marginTop: '40px',
    },
    secondTitle: {
        fontSize: '24px',
        fontWeight: '400',
        lineHeight: '26px',
    },
    cards: {
        marginTop: '8px',
        maxWidth: '1300px',
        marginLeft: -8,
    },
    cardsW: {
        marginTop: '22px',
        marginLeft: -8
    },
    card: {
        marginLeft: 8,

        padding: '20px',
        border: '0.5px solid #CBCCD4',
        borderRadius: '10px',
    },
    table: {
        marginTop: '32px',
    },
    cardTitle: {
        fontSize: '15px',
        fontWeight: 'normal',
        fontHeight: '17px',
        marginBottom: '14px',
    },
    goldText: {
        marginLeft: '8px',
        fontSize: 20,
        lineHeight: '24px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        textTransform: 'capitalize'
    },
    cardValue: {
        fontSize: 20,
        lineHeight: '24px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#8152E4',
    },

    buttonDownloadRequisites: {
        boxShadow: "0 0 0 0 transparent",
        transition: "all 0.5s",
        cursor: "pointer",

        "& svg path": {
            fill: "#ED8E00",
            transition: "all 0.5s",
        },
        '&:hover': {
            boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.25)",

            "& svg path": {
                fill: "#8152E4",
            },
        }
    },
};

export default withStyles(styles)(ManagerAbout)

