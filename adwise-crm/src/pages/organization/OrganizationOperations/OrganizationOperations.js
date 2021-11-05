import React, {Component, useState} from 'react';
import {
    Box,
    Grid,
    Button,
    Typography,
    Dialog,
    TextField,
    CircularProgress,
    Backdrop, Tooltip
} from '@material-ui/core';
import {
    Table,
    InfoCard,
    DialogDeposit,
    DialogWithdrawalDeposit
} from './components';
import {
    HelpBadge
} from "../../../components";
import {makeStyles, withStyles} from "@material-ui/styles";
import {formatMoney} from "../../../helper/format";
import {SmallLogo} from "../../../icons/managers";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {StagesDocumentVerification} from "../../../components";
import {getPageFromCount} from "../../../common/pagination";
import moment from "moment";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import alertNotification from "../../../common/alertNotification";
import parseSearchUrl from "../../../common/url";

const initialFilter = {
    page: 1,
    limit: 20,
    confirmed: 1
};

class OrganizationOperations extends Component {

    constructor(props) {
        super(props);

        const filter = parseSearchUrl(this.props.history.location.search, initialFilter);

        this.state = {
            countOperations: 1,

            operations: [],

            headerStats: {},
            organizationStats: {},
            filter: filter,
            pagination: {
                countPages: 1
            },

            totalCountRows: 0,

            isLoading: true,
            isOpenModalWithdrawalFunds: false,
            isOpenSuccess: false,
            isOpenDialogDeposit: false,
            isOpenDialogWithdrawalDeposit: false,
        }
    }

    componentDidMount = () => {
        this.onLoadOperations();
        this.getHeaderStats();
        this.getOrganizationStats();
    }

    getOrganizationStats = () => {
        const organizationId = this.props.app.organization._id;

        axiosInstance.get(`${ urls["get-organization-statistics"] }${ organizationId }`).then((response) => {
            let organizationStats = {...response.data.data.organizationStatistics};
            if (!organizationStats) {
                organizationStats = {};
            }

            organizationStats.wallet = this.props.app.organization.wallet;

            this.setState({
                organizationStats
            });
        });
    }

