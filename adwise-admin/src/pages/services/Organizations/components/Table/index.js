import React, {useState} from "react";
import {
    Box,

    Typography,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    Grid,

    IconButton,

    Link,

    Tooltip,
    Switch, Select, MenuItem, FormControl
} from "@material-ui/core";
import {
    Skeleton,
    Pagination,

    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    GitPullRequest as GitPullRequestIcon,
    Layers as LayersIcon,
    Settings as SettingsIcon,
    Repeat as RepeatIcon,
    Code as CodeIcon,
    CreditCard as CreditCardIcon,
    Layout as LayoutIcon,
    DollarSign as DollarSignIcon,
    FastForward as FastForwardIcon,
    MoreVertical as MoreVerticalIcon,
    FileText as FileTextIcon,
    Edit2 as Edit2Icon,
    Server as ServerIcon,
    Home as HomeIcon,
    ShoppingBag as ShoppingBagIcon,
    AlertTriangle as AlertTriangleIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import {
    HelpBadge,
    TableSortLabel
} from "../../../../../components";
import agent from "../../../../../agent/agent";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import legalForm from "../../../../../constants/legalForm";
import transactionTypes from "../../../../../constants/transactionTypes";
import organizationPaymentTypes from "../../../../../constants/organizationPaymentTypes";

const TableOrganization = (props) => {
    const {
        rows,
        filter,
        pagination,
        isLoading,
        isAdminGuest,
        onOpenSetting,
        onChangeCash,
        globalIdOrganization,
        onOpenBalanceAdjustment,
        onChangeFilter,
        onChangeDisabled,
        onChangeSignedContract,
        onOpenBankDetails,
        onSetPaymentType,
        onOpenOrganizationEdit,
        onChangeTips,
        onOpenOrganization,
        onSetOrganizationGlobal,
        onChangeOnlinePayment,
        onEditDeposit
    } = props;

    const [showShadowFixed, setShowShadowFixed] = useState(true);

    const classes = useStyles();

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;

        onChangeFilter(newFiler, true)
    }

    return (

        <>

            <Box mb={1}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item><Typography variant="body2" color="primary">?????????????? ?????????? ????????????</Typography></Grid>
                    <Grid item><CodeIcon size={20} color="#8152E4"/></Grid>
                </Grid>
            </Box>

            <Box mb={2}>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography variant="h5">?????????? ?????????????? <span
                            style={{color: '#8152E4'}}>{props.totalCountRows}</span> ??????????????????</Typography>
                    </Grid>
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            count={pagination.countPages}

                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                </Grid>
            </Box>

            <PerfectScrollbar
                onScrollX={() => setShowShadowFixed(true)}
                onXReachEnd={() => setShowShadowFixed(false)}
            >

                <Box
                    minWidth={5000}
                    className={clsx({
                        [classes.stickyActionsColumn]: true,
                        [classes.stickyActionsShadow]: !showShadowFixed,
                    })}
                >

                    <Table>

                        <TableHeader filter={filter} onChangeFilter={onChangeFilter}/>

                        {
                            isLoading && (
                                <BodyLoaders/>
                            )
                        }

                        {
                            !isLoading && (
                                <TableBody>

                                    {
                                        rows.map((row, idx) => (
                                            <RowBody
                                                key={`organization-${row._id}-${idx}`} row={row}
                                                isGlobal={globalIdOrganization === row._id}
                                                isAdminGuest={isAdminGuest}
                                                onOpenSetting={onOpenSetting}
                                                onChangeDisabled={onChangeDisabled}
                                                onOpenBalanceAdjustment={onOpenBalanceAdjustment}
                                                onChangeSignedContract={onChangeSignedContract}
                                                onOpenBankDetails={onOpenBankDetails}
                                                onChangeCash={onChangeCash}
                                                onSetPaymentType={onSetPaymentType}
                                                onOpenOrganizationEdit={onOpenOrganizationEdit}
                                                onChangeTips={onChangeTips}
                                                onOpenOrganization={onOpenOrganization}
                                                onSetOrganizationGlobal={onSetOrganizationGlobal}
                                                onChangeOnlinePayment={onChangeOnlinePayment}
                                                onEditDeposit={onEditDeposit}
                                            />
                                        ))
                                    }

                                </TableBody>
                            )
                        }

                    </Table>

                </Box>

            </PerfectScrollbar>

            <Box mt={2}>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            count={pagination.countPages}

                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                </Grid>
            </Box>

        </>

    )
}

