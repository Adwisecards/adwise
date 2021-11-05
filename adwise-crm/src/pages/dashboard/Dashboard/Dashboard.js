import React, {Component, useEffect, useState} from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Dialog,
    TextField,
    CircularProgress,
    Backdrop
} from '@material-ui/core';
import {
    makeStyles,
    withStyles
} from "@material-ui/styles";
import {
    InfoCard,
    MyCompanyCard,
    TopEmployees,
    RecentTransactions,
    PersonalManager,
    GraphShoppingSchedule,
    GraphShoppingScheduleSumm
} from './components';
import moment from "moment";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {formatMoney} from "../../../helper/format";
import {SmallLogo} from "../../../icons/managers";
import clsx from "clsx";
import {store} from "react-notifications-component";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import alertNotification from "../../../common/alertNotification";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organizationStatistics: {
                bonusSum: 0,
                marketingSum: 0,
                purchaseCount: 0,
                purchaseSum: 0
            },
            couponStats: {
                active: 0,
                all: 0
            },

            purchases: [],
            operations: [],

            isOpenModalWithdrawalFunds: false,
            isOpenModalSuccess: false,
            isOpenBackdrop: false
        }
    }

    componentDidMount = () => {
        this.getOrganizationStatistics();
        this.getOrganizationPurchase();
        this.getStatsCoupons();
    }

    getOrganizationStatistics = () => {
        const organization = this.props.app.organization;

        if (!organization._id) {
            return null
        }

        axiosInstance.get(`${urls["get-organization-statistics"]}${organization._id}`).then((response) => {
            this.setState({
                organizationStatistics: response.data.data.organizationStatistics || {}
            })
        })
    }

    getOrganizationPurchase = () => {
        const urlSearch = `?dateFrom=${ moment().subtract(7, 'days').format('YYYY-MM-DD') }&dateTo=${ moment().format('YYYY-MM-DD') }&limit=999&confirmed=true`;
        this.setState({ purchases: [] })

        axiosInstance.get(`${ urls["get-purchases"] }${ this.props.app.organization._id }${ urlSearch }`).then((response) => {
            let purchases = response.data.data.purchases;

            purchases.sort((a, b) => {
                if (a.timestamp > b.timestamp) {
                    return 1
                }
                if (a.timestamp < b.timestamp) {
                    return -1
                }

                return 0
            })

            this.setState({ purchases: purchases })
        })
    }

    getStatsCoupons = () => {
        axiosInstance.get(`${ urls["get-coupons"] }${ this.props.app.organization._id }?limit=999&all=1`).then(response => {
            const coupons = response.data.data.coupons;
            const couponStats = {
                active: coupons.filter((coupon) => coupon.disabled === false).length,
                all: coupons.length
            };

            this.setState({
                couponStats
            })
        })
    }

    getOperations = () => {
        return null

        axiosInstance.get(`${ urls["get-operations"] }${ this.props.app.organization._id }`).then((response) => {
           this.setState({
               operations: response.data.data.operations
           })
        });
    }

    openModalWithdrawalFunds = () => {
        this.setState({isOpenModalWithdrawalFunds: true});
    }
    onSensWithdrawalFunds = (props) => {
        this.setState({
            isOpenModalWithdrawalFunds: false,
            isOpenBackdrop: true
        })

        const body = {
            sum: props,
            walletId: this.props.app.organization.wallet._id,
            currency: this.props.app.organization.wallet.currency
        };

        axiosInstance.post(urls['creating-withdrawal-request'], body).then((response) => {
            this.setState({
                isOpenBackdrop: false,
                isOpenModalWithdrawalFunds: false,
                isOpenModalSuccess: true
            })
        }).catch((err) => {
            this.setState({
                isOpenBackdrop: false
            })

            const response = err.response;

            if (!response){

                alertNotification({
                    title: allTranslations(localization.notificationErrorTitle),
                    message: allTranslations(localization.notificationErrorServerError),
                    type: 'danger',
                })

                return null
            }

            const error = err.response.data.error;
            const errorMessage = error.details;

            alertNotification({
                title: allTranslations(localization.notificationErrorTitle),
                message: errorMessage,
                type: 'danger',
            })

        });
    }
    closeModalWithdrawalFunds = () => {
        this.setState({isOpenModalWithdrawalFunds: false});
    }

    _routeToOrganization = () => {
        this.props.history.push('/organization')
    }


    _countPaidPurchases = () => {
        const { organizationStatistics } = this.state;

        return (organizationStatistics?.cashPurchaseCount + organizationStatistics?.onlinePurchaseCount)
    }
    _salesAmount = () => {
        const { organizationStatistics } = this.state;

        return (organizationStatistics?.cashPurchaseSum + organizationStatistics?.onlinePurchaseSum)
    }
    _cashbackAmount = () => {
        const { organizationStatistics } = this.state;

        return (organizationStatistics?.cashCashbackSum + organizationStatistics?.onlineCashbackSum)
    }
    _marketingAmount = () => {
        const { organizationStatistics } = this.state;

        return (organizationStatistics?.cashMarketingSum + organizationStatistics?.onlineMarketingSum)
    }
    _depositAmount = () => {
        const { organizationStatistics } = this.state;

        return (organizationStatistics?.depositPayoutSum)
    }

    render() {
        const {classes, app, setOrganization} = this.props;
        const {account} = app;

        if (!app.organization._id) {
            return (
                <Box p={3} bgcolor={'white'} display="flex" flexDirection="column" justifyContent="center" alignItems="center">

                    <Box mb={2}>
                        <img src="/source/svg/dashboard/not_organization.svg"/>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="h1">{allTranslations(localization.dashboardTitleNoOrganization)}</Typography>
                    </Box>

                    <Box>
                        <Button variant="contained" onClick={this._routeToOrganization}>{allTranslations(localization.commonCreate)}</Button>
                    </Box>
                </Box>
            )
        }

        return (
            <Grid container spacing={1} className={classes.container}>
                <Grid item className={classes.header} container spacing={1}>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <MyCompanyCard organization={app.organization}/>
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <TopEmployees organization={app.organization}/>
                        </Box>
                    </Grid>
                    {
                        false && (
                            <Grid item xs="auto" className={classes.element}>
                                <Box className={classes.card}>
                                    <RecentTransactions organization={app.organization}/>
                                </Box>
                            </Grid>
                        )
                    }
                    <Grid item xs={2} className={classes.element}>
                        <Box className={classes.card}>
                            <PersonalManager organization={app.organization} setOrganization={setOrganization}/>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item className={classes.body} container spacing={1}>
                    <Grid item xs={5} className={classes.element}>
                        <Box className={classes.card} style={{display: 'flex', padding: 0}}>
                            <GraphShoppingSchedule
                                organizationId={this.props.app.organization._id}
                                purchasesInitial={this.state.purchases}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={5} className={classes.element}>
                        <Box className={classes.card} style={{display: 'flex', padding: 0}}>
                            <GraphShoppingScheduleSumm
                                organizationId={this.props.app.organization._id}
                                purchasesInitial={this.state.purchases}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={2} className={classes.element}>
                        <Grid container spacing={1}>
                            <Grid item className={classes.element} xs={12}>
                                <Box className={classes.card}>
                                    <Balance
                                        organization={app.organization}
                                        account={app.account}
                                        openModalWithdrawalFunds={this.openModalWithdrawalFunds}
                                    />
                                </Box>
                            </Grid>
                            <Grid item className={classes.element} xs={12}>
                                <Box className={classes.card}>
                                    <InfoCard
                                        title={allTranslations(localization.dashboardEmployees)}
                                        value={app.organization.employees.length}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.footer} container spacing={1}>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <InfoCard
                                title={allTranslations(localization.dashboardNumberPaidPurchases)}
                                updatedAt={this.state.organizationStatistics.updatedAt}
                                value={formatMoney(this._countPaidPurchases())}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <InfoCard
                                title={allTranslations(localization.dashboardAmountSales)}
                                updatedAt={this.state.organizationStatistics.updatedAt}
                                value={`<span>${formatMoney(this._salesAmount(), 2, '.')} <span style='opacity: 0.3'>₽</span></span>`}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <InfoCard
                                title={allTranslations(localization.dashboardCashbackAmount)}
                                updatedAt={this.state.organizationStatistics.updatedAt}
                                value={`<span>${formatMoney(this._cashbackAmount(), 2, '.')} <span style='opacity: 0.3'>₽</span></span>`}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <InfoCard
                                title={allTranslations(localization.dashboardMarketingAmount)}
                                updatedAt={this.state.organizationStatistics.updatedAt}
                                value={`<span>${formatMoney(this._marketingAmount(), 2, '.')} <span style='opacity: 0.3'>₽</span></span>`}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <InfoCard
                                title={allTranslations(localization.dashboardAmountDeposit)}
                                updatedAt={this.state.organizationStatistics.updatedAt}
                                value={`<span>${formatMoney(this._depositAmount(), 2, '.')} <span style='opacity: 0.3'>₽</span></span>`}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <InfoCard
                                title={allTranslations(localization.dashboardNumberSharesActiveTotal)}
                                value={`<span>${this.state.couponStats.active} <span style='opacity: 0.3'>/</span> ${this.state.couponStats.all}</span>`}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs="auto" className={classes.element}>
                        <Box className={classes.card}>
                            <ActivePacket packet={app.organization.packet}/>
                        </Box>
                    </Grid>
                </Grid>

                <ModalWithdrawalFunds
                    isOpen={this.state.isOpenModalWithdrawalFunds}

                    organization={app.organization}

                    onSend={this.onSensWithdrawalFunds}
                    onClose={this.closeModalWithdrawalFunds}
                />

                <ModalSuccess
                    isOpen={this.state.isOpenModalSuccess}
                    onClose={() => this.setState({isOpenModalSuccess: false})}
                />

                <Backdrop open={this.state.isOpenBackdrop} invisible={this.state.isOpenBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </Grid>
        );
    }
}