    getHeaderStats = () => {
        const wallet = this.props.app.organization.wallet;

        let headerStats = {
            balance: wallet.points,
            frozenPoint: 0,
            marketingSum: 0,
            cashbackSum: 0
        };

        const frozenPoint = wallet.frozenPoints.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.sum
        }, 0);

        headerStats['frozenPoint'] = frozenPoint;

        this.setState({
            headerStats
        })
    }

    onLoadOperations = () => {
        this.setState({ isLoading: true });

        const organizationId = this.props.app.organization._id;
        const filter = this.getFilterOperations();
        window.history.replaceState(null,null, `/operations?${filter}`);
        axiosInstance.get(`${urls["get-operations"]}${organizationId}?${ filter }`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.countPages = getPageFromCount(response.data.data.count, this.state.filter.limit);

            this.setState({
                operations: response.data.data.operations,
                totalCountRows: response.data.data.count,
                pagination: pagination,

                isLoading: false
            })
        })
    }
    getFilterOperations = () => {
        const filter = {...this.state.filter};
        let filterList = [];

        Object.keys(filter).map((key) => {
            filterList.push(`${ key }=${ filter[key] }`);
        });

        return filterList.join('&')
    }

    onChangeFilter = (filter) => {
        this.setState({ filter }, () => {
            this.onLoadOperations();
        });
    }

    openModalWithdrawalFunds = () => {
        this.setState({isOpenModalWithdrawalFunds: true});
    }
    onSensWithdrawalFunds = () => {
        this.setState({
            isOpenModalWithdrawalFunds: false,
            isOpenBackdrop: true
        })

        setTimeout(() => {
            this.setState({
                isOpenBackdrop: false,
                isOpenModalWithdrawalFunds: false,
                isOpenModalSuccess: true
            })
        }, 3000);
    }
    closeModalWithdrawalFunds = () => {
        this.setState({isOpenModalWithdrawalFunds: false});
    }

    onExportOperations = () => {
        this.setState({isOpenBackdrop: true})

        const organizationId = this.props.app.organization._id;
        const filter = this.getFilterOperations();
        const url = `${urls["get-operations"]}${organizationId}?${ filter }&export=1`;

        axiosInstance.get(url, {
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'operations.xlsx');
            document.body.appendChild(link);
            link.click();

            this.setState({isOpenBackdrop: false})
        })
    }

    onReplenishDeposit = async (form) => {

        this.setState({ isOpenBackdrop: true });

        const responseDeposit = await axiosInstance.post(`${urls["organization-set-deposit"]}/${this.props.app.organization?.wallet._id}`, {
            deposit: form.deposit
        }).then((res) => {
            return res
        }).catch((err) => {
            return {
                error: true,
                ...err.response
            }
        })

        if (responseDeposit.error) {
            this.setState({ isOpenBackdrop: false });

            alertNotification({
                title: "Ошибка",
                type: "danger",
                message: responseDeposit?.data?.error?.message || 'Ошибка сервера'
            });

            return null
        }

        const organization = await axiosInstance.get(urls["get-me-organization"]).then((res) => {
            return res.data.data.organization
        })

        this.props.setOrganization(organization);

        await this.onLoadOperations();
        await this.getHeaderStats();
        await this.getOrganizationStats();

        this.setState({ isOpenBackdrop: false, isOpenDialogDeposit: false });

    }
    onReplenishWithdrawalDeposit = async (form) => {

        this.setState({ isOpenBackdrop: true });

        const responseDeposit = await axiosInstance.post(`${urls["organization-set-deposit"]}/${this.props.app.organization?.wallet._id}`, {
            deposit: form.deposit
        }).then((res) => {
            return res
        }).catch((err) => {
            return {
                error: true,
                ...err.response
            }
        })

        if (responseDeposit.error) {
            this.setState({ isOpenBackdrop: false });

            alertNotification({
                title: "Ошибка",
                type: "danger",
                message: responseDeposit?.data?.error?.message || 'Ошибка сервера'
            });

            return null
        }

        const organization = await axiosInstance.get(urls["get-me-organization"]).then((res) => {
            return res.data.data.organization
        })

        this.props.setOrganization(organization);

        await this.onLoadOperations();
        await this.getHeaderStats();
        await this.getOrganizationStats();

        this.setState({ isOpenBackdrop: false, isOpenDialogWithdrawalDeposit: false });

    }

    render() {
        const {classes, app} = this.props;
        const {global, account} = app;
        const {operations, isLoading, headerStats, organizationStats, pagination, totalCountRows, isOpenDialogDeposit, isOpenDialogWithdrawalDeposit} = this.state;

        return (
            <Box>

                <Box mb={2}>
                    <Typography variant="h1">{allTranslations(localization.operationsTitle)}</Typography>
                </Box>

                <Box mb={4}>
                    <StagesDocumentVerification/>
                </Box>

                <Box mb={5}>
                    <Box mb={1}>
                        <Grid container spacing={1} justify="flex-start">
                            <Grid item className={classes.element}>
                                <Box className={classes.card}>
                                    <BalanceCard
                                        openModalWithdrawalFunds={this.openModalWithdrawalFunds}
                                        headerStats={organizationStats}
                                    />
                                </Box>
                            </Grid>

                            <Grid item className={classes.element}>
                                <Box className={classes.card}>
                                    <DepositCard
                                        balance={formatMoney(organizationStats?.wallet?.points || 0, 2, '.')}
                                        deposit={formatMoney(organizationStats?.depositPayoutSum || 0, 2, '.')}
                                        openModalWithdrawalFunds={() => this.setState({isOpenDialogDeposit: true})}
                                        onOpenDialogWithdrawalDeposit={() => this.setState({isOpenDialogWithdrawalDeposit: true})}
                                    />
                                </Box>
                            </Grid>

                            <Grid item className={classes.element}>
                                <Box className={classes.card}>
                                    <NetProfit headerStats={organizationStats}/>
                                </Box>
                            </Grid>

                            <Grid item className={classes.element}>
                                <Box className={classes.card}>
                                    <MarketingSum headerStats={organizationStats}/>
                                </Box>
                            </Grid>

                        </Grid>
                    </Box>
                    <Grid container spacing={1} justify="flex-start">

                        <Grid item className={classes.element}>
                            <Box className={classes.card}>
                                <InfoBigCard
                                    title={`${allTranslations(localization.operationsStatsCashbackSumTitle)} ₽`}
                                    total={((organizationStats.onlineCashbackSum || 0) + (organizationStats.cashCashbackSum || 0))}
                                    online={organizationStats.onlineCashbackSum}
                                    cash={organizationStats.cashCashbackSum}
                                    tooltip={allTranslations(localization.operationsStatsCashbackSumTooltip)}
                                />
                            </Box>
                        </Grid>

                        <Grid item className={classes.element}>
                            <Box className={classes.card}>
                                <InfoBigCard
                                    title={`${allTranslations(localization.operationsStatsPurchaseSumTitle)} ₽`}
                                    total={((organizationStats.onlinePurchaseSum || 0) + (organizationStats.cashPurchaseSum || 0))}
                                    online={organizationStats.onlinePurchaseSum}
                                    cash={organizationStats.cashPurchaseSum}
                                    tooltip={allTranslations(localization.operationsStatsPurchaseSumTooltip)}
                                />
                            </Box>
                        </Grid>

                        <Grid item className={classes.element}>
                            <Box className={classes.card}>
                                <InfoCard
                                    title={`${allTranslations(localization.operationsStatsWithdrawnSumTitle)} ₽`}
                                    value={formatMoney(organizationStats.withdrawnSum, 2, '.')}
                                    tooltip={allTranslations(localization.operationsStatsWithdrawnSumTooltip)}
                                />
                            </Box>
                        </Grid>

                        <Grid item className={classes.element}>
                            <Box className={classes.card}>
                                <InfoCard
                                    title={`Выплаченно<br/>банком ₽`}
                                    value={formatMoney(organizationStats.paidToBankAccountSum, 2, '.')}
                                    tooltip={`сумма которую вы получили на ваш банковский счет указанный в реквизитах`}
                                />
                            </Box>
                        </Grid>

                        <Grid item className={classes.element}>
                            <Box className={classes.card}>
                                <InfoCard
                                    title={`Списанно<br/>за наличные покупки ₽`}
                                    value={formatMoney(organizationStats.depositPayoutSum, 2, '.')}
                                    tooltip={`Сумма, которая списывается за наличные покупки с депозита организации`}
                                />
                            </Box>
                        </Grid>

                    </Grid>
                </Box>

                <Box mb={4}>
                    <Grid container justify="flex-end">
                        <Grid item>

                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <Typography className={classes.titleExport}>{allTranslations(localization.commonExport)}</Typography>
                                </Grid>

                                <Grid item>
                                    <Button onClick={this.onExportOperations} className={classes.buttonSmallExport} variant="contained">xls</Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Box>

                <Box>
                    <Table
                        global={global}
                        isLoading={isLoading}
                        operations={operations}
                        pagination={pagination}

                        filter={this.state.filter}
                        totalCountRows={totalCountRows}

                        onChangeFilter={this.onChangeFilter}
                    />
                </Box>


                <ModalWithdrawalFunds
                    isOpen={this.state.isOpenModalWithdrawalFunds}

                    onSend={this.onSensWithdrawalFunds}
                    onClose={this.closeModalWithdrawalFunds}
                />

                <DialogDeposit
                    isOpen={isOpenDialogDeposit}
                    organizationPoint={app.organization?.wallet?.points}
                    onClose={() => this.setState({isOpenDialogDeposit: false})}
                    onSubmit={this.onReplenishDeposit}
                />

                <DialogWithdrawalDeposit
                    isOpen={isOpenDialogWithdrawalDeposit}
                    organizationPoint={app.organization?.wallet?.deposit}
                    onClose={() => this.setState({isOpenDialogWithdrawalDeposit: false})}
                    onSubmit={this.onReplenishWithdrawalDeposit}
                />

                <ModalSuccess
                    isOpen={this.state.isOpenSuccess}
                    onClose={() => this.setState({isOpenSuccess: false})}
                />

                <Backdrop open={this.state.isOpenBackdrop} invisible={this.state.isOpenBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </Box>
        )
    }
}

