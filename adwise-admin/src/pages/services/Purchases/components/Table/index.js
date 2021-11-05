import React, {useState} from "react";
import {
    Box,

    Typography,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,

    Grid,

    IconButton,

    Link,

    Tooltip
} from "@material-ui/core";
import {
    Skeleton
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Pagination,
    HelpBadge
} from "../../../../../components";
import {
    Repeat as RepeatIcon,
    Code as CodeIcon,
    Power as PowerIcon,
    Layers as LayersIcon,
    RefreshCw as RefreshCwIcon,
    CreditCard as CreditCardIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import couponTypes from "../../../../../constants/couponTypes";
import paymentTypes from "../../../../../constants/paymentTypes";

const terminalNames = {
    "false_false_false": "Класический терминал",
    "true_false_false": "Наличная оплата",
    "false_true_false": "Безопасная сделка",
    "false_false_true": "Сплитование",
};
const terminalHints = {
    "false_false_false": "Вам поступают деньги через банк по актам о выплате из Эдвайз",
    "true_false_false": "Вам поступают деньги через банк по актам о выплате из Эдвайз",
    "false_true_false": "Вам поступают деньги напрямую от банка( для Самозанятых)",
    "false_false_true": "Вам поступают деньги напрямую от банка",
};

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter, onCancelPurchase, onUpdateStatusPurchase} = props;

    const [showShadowFixed, setShowShadowFixed] = useState(true);

    const classes = useStyles();


    const handleOnChangeFilter = (event, page, pageSize) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;
        newFiler.pageSize = pageSize || filter.pageSize;

        onChangeFilter(newFiler, true)
    }

    return (

        <>

            <Box mb={1}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item><Typography variant="body2" color="primary">Таблица имеет скролл</Typography></Grid>
                    <Grid item><CodeIcon size={20} color="#8152E4"/></Grid>
                </Grid>
            </Box>

            <Box mb={2}>
                <Grid container justify="space-between">
                    <Grid item>
                        <Typography variant="h5">Всего найдено <span
                            style={{color: '#8152E4'}}>{formatMoney(props.totalCountRows, 0)}</span> элементов</Typography>
                    </Grid>
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            pageCount={pagination.countPages}
                            count={filter.pageSize}

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
                    minWidth={2600}
                    className={clsx({
                        [classes.stickyActionsColumn]: true,
                        [classes.stickyActionsShadow]: !showShadowFixed,
                    })}
                >

                    <Table>

                        <TableHeader/>

                        {
                            isLoading && (
                                <BodyLoaders/>
                            )
                        }

                        {
                            !isLoading && (
                                <Body rows={rows} onCancelPurchase={onCancelPurchase} onUpdateStatusPurchase={onUpdateStatusPurchase}/>
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
                            pageCount={pagination.countPages}
                            count={filter.pageSize}

                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                </Grid>
            </Box>

        </>

    )
}

const TableHeader = () => {
    return (
        <TableHead>

            <TableCell>Дата / время создания</TableCell>
            <TableCell>Дата / время оплаты</TableCell>
            <TableCell>Дата / время выдачи</TableCell>
            <TableCell>ID покупки</TableCell>
            <TableCell>ID сделки</TableCell>
            <TableCell>Тип терминала</TableCell>
            <TableCell>Метод оплаты</TableCell>
            <TableCell>Купон ( тип купона )</TableCell>
            <TableCell>Продавец(орг)</TableCell>
            <TableCell>Покупатель</TableCell>
            <TableCell>Кассир</TableCell>
            <TableCell>Статус сделки</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Оплачено</TableCell>
            <TableCell>Оплачено баллами</TableCell>
            <TableCell>Кэшбэк</TableCell>
            <TableCell>1 уровень</TableCell>
            <TableCell>2 - 21 уровень</TableCell>
            <TableCell>Сумма AdWise</TableCell>
            <TableCell>Сумма менеджера AdWise</TableCell>
            <TableCell>Прибыль</TableCell>
            <TableCell align="right">
                <div style={{backgroundColor: 'white'}}/>
            </TableCell>

        </TableHead>
    )
}
const Body = (props) => {
    const {rows, onCancelPurchase, onUpdateStatusPurchase} = props;

    const classes = useStyles();

    const handleToSalesAll = (row) => {
        window.open(`/purchases?organization=${row.organization._id}`, '_blank');
    }
    const handleToTransactionAll = (row) => {
        window.open(`/transactions?context=${row._id}`, '_blank');
    }
    const handleToUserPurhases = (row) => {
        window.open(`/purchases?user=${row.user._id}`, '_blank');
    }

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    const isActiveCanceled = !row.canceled && !row.complete && row.confirmed && !row.processing;
                    const terminalKey = `${row.payment?.cash || false}_${row.payment?.safe || false}_${row.payment?.split || false}`;
                    const terminalName = terminalNames[terminalKey];
                    const terminalHint = terminalHints[terminalKey];
                    return (

                        <TableRow key={`row-organization-${idx}`}>

                            <TableCell
                                className="no-wrap">{(!!row.timestamp) ? moment(row.timestamp).format("DD.MM.YYYY / HH:mm") : '—'}</TableCell>
                            <TableCell
                                className="no-wrap">{(!!row.paidAt) ? moment(row.paidAt).format("DD.MM.YYYY / HH:mm") : '—'}</TableCell>
                            <TableCell
                                className="no-wrap">{(!!row.completedAt) ? moment(row.completedAt).format("DD.MM.YYYY / HH:mm") : '—'}</TableCell>
                            <TableCell>{row._id}</TableCell>
                            <TableCell>{row.ref.code}</TableCell>
                            <TableCell>
                                <Grid container spacing={1} alignItems="center" wrap="nowrap">
                                    <Grid item>{terminalName}</Grid>
                                    {
                                        Boolean(row.stats.usedPointsSum) && (
                                            <Grid item>(баллы)</Grid>
                                        )
                                    }
                                    <Grid item>
                                        <HelpBadge titleTooltip={terminalHint}/>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>{paymentTypes[row.type]}</TableCell>
                            <TableCell><Box maxWidth={250}>
                                {
                                    (!!row.coupon) && (
                                        <Link target="_blank"
                                              href={`/coupons?_id=${row.coupon._id}`}>{row.coupon.name} ({couponTypes[row.coupon.type]})</Link>
                                    )
                                }
                                {
                                    (row.coupons && row.coupons.length > 0) && (
                                        <Grid container spacing={1} style={{ minWidth: 250 }}>
                                            {

                                                row.coupons.map((coupon, idx) => (
                                                    <Grid item>
                                                        <Link key={`coupon-${idx}`} target="_blank"
                                                              href={`/coupons?_id=${coupon._id}`}>{coupon.name} ({couponTypes[coupon.type]})</Link>
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    )
                                }
                            </Box></TableCell>
                            <TableCell>
                                <Link target="_blank"
                                      href={`/organizations?_id=${row.organization._id}`}>{row.organization.name}</Link>
                            </TableCell>
                            <TableCell>
                                {
                                    (!!row.user) ? (
                                        <Link target="_blank"
                                              href={`/users?_id=${row.user._id}`}>{row.user.lastName} {row.user.firstName}</Link>
                                    ) : (<span>—</span>)
                                }
                            </TableCell>
                            <TableCell>
                                {
                                    (!!row.cashier) ? (
                                        <Link target="_blank"
                                              href={`/users?_id=${row.cashier.ref}`}>{row.cashier.lastName.value} {row.cashier.firstName.value}</Link>
                                    ) : (<span>—</span>)
                                }
                            </TableCell>
                            <TableCell>
                                <div className={clsx({
                                    [classes.status]: true,
                                    [classes.statusConfirmed]: (row.confirmed && !row.complete),
                                    [classes.statusNotConfirmed]: (!row.confirmed && !row.processing),
                                    [classes.statusProcessing]: (row.processing && !row.confirmed),
                                    [classes.statusFinish]: (row.confirmed && row.complete),
                                    [classes.statusCanceled]: (row.canceled),
                                })}>
                                    {(row.canceled) && 'ОТМЕНЕН'}
                                    {(!row.canceled && row.confirmed && !row.complete) && 'ОПЛАЧЕН'}
                                    {(!row.canceled && !row.confirmed && !row.processing) && 'НЕОПЛАЧЕН'}
                                    {(!row.canceled && row.processing && !row.confirmed) && 'В ПРОЦЕССЕ'}
                                    {(!row.canceled && row.confirmed && row.complete) && 'ЗАВЕРШЁН'}
                                </div>

                            </TableCell>
                            <TableCell className="no-wrap">
                                {formatMoney(row.sumInPoints, 2, '.')} {currency[row.currency]}
                            </TableCell>
                            <TableCell className="no-wrap">
                                {formatMoney((row.payment?.sum || 0), 2, '.')} {currency[row.currency]}
                            </TableCell>
                            <TableCell className="no-wrap">
                                {(!!row.stats) ? formatMoney(row.stats.usedPointsSum) : '—'} {currency[row.currency]}
                            </TableCell>
                            <TableCell className="no-wrap">
                                {(!!row.stats) ? formatMoney(row.stats.cashback) : '—'} {currency[row.currency]}
                            </TableCell>
                            <TableCell
                                className="no-wrap">{(!!row.stats) ? formatMoney(row.stats.firstLevel) : '—'} {currency[row.currency]}</TableCell>
                            <TableCell
                                className="no-wrap">{(!!row.stats) ? formatMoney(row.stats.otherLevels) : '—'} {currency[row.currency]}</TableCell>
                            <TableCell
                                className="no-wrap">{(!!row.stats) ? formatMoney(row.stats.adwisePoints) : '—'} {currency[row.currency]}</TableCell>
                            <TableCell
                                className="no-wrap">{(!!row.stats) ? formatMoney(row.stats.managerPoints) : '—'} {currency[row.currency]}</TableCell>
                            <TableCell
                                className="no-wrap">{(!!row.stats) ? formatMoney(row.stats.organizationPoints) : '—'} {currency[row.currency]}</TableCell>

                            <TableCell align="right">

                                <Grid container spacing={2} wrap="nowrap">

                                    <Grid item>
                                        <Tooltip title="Продажи организации">
                                            <IconButton onClick={() => handleToSalesAll(row)}>
                                                <CreditCardIcon size={20} color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Покупки пользователя">
                                            <IconButton onClick={() => handleToUserPurhases(row)}>
                                                <LayersIcon size={20} color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Связанные транзакции">
                                            <IconButton onClick={() => handleToTransactionAll(row)}>
                                                <RepeatIcon size={20} color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Отменить покупку">
                                            <IconButton disabled={!isActiveCanceled} onClick={() => onCancelPurchase(row)}>
                                                <PowerIcon size={20} color={ isActiveCanceled ? "#8152E4" : "#CBCCD4" }/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Обновить статус покупки">
                                            <IconButton onClick={() => onUpdateStatusPurchase(row)}>
                                                <RefreshCwIcon size={20} color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                </Grid>

                            </TableCell>

                        </TableRow>

                    )
                })
            }
        </TableBody>
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

                        <TableCell align="right">
                            <Grid container spacing={2} wrap="nowrap" justify="flex-end">

                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>

                            </Grid>
                        </TableCell>

                    </TableRow>

                ))
            }

        </TableBody>
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
    },

    status: {
        textTransform: 'uppercase',
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    statusConfirmed: {
        color: '#0000FF'
    },
    statusFinish: {
        color: '#94D36C'
    },
    statusNotConfirmed: {
        color: '#FF9494'
    },
    statusProcessing: {
        color: '#ED8E00'
    },
    statusCanceled: {
        color: 'red'
    },

}));

export default TableOrganization