const TableHeader = (props) => {
    const {filter, onChangeFilter} = props;

    const headerElements = [
        {
            title: '??????????????????????',
            isSorted: true,
            sortedName: 'name',
        },
        {
            title: '????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'INN ??????????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '???????????? ????????????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '???????????????? ??????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '?? ????????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '??????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '???????????????????? ????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '?????????? ????????????<br/>(?????????? / ???????????? / ????????????????)',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '??????????????<br/>(?????????? / ???????????? / ????????????????)',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '????????????<br/>(?????????? / ???????????? / ????????????????)',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '?????????? ????????????????????<br/>(?????????? / ???????????? / ????????????????)',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '??????-???? ??????????????<br/>(?????????? / ???????????? / ????????????????)',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '?????????? ????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '?????????????????? ?????????????????????????? ????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'ID ??????????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'ID ????????????????',
            isSorted: false,
            sortedName: '',
        },
        {
            title: '???????????? ???????????? ????????????????',
            isSorted: false,
            sortedName: '',
        },
    ];

    const handleOnChangeSort = (name) => {
        let newFilter = {...filter};

        const isActive = filter.sortBy === name;

        if (!isActive) {
            newFilter.sortBy = name;
            newFilter.order = 1;
            newFilter.pageNumber = 1;

            onChangeFilter(newFilter, true);

            return null
        }
        if (filter.order === 1) {
            newFilter.sortBy = name;
            newFilter.order = -1;
            newFilter.pageNumber = 1;

            onChangeFilter(newFilter, true);

            return null
        }
        if (filter.order === -1) {
            newFilter.sortBy = name;
            newFilter.order = 1;
            newFilter.pageNumber = 1;

            onChangeFilter(newFilter, true);

            return null
        }
    }

    const order = filter.order === 1 ? 'desc' : 'asc';

    return (
        <TableHead>

            {
                headerElements.map((item, idx) => {
                    if (!item.isSorted) {
                        return (
                            <TableCell dangerouslySetInnerHTML={{__html: item.title}}/>
                        )
                    }

                    return (
                        <TableSortLabel
                            sortDirection={filter.sortBy === item.sortedName ? order : false}
                            active={filter.sortBy === item.sortedName}
                            direction={filter.sortBy === item.sortedName ? order : 'desc'}
                            onClick={() => handleOnChangeSort(item.sortedName)}
                            item={item}
                        />
                    )
                })
            }

            <TableCell width={300} align="right">
                <Grid container spacing={2}>
                    <Grid style={{width: 50}} item>????????.</Grid>
                    <Grid style={{width: 55}} item>??????.</Grid>
                    <Grid style={{width: 82}} item>??????????.</Grid>
                    <Grid style={{width: 76}} item>????????????.</Grid>
                    <Grid style={{width: 63}} item>??????.</Grid>
                    <Grid style={{width: 85}} item>????????????.</Grid>
                    <Grid item></Grid>
                </Grid>
            </TableCell>

        </TableHead>
    )
}
const BodyLoaders = () => {
    const rows = [1, 1, 1, 1, 1, 1];

    return (
        <TableBody>

            {
                rows.map((row) => (

                    <TableRow>

                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell width={200}><Skeleton height={30}/></TableCell>

                        <TableCell width={300} align="right">
                            <Grid container spacing={2} wrap="nowrap" alignItems="center" justify="flex-end">

                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={50}/></Grid>
                                <Grid item><Skeleton height={30} width={50}/></Grid>
                                <Grid item><Skeleton height={30} width={50}/></Grid>
                                <Grid item><Skeleton height={30} width={50}/></Grid>
                                <Grid item><Skeleton height={30} width={50}/></Grid>
                                <Grid item><Skeleton height={40} width={40} variant="circle"/></Grid>

                            </Grid>
                        </TableCell>

                    </TableRow>

                ))
            }

        </TableBody>
    )
}