const BalanceCard = (props) => {
    const {openModalWithdrawalFunds, headerStats} = props;
    const classes = useStyles();

    const handleOnGetFrozenPoint = () => {
        return headerStats.wallet.frozenPoints.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.sum
        }, 0);
    }

    return (
        <Box className={classes.cardBalance}>
            <Grid container spacing={0} alignItems="center">
                <Grid item>
                    <Typography className={classes.cardBalanceTitle}>{allTranslations(localization.operationsBalanceCardTitle)}</Typography>
                </Grid>
                <Grid item>
                    <HelpBadge tooltip={allTranslations(localization.operationsBalanceCardTooltip)}/>
                </Grid>
            </Grid>

            <div className={classes.cardBalanceLine}>

                <Typography className={classes.cardBalanceValue}>
                    {(!!headerStats.wallet) ? formatMoney(headerStats.wallet.points, 2, '.') : '—'}
                </Typography>

                <SmallLogo/>

                <Typography className={classes.cardBalanceTitleSmall}>{allTranslations(localization.operationsBalanceCardToEnrollment)}</Typography>

                <Typography
                    className={classes.cardBalanceValueSmall}>{(headerStats.wallet) ? formatMoney(handleOnGetFrozenPoint(), 2, '.') : '—'}</Typography>
                <SmallLogo/>

            </div>

            <Button variant="contained" onClick={openModalWithdrawalFunds} className={classes.cardBalanceButton}>
                {allTranslations(localization.operationsBalanceCardWithdrawFunds)}
            </Button>

        </Box>
    )
}
const DepositCard = (props) => {
    const {openModalWithdrawalFunds, onOpenDialogWithdrawalDeposit, deposit} = props;
    const classes = useStyles();

    return (
        <Box className={classes.cardBalance}>
            <Grid container spacing={0} alignItems="center">
                <Grid item>
                    <Typography className={classes.cardBalanceTitle}>Сумма депозита</Typography>
                </Grid>
                <Grid item>
                    <HelpBadge tooltip="Сумма депозита - это баланс для начисления комиссий AdWise при совершении наличных покупок."/>
                </Grid>
            </Grid>

            <div className={classes.cardBalanceLine}>

                <Typography className={classes.cardBalanceValue}>
                    {deposit}
                </Typography>

                <SmallLogo/>

            </div>

            <Grid container spacing={1}>
                <Grid item>
                    <Tooltip arrow title="Вы можете пополнить сумму депозита для возможности проведения покупок за наличные. Сумма списывается с баланса.">
                        <Button variant="contained" onClick={openModalWithdrawalFunds} className={classes.cardBalanceButton}>
                            Пополнить
                        </Button>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip arrow title="Вывести денежные средства с депозита на счет организации">
                        <Button variant="contained" onClick={onOpenDialogWithdrawalDeposit} className={classes.cardBalanceButton}>
                            Вывести
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>

        </Box>
    )
}
const NetProfit = (props) => {
    const {headerStats} = props;
    const classes = useStyles();

    const totalProfitSum = ((headerStats?.onlineProfitSum || 0) + (headerStats?.cashProfitSum || 0));

    return (
        <Box className={classes.cardBalance}>
            <Box mb={1}>
                <Grid container spacing={0} alignItems="center">
                    <Grid item>
                        <Typography className={classes.cardBalanceTitle}>
                            {allTranslations(localization.operationsNetProfitTitle)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <HelpBadge tooltip={allTranslations(localization.operationsNetProfitTooltip)}/>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={1}>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall} style={{ margin: 0 }}>
                        {allTranslations(localization.operationsNetProfitProfitSum)}
                    </Typography>
                    <Typography className={classes.cardBalanceValueSmall}>
                        {formatMoney((totalProfitSum || 0), 2, '.')}
                    </Typography>
                    <SmallLogo/>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall} style={{ margin: 0 }}>
                        {allTranslations(localization.operationsNetProfitOnlineProfitSum)}
                    </Typography>
                    <Typography className={classes.cardBalanceValueSmall}>
                        {formatMoney((headerStats?.onlineProfitSum || 0), 2, '.')}
                    </Typography>
                    <SmallLogo/>
                </Grid>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall}  style={{ margin: 0 }}>
                        {allTranslations(localization.operationsNetProfitCashProfitSum)}
                    </Typography>
                    <Typography className={classes.cardBalanceValueSmall}>
                        {formatMoney((headerStats?.cashProfitSum || 0), 2, '.')}
                    </Typography>
                    <SmallLogo/>
                </Grid>
            </Grid>
        </Box>
    )
}
const MarketingSum = (props) => {
    const {headerStats} = props;
    const classes = useStyles();

    const totalMarketingSum = ((headerStats?.onlineMarketingSum || 0) + (headerStats?.cashMarketingSum || 0));

    return (
        <Box className={classes.cardBalance}>
            <Box mb={1}>
                <Grid container spacing={0} alignItems="center">
                    <Grid item>
                        <Typography className={classes.cardBalanceTitle}>{allTranslations(localization.operationsStatsMarketingSumTitle)}</Typography>
                    </Grid>
                    <Grid item>
                        <HelpBadge tooltip={allTranslations(localization.operationsStatsMarketingSumTooltip)}/>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={1}>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall} style={{ margin: 0 }}>{allTranslations(localization.operationsNetProfitProfitSum)}</Typography>
                    <Typography className={classes.cardBalanceValueSmall}>{formatMoney((totalMarketingSum || 0), 2, '.')}</Typography>
                    <SmallLogo/>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall} style={{ margin: 0 }}>{allTranslations(localization.operationsNetProfitOnlineProfitSum)}</Typography>
                    <Typography className={classes.cardBalanceValueSmall}>{formatMoney((headerStats?.onlineMarketingSum || 0), 2, '.')}</Typography>
                    <SmallLogo/>
                </Grid>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall}  style={{ margin: 0 }}>{allTranslations(localization.operationsNetProfitCashProfitSum)}</Typography>
                    <Typography className={classes.cardBalanceValueSmall}>{formatMoney((headerStats?.cashMarketingSum || 0), 2, '.')}</Typography>
                    <SmallLogo/>
                </Grid>
            </Grid>
        </Box>
    )
}
const InfoBigCard = (props) => {
    const {title, total, online, cash, tooltip} = props;
    const classes = useStyles();

    return (
        <Box className={classes.cardBalance}>
            <Box mb={1}>
                <Grid container spacing={0} alignItems="center">
                    <Grid item>
                        <Typography className={classes.cardBalanceTitle} dangerouslySetInnerHTML={{__html: title}}/>
                    </Grid>
                    <Grid item>
                        <HelpBadge tooltip={tooltip}/>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={1}>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall} style={{ margin: 0 }}>{allTranslations(localization.operationsNetProfitProfitSum)}</Typography>
                    <Typography className={classes.cardBalanceValueSmall}>{formatMoney((total || 0), 2, '.')}</Typography>
                    <SmallLogo/>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall} style={{ margin: 0 }}>{allTranslations(localization.operationsNetProfitOnlineProfitSum)}</Typography>
                    <Typography className={classes.cardBalanceValueSmall}>{formatMoney((online || 0), 2, '.')}</Typography>
                    <SmallLogo/>
                </Grid>
                <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography className={classes.cardBalanceTitleSmall}  style={{ margin: 0 }}>{allTranslations(localization.operationsNetProfitCashProfitSum)}</Typography>
                    <Typography className={classes.cardBalanceValueSmall}>{formatMoney((cash || 0), 2, '.')}</Typography>
                    <SmallLogo/>
                </Grid>
            </Grid>
        </Box>
    )
}
const ModalWithdrawalFunds = (props) => {
    const [amount, setAmount] = useState(0);
    const {isOpen, onClose, onSend} = props;

    const classes = useStyles();

    const handleChangeAmount = ({target}) => {
        let value = target.value;

        if (!value || value < 0) {
            value = 0;
        }

        setAmount(value)
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
                    <Typography variant="h2">{allTranslations(localization.operationsModalWithdrawalFundsTitle)}</Typography>
                </Box>

                <Box mb={6}>
                    <Box>
                        <Typography style={{marginBottom: 14}} variant="formTitle">{allTranslations(localization.operationsModalWithdrawalFundsAmount)}</Typography>

                        <TextField
                            fullWidth
                            placeholder={"0"}
                            value={amount}
                            type="number"
                            variant="outlined"
                            onChange={handleChangeAmount}
                        />
                    </Box>
                </Box>

                <Box>
                    <Button
                        variant="contained"
                        className={classes.modalBalanceButton}
                        onClick={onSend}
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
                <Typography variant="h3" className={classes.modalTitle}>{allTranslations(localization.operationsModalSuccessTitle)}</Typography>

                <Typography className={classes.modalDescription}>
                    {allTranslations(localization.operationsModalSuccessDescription)}
                </Typography>

                <Button variant="contained" className={classes.modalButton} onClick={props.onClose}>{allTranslations(localization.commonAccept)}</Button>
            </Box>

        </Dialog>
    )
}