const styles = {
    container: {
        minHeight: 'calc(100vh - 70px)',
        flexDirection: 'column',
        overflow: 'hidden'
    },

    header: {
        minHeight: 300
    },
    body: {
        flex: 1,
        minHeight: 400
    },
    footer: {
        minHeight: 150
    },

    element: {
        display: 'flex',
        flex: 1
    },

    card: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: "hidden"
    },
};

const ActivePacket = (props) => {
    const {packet} = props;

    if (!packet) {
        return (
            <InfoCard
                title={allTranslations(localization.commonTariff)}
                value={allTranslations(localization.commonNoPackage)}
            />
        )
    }

    const finalDate = moment(packet.timestamp).add(1, 'year').format('DD.MM.YYYY');

    return (
        <InfoCard
            title={allTranslations(localization.commonTariff)}
            value={packet.name}
            caption={`${allTranslations(localization.commonBefore)} ${finalDate}`}
        />
    )
}
const Balance = (props) => {
    const {account, organization, openModalWithdrawalFunds} = props;

    const {points, frozenPoints} = organization.wallet;

    const pointsManager = account.wallet.points;
    const frozenPointsManager = account.wallet.frozenPoints;

    const classes = useStyles();

    const [frozenPoint, setFrozenPoint] = useState(0);
    const [frozenPointManager, setFrozenPointManager] = useState(0);

    useEffect(() => {
        let frozenPoint = 0;
        if (!frozenPoints || frozenPoints.length <= 0) {
            return 0
        }

        frozenPoints.map((item) => {
            frozenPoint += item.sum;
        })

        setFrozenPoint(frozenPoint);
    }, []);
    useEffect(() => {
        let frozenPoint = 0;
        if (!frozenPointsManager || frozenPointsManager.length <= 0) {
            return 0
        }

        frozenPointsManager.map((item) => {
            frozenPoint += item.sum;
        })

        setFrozenPointManager(frozenPoint);
    }, []);

    return (
        <div className={classes.sectionBalance}>
            <Box mb={1}>
                <Typography className={classes.sectionTitle}>{allTranslations(localization.commonBalance)}</Typography>
            </Box>

            <Box mb={2}>
                <Typography className={classes.sectionBalanceTitle}>{allTranslations(localization.commonCompany)}</Typography>
                <Typography className={classes.sectionBalanceValue}>

                    {formatMoney(points, 2, '.')}

                    <SmallLogo/>

                </Typography>

                <Typography className={clsx([classes.sectionBalanceTitle, classes.sectionBalanceTitleSmall])}>
                    {allTranslations(localization.dashboardToEnrollment)}
                </Typography>
                <Typography className={clsx([classes.sectionBalanceValue, classes.sectionBalanceValueSmall])}>

                    {formatMoney(frozenPoint, 2, '.')}

                    <SmallLogo/>

                </Typography>

                <Button variant="contained" className={classes.sectionBalanceButton} onClick={openModalWithdrawalFunds}>
                    {allTranslations(localization.dashboardWithdrawFunds)}
                </Button>
            </Box>

            <Box>
                <Typography className={classes.sectionBalanceTitle} dangerouslySetInnerHTML={{__html: allTranslations(localization.dashboardDistributorAdwise)}}/>
                <Typography className={classes.sectionBalanceValue}>

                    {formatMoney(pointsManager, 2, '.')}

                    <SmallLogo/>

                </Typography>

                <Typography className={clsx([classes.sectionBalanceTitle, classes.sectionBalanceTitleSmall])}>
                    {allTranslations(localization.dashboardToEnrollment)}
                </Typography>
                <Typography className={clsx([classes.sectionBalanceValue, classes.sectionBalanceValueSmall])} style={{ marginBottom: 0 }}>

                    {formatMoney(frozenPointManager, 2, '.')}

                    <SmallLogo/>

                </Typography>
            </Box>
        </div>
    )
}
const ModalWithdrawalFunds = (props) => {
    const {isOpen, organization, onClose, onSend} = props;
    const { points } = organization.wallet;
    const [amount, setAmount] = useState(0);

    const classes = useStyles();

    const handleChangeAmount = ({target}) => {
        let value = target.value;

        if (value > points){
            value = points;
        }
        if (!value || value < 0) {
            value = 0;
        }

        setAmount(value)
    }

    const handleCreateWithdrawalRequest = () => {
        onSend(amount);
    }

    return (
        <Dialog
            open={isOpen}
            maxWidth="sm"
            fullWidth
            onClose={onClose}
        >

            <Box p={6}>

                <Box mb={5}>
                    <Typography variant="h2">{allTranslations(localization.dashboardWithdrawalRequestTitle)}</Typography>
                </Box>

                <Box mb={6}>
                    <Box>
                        <Typography style={{marginBottom: 14}} variant="formTitle">{allTranslations(localization.dashboardWithdrawalRequestWithdrawalAmount)}</Typography>

                        <TextField
                            fullWidth
                            placeholder={"0"}
                            value={amount}
                            type="number"
                            helperText={ allTranslations(localization.dashboardWithdrawalRequestAvailableWithdrawal, {points})}
                            variant="outlined"
                            onChange={handleChangeAmount}
                        />
                    </Box>
                </Box>

                <Box>
                    <Button
                        variant="contained"
                        disabled={amount <= 0}
                        className={classes.modalBalanceButton}
                        onClick={handleCreateWithdrawalRequest}
                    >{allTranslations(localization.commonAccept)}</Button>
                </Box>

            </Box>

        </Dialog>
    )
}
const ModalSuccess = (props) => {
    const {isOpen, onClose, email} = props;

    const classes = useStyles();

    return (
        <Dialog
            open={isOpen}
            maxWidth="sm"
            fullWidth
            onClose={onClose}
        >
            <Box className={classes.modalContainer}>
                <Typography variant="h3" className={classes.modalTitle}>{allTranslations(localization.dashboardWithdrawalRequestSuccessTitle)}</Typography>

                <Typography className={classes.modalDescription}>{allTranslations(localization.dashboardWithdrawalRequestSuccessMessage)}</Typography>

                <Button variant="contained" className={classes.modalButton} onClick={props.onClose}>{allTranslations(localization.commonAccept)}</Button>
            </Box>

        </Dialog>
    )
}

const useStyles = makeStyles((theme) => ({
    sectionBalance: {},
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    sectionBalanceTitle: {
        fontSize: 14,
        lineHeight: '17px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    sectionBalanceTitleSmall: {
        fontSize: 12,

        marginTop: 8
    },
    sectionBalanceValue: {
        marginTop: 6,

        fontSize: 26,
        lineHeight: '31px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#8152E4',

        [theme.breakpoints.between(0, 1649)]: {
            fontSize: 21,
        },

        '& svg': {
            marginLeft: 8
        }
    },
    sectionBalanceValueSmall: {
        fontSize: 20,

        marginBottom: 10
    },
    sectionBalanceButton: {
        padding: '3px 12px',

        fontSize: 14,
        lineHeight: '24px',

        fontFeatureSettings: "'ss03' on, 'ss06' on",
        textTransform: 'initial'
    },

    modalBalanceButton: {
        fontSize: 18,
        lineHeight: '36px',
        padding: '3px 22px',
        textTransform: 'initial'
    },

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

export default withStyles(styles)(Dashboard)