const RowBody = (props) => {
    const {
        row,
        isGlobal,
        isAdminGuest,
        onChangeDisabled,
        onOpenBalanceAdjustment,
        onOpenSetting,
        onChangeSignedContract,
        onOpenBankDetails,
        onChangeCash,
        onSetPaymentType,
        onOpenOrganizationEdit,
        onChangeTips,
        onOpenOrganization,
        onSetOrganizationGlobal,
        onChangeOnlinePayment,
        onEditDeposit
    } = props;

    const [isOpenSpeedDial, setOpenSpeedDial] = useState(false);

    const handleGoOrganizationCoupons = (row) => {

        setOpenSpeedDial(false);

        window.open(`/coupons?organization=${row._id}`)
    }
    const handleGoOrganizationTransaction = (row) => {

        setOpenSpeedDial(false);

        window.open(`/transactions?organization=${row._id}`)
    }
    const handleOnChangeDisabledOrganization = (row) => {

        setOpenSpeedDial(false);

        onChangeDisabled(row)
    }
    const handleGoReferralTree = (row) => {

        setOpenSpeedDial(false);

        window.open(`/organization/referral-tree/${row._id}`)
    }
    const handleGoPurchase = (row) => {

        setOpenSpeedDial(false);

        window.open(`/purchases?organization=${row._id}`)
    }
    const handleOpenCRMUser = async (row) => {
        const crmUrl = process.env.REACT_APP_PRODUCTION_CRM_API;

        const token = await axiosInstance.get(`${apiUrls["get-user-jwt"]}/${row.user._id}`).then((response) => {
            return response.data.data.jwt
        });

        setOpenSpeedDial(false);

        window.open(`${crmUrl}/auth_admin?auth_session_user=${token}`);
    }
    const handleOpenPayments = (row) => {

        setOpenSpeedDial(false);

        window.open(`/transactions?from=${row.wallet._id}&type=withdrawal`)
    }
    const handleSetPaymentType = ({target}) => {
        const data = {
            organizationId: row._id,
            paymentType: target.value
        };
        onSetPaymentType(data);
    }
    const handleOpenOrganization = ({target}, row) => {
        const parent = target.closest('#no-open-organization');

        if (!!parent) {
            return null
        }

        onOpenOrganization(row)
    }
    const handleOpenCardsUser = (row) => {
        window.open(`/contacts?organization=${row._id}`);
    }

    // ?????????????????? ???????????? ?????????????????????? ???????? ?????????? ????????
    const _errorOrganization = () => {
        const { address } = row;

        // ???????????????? ???????????? ??????????????????????
        if (!/[??-????]/i.test(address?.placeId)) {
            return `???????????? ???????????? ???????????? ?????????????????????? ${address?.placeId}`
        }


        return false
    }

    // ???????????? ??????????????????????
    const _balance = () => {
        return row?.wallet?.points
    }

    // ?? ????????????????????
    const _toEnrollment = () => {
        return row?.wallet?.frozenPointsSum
    }

    // ??????????????
    const _deposit = () => {
        return row?.stats?.depositPayoutSum
    }

    // ?????????????????? ????????????
    const _paidBank = () => {
        return row?.stats?.paidToBankAccountSum
    }

    // ?????????? ?????????????? (??????????)
    const _totalProfit = () => {
        return ((row?.stats?.cashProfitSum || 0) + (row?.stats?.onlineProfitSum || 0))
    }
    // ?????????? ?????????????? (????????????????)
    const _cashProfit = () => {
        return row?.stats?.cashProfitSum || 0
    }
    // ?????????? ?????????????? (????????????)
    const _onlineProfit = () => {
        return row?.stats?.onlineProfitSum || 0
    }

    // ?????????? ?????????????? (??????????)
    const _totalCashback = () => {
        return ((row?.stats?.cashCashbackSum || 0) + (row?.stats?.onlineCashbackSum || 0))
    }
    // ?????????? ?????????????? (????????????)
    const _onlineCashback = () => {
        return row?.stats?.onlineCashbackSum || 0
    }
    // ?????????? ?????????????? (????????????????)
    const _cashCashback = () => {
        return row?.stats?.cashCashbackSum || 0
    }

    // ?????????? ???????????? (??????????)
    const _totalAmountTransactions = () => {
        return ((row?.stats?.onlinePurchaseSum || 0) + (row?.stats?.cashProfitSum || 0))
    }
    // ?????????? ???????????? (????????????)
    const _onlineAmountTransactions = () => {
        return row?.stats?.onlinePurchaseSum || 0
    }
    // ?????????? ???????????? (????????????????)
    const _cashAmountTransactions = () => {
        return row?.stats?.cashProfitSum || 0
    }

    // ?????????? ???????????????????? (??????????)
    const _totalMarketing = () => {
        return ((row?.stats?.cashMarketingSum || 0) + (row?.stats?.onlineMarketingSum || 0))
    }
    // ?????????? ???????????????????? (????????????)
    const _onlineMarketing = () => {
        return row?.stats?.onlineMarketingSum || 0
    }
    // ?????????? ???????????????????? (????????????????)
    const _cashMarketing = () => {
        return row?.stats?.cashMarketingSum || 0
    }

    // ??????-???? ?????????????? (??????????)
    const _totalCountPurchase = () => {
        return ((row?.stats?.cashPurchaseCount || 0) + (row?.stats?.onlinePurchaseCount || 0))
    }
    // ??????-???? ?????????????? (????????????)
    const _onlineCountPurchase = () => {
        return row?.stats?.onlinePurchaseCount || 0
    }
    // ??????-???? ?????????????? (????????????????)
    const _cashCountPurchase = () => {
        return row?.stats?.cashPurchaseCount || 0
    }


    const isDisabledChangePaymentType = Boolean(!row?.paymentShopId && !row?.user?.paymentCardId);

    return (
        <TableRow
            onClick={(event) => handleOpenOrganization(event, row)}
            hover
            style={{
                backgroundColor: Boolean(_errorOrganization()) ? "#ff00001a" : "transparent"
            }}
        >

            <TableCell>
                <Grid container spacing={1} alignItems="center">
                    {isGlobal && (
                        <Grid item>
                                <Tooltip title="?????????????????????? ???????????????? ????????????????????" arrow>
                                    <HomeIcon color="#8152E4"/>
                                </Tooltip>
                            </Grid>
                    )}
                    {_errorOrganization() && (
                        <Grid item>
                            <Tooltip title={_errorOrganization()} arrow>
                                <AlertTriangleIcon color="#D8004E"/>
                            </Tooltip>
                        </Grid>
                    )}
                    <Grid item>{row.name}</Grid>
                </Grid>
            </TableCell>
            <TableCell>
                {(!!row?.user) ? (<Link href={`/users?_id=${row.user._id}`}
                                       target="_blank">{`${row.user.firstName} ${row.user.lastName}`}</Link>) : '???'}
            </TableCell>
            <TableCell>{row?.legal?.info?.inn || ''}</TableCell>
            <TableCell><Box maxWidth={150}>{row?.legal?.info?.fullName || ''}</Box></TableCell>
            <TableCell>{legalForm[row?.legal?.form] || ''}</TableCell>
            <TableCell className="no-wrap">{formatMoney(_balance())} {currency[row.wallet.currency]}</TableCell>
            <TableCell className="no-wrap">{formatMoney(_toEnrollment())} {currency[row.wallet.currency]}</TableCell>
            <TableCell className="no-wrap">{formatMoney(_deposit())} {currency[row.wallet.currency]}</TableCell>
            <TableCell className="no-wrap">{formatMoney(_paidBank())} {currency[row.wallet.currency]}</TableCell>
            <TableCell className="no-wrap">
                <Grid container spacing={1}>
                    <Grid item>
                        {formatMoney(_totalAmountTransactions())}
                        {currency[row.wallet.currency]} /
                    </Grid>
                    <Grid item>
                        {formatMoney(_onlineAmountTransactions())}
                        {currency[row.wallet.currency]}
                    </Grid>
                    <Grid item>
                        / {formatMoney(_cashAmountTransactions())}
                        {currency[row.wallet.currency]}
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell className="no-wrap">
                <Grid container spacing={1}>
                    <Grid item>
                        {formatMoney(_totalProfit())}
                        {currency[row.wallet.currency]} /
                    </Grid>
                    <Grid item>
                        {formatMoney(_onlineProfit())}
                        {currency[row.wallet.currency]}
                    </Grid>
                    <Grid item>
                        / {formatMoney(_cashProfit())}
                        {currency[row.wallet.currency]}
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell className="no-wrap">
                <Grid container spacing={1}>
                    <Grid item>
                        {formatMoney(_totalCashback())}
                        {currency[row.wallet.currency]} /
                    </Grid>
                    <Grid item>
                        {formatMoney(_onlineCashback())}
                        {currency[row.wallet.currency]}
                    </Grid>
                    <Grid item>
                        / {formatMoney(_cashCashback())}
                        {currency[row.wallet.currency]}
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell className="no-wrap">
                <Grid container spacing={1}>
                    <Grid item>
                        {formatMoney(_totalMarketing())}
                        {currency[row.wallet.currency]} /
                    </Grid>
                    <Grid item>
                        {formatMoney(_onlineMarketing())}
                        {currency[row.wallet.currency]}
                    </Grid>
                    <Grid item>
                        / {formatMoney(_cashMarketing())}
                        {currency[row.wallet.currency]}
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell className="no-wrap">
                <Grid container spacing={1}>
                    <Grid item>
                        {formatMoney(_totalCountPurchase())} ???? /
                    </Grid>
                    <Grid item>
                        {formatMoney(_onlineCountPurchase())} ????
                    </Grid>
                    <Grid item>
                        / {formatMoney(_cashCountPurchase())} ????
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell className="no-wrap">{formatMoney(row.stats.withdrawnSum)} {currency[row.wallet.currency]}</TableCell>
            <TableCell>
                {(!!row.manager) ? (<Link href={`/users?_id=${row.manager._id}`}
                                          target="_blank">{`${row.manager.firstName} ${row.manager.lastName}`}</Link>) : '???'}
            </TableCell>
            <TableCell>
                {Boolean((row?.legal?.form === "ooo" || row?.legal?.form === "ip") && row?.paymentShopId) && (
                    <Tooltip title="ID ???????????????? (??????????????????) ?? ?????????????? ( ?????? ?????????? ????, ?????? )">
                        <span>ID ????????????????: {row?.paymentShopId}</span>
                    </Tooltip>
                )}
                {Boolean((row?.legal?.form === "individual") && row?.user?.paymentCardId) && (
                    <Tooltip title="ID ?????????????????? ?????????? ?? ?????????????? ( ?????? ?????????? ?????????????????????? )">
                        <span>ID ??????????: {row?.user?.paymentCardId}</span>
                    </Tooltip>
                )}
                {Boolean(!row?.user?.paymentCardId && !row?.paymentShopId) && (
                    <Tooltip title="?????????????????????? ???? ?????????????????? ???????????? '???????????????????? ??????????????????' ?????? '???????????????????? ??????????'">
                        <span>?????????????????????? ???? ???????????? ????????????</span>
                    </Tooltip>
                )}
            </TableCell>
            <TableCell>{row._id}</TableCell>
            <TableCell>{row.wallet._id}</TableCell>
            <TableCell width={200}>
                <FormControl margin="normal" fullWidth>
                    <Select
                        variant="outlined"
                        value={row.paymentType}
                        disabled={isDisabledChangePaymentType}
                        onChange={handleSetPaymentType}
                    >
                        {
                            Object.keys(organizationPaymentTypes).map((key) => {
                                const label = organizationPaymentTypes[key];

                                return (
                                    <MenuItem value={key}>{label}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </TableCell>

            <TableCell width={300} id="no-open-organization" align="right">

                <Grid container spacing={2} wrap="nowrap" justify="flex-end">
                    <Grid item>
                        <Tooltip title="???????????????????? ??????????????????????">
                            <IconButton
                                onClick={() => handleGoOrganizationTransaction(row)}>
                                <RepeatIcon
                                    size={20}
                                    color="#8152E4"
                                />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={(row.disabled) ? '?????????????? ????????????????' : '?????????????? ???? ????????????????'}>
                            <Switch checked={row.signed} color="primary"
                                    onChange={() => onChangeSignedContract(row)}/>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={(row.disabled) ? '???????????????? ??????????????????????' : '?????????????????? ??????????????????????'}>
                            <Switch checked={!row.disabled} color="primary"
                                    onChange={() => handleOnChangeDisabledOrganization(row)}/>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={(!row.tips) ? '???????????????? ????????????' : '?????????????????? ????????????'}>
                            <Switch checked={row.tips} color="primary"
                                    onChange={() => onChangeTips(row)}/>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={(!row.cash) ? '???????????????? ???????????????? ????????????' : '?????????????????? ???????????????? ????????????'}>
                            <Switch checked={row.cash} color="primary"
                                    onChange={() => onChangeCash(row)}/>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={(!row.online) ? '???????????????? ???????????? ????????????' : '?????????????????? ???????????? ????????????'}>
                            <Switch checked={row.online} color="primary"
                                    onChange={() => onChangeOnlinePayment(row)}/>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Box>
                            {
                                isAdminGuest ? (
                                    <SpeedDial
                                        ariaLabel="???????????? ????????????????????"
                                        direction="left"

                                        icon={<MoreVerticalIcon/>}
                                        open={isOpenSpeedDial}
                                        onClose={() => setOpenSpeedDial(false)}
                                        onOpen={() => setOpenSpeedDial(true)}
                                    >
                                        <SpeedDialAction
                                            icon={<SettingsIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="?????????? ??????????????????????"
                                            onClick={() => onOpenSetting(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<LayoutIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="?????????????? CRM ??????????????????????"
                                            onClick={() => handleOpenCRMUser(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<ShoppingBagIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="???????????????????????????? ????????????????"
                                            onClick={() => onEditDeposit(row)}
                                        />
                                    </SpeedDial>
                                ) : (
                                    <SpeedDial
                                        ariaLabel="???????????? ????????????????????"
                                        direction="left"

                                        icon={<MoreVerticalIcon/>}
                                        open={isOpenSpeedDial}
                                        onClose={() => setOpenSpeedDial(false)}
                                        onOpen={() => setOpenSpeedDial(true)}
                                    >
                                        <SpeedDialAction
                                            icon={<GitPullRequestIcon size={20} color="#8152E4"/>}
                                            tooltipTitle={"?????????????????????? ????????????"}
                                            onClick={() => handleGoReferralTree(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<LayersIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="???????????? ??????????????????????"
                                            onClick={() => handleGoOrganizationCoupons(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<CreditCardIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="?????????????? ??????????????????????"
                                            onClick={() => handleGoPurchase(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<DollarSignIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="?????????????????????????? ??????????????"
                                            onClick={() => onOpenBalanceAdjustment(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<FastForwardIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="?????????????? ??????????????????????"
                                            onClick={() => handleOpenPayments(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<Edit2Icon size={20} color="#8152E4"/>}
                                            tooltipTitle="???????????????????????????? ??????????????????????"
                                            onClick={() => onOpenOrganizationEdit(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<ServerIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="????????????????????"
                                            onClick={() => handleOpenCardsUser(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<SettingsIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="?????????? ??????????????????????"
                                            onClick={() => onOpenSetting(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<LayoutIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="?????????????? CRM ??????????????????????"
                                            onClick={() => handleOpenCRMUser(row)}
                                        />
                                        <SpeedDialAction
                                            icon={<ShoppingBagIcon size={20} color="#8152E4"/>}
                                            tooltipTitle="???????????????????????????? ????????????????"
                                            onClick={() => onEditDeposit(row)}
                                        />
                                    </SpeedDial>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>

            </TableCell>

        </TableRow>
    )
}

const useStyles = makeStyles((theme) => ({
    stickyActionsColumn: {
        '& table:first-child': {
            '& tr': {
                '& td:last-child, th:last-child': {
                    backgroundColor: '#f9f9fa',
                    position: 'sticky',
                    right: 0,
                    zIndex: 0,

                    '&::before': {
                        content: "''",
                        width: 5,
                        height: 'calc(100% + 1px)',

                        position: 'absolute',

                        right: '100%',
                        top: -8,
                        zIndex: -1,

                        background: 'linear-gradient(90deg, rgba(248,108,108,0) 0%, rgba(129, 82, 228, .3) 100%)',

                        transition: 'all 1s'
                    },
                    '&::after': {
                        content: "''",
                        width: '100%',

                        position: 'absolute',

                        left: 0,
                        // top: -8,
                        zIndex: -1,

                        backgroundColor: '#f9f9fa'
                    },
                },
                '& th:first-child': {
                    zIndex: 1
                }
            },
            '& tr:nth-child(2n)': {
                '& td:last-child, th:last-child': {
                    backgroundColor: 'white',
                    position: 'sticky',
                    right: 0,
                    zIndex: 0,
                    '&::after': {
                        content: "''",
                        width: '100%',

                        position: 'absolute',

                        left: 0,
                        top: -8,
                        zIndex: -1,

                        backgroundColor: 'white'
                    },
                },
                '& th:first-child': {
                    zIndex: 1
                }
            },
            '& th': {
                backgroundColor: 'white',
                position: 'sticky',
                right: 0,
                zIndex: 1
            },
        }
    },
    stickyActionsShadow: {
        '& table:first-child': {
            '& tr': {
                '& td:last-child, th:last-child': {
                    '&::before': {
                        background: 'transparent'
                    }
                }
            }
        }
    }
}));

export default TableOrganization