const styles = {
    titleExport: {
        fontSize: 16,
        lineHeight: '19px',
        color: '#25233E',
        opacity: 0.4
    },
    buttonSmallExport: {
        padding: 6,

        minWidth: 'initial',

        fontSize: 12,
        lineHeight: '12px'
    },

    element: {
        display: 'flex'
    },
    card: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 10,

        border: '1px solid #CBCCD4'
    },
};
const useStyles = makeStyles((theme) => ({
    cardBalance: {},
    cardBalanceLine: {
        display: 'flex',
        alignItems: 'center',

        marginTop: 8,
        marginBottom: 12
    },
    cardBalanceTitle: {
        fontSize: 13,
        lineHeight: '13px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    cardBalanceTitleSmall: {
        marginLeft: 16,

        fontSize: 12,
        lineHeight: '20px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#999DB1'
    },
    cardBalanceValue: {
        fontSize: 20,
        lineHeight: '20px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#8152E4',

        marginRight: 8
    },
    cardBalanceValueSmall: {
        marginLeft: 8,
        marginRight: 8,

        fontSize: 16,
        lineHeight: '20px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#8152E4'
    },
    cardBalanceButton: {
        padding: '3px 12px',

        fontSize: 14,
        lineHeight: '25px',
        height: 'auto',
        fontWeight: 'normal',

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

export default withStyles(styles)(OrganizationOperations)
