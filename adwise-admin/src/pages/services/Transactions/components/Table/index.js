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

    Tooltip,
    Switch
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Repeat as RepeatIcon,
    Code as CodeIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import transactionTypes from "../../../../../constants/transactionTypes";
import originTypes from "../../../../../constants/originTypes";

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter, onDisabledTransaction} = props;

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
                    <Grid item><Typography variant="body2" color="primary">Таблица имеет скролл</Typography></Grid>
                    <Grid item><CodeIcon size={20} color="#8152E4"/></Grid>
                </Grid>
            </Box>

            <Box mb={2}>
                <Grid container justify="space-between">
                    <Grid item>
                        <Typography variant="h5">Всего найдено <span style={{ color: '#8152E4' }}>{ formatMoney(props.totalCountRows, 0) }</span> элементов</Typography>
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
                    minWidth={1800}
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
                                <Body rows={rows} onDisabledTransaction={onDisabledTransaction}/>
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

const TableHeader = () => {
    return (
        <TableHead>

            <TableCell>Дата / время</TableCell>
            <TableCell>ID транзакции</TableCell>
            <TableCell>Тип оплаты</TableCell>
            <TableCell>Тип транзакции</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Заморозка</TableCell>
            <TableCell>Дата разморозки</TableCell>
            <TableCell>От кого (кошелек)</TableCell>
            <TableCell>Кому (кошелек)</TableCell>
            <TableCell>Организация</TableCell>
            <TableCell>Купон</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Источник</TableCell>
            <TableCell align="right">
                <div style={{backgroundColor: 'white'}}/>
            </TableCell>

        </TableHead>
    )
}

const Body = (props) => {
    const {rows, onDisabledTransaction} = props;
    const classes = useStyles();

    const handleGoContext = (row) => {
        window.open(`/transactions?context=${row.context}`)
    }


    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    const from = row.from ? row.from.user ? `${row.from.user.firstName || ''} ${row.from.user.lastName || ''} (${ row.from.user._id })` : row.from.organization ? `${ row.from.organization.name } ( ${ row.from.organization.wallet } )` : row.from._id : 'SYSTEM';
                    const to = row.to ? row.to.user ? `${row.to.user.firstName || ''} ${row.to.user.lastName || ''} (${ row.to.user._id })` : row.to.organization ? `${ row.to.organization.name } ( ${ row.to.organization.wallet } )` : row.to._id : 'SYSTEM';
                    const organization = (!!row.coupon) ? row.coupon.organizationName : '—';
                    const coupon = (!!row.coupon) ? `${row.coupon.name} ` : '—';
                    const type = transactionTypes[row.type];
                    const dateTime = moment(row.timestamp).format('DD.MM.YYYY / HH:mm');
                    const balance = formatMoney(row.sum, 2, '.');

                    return (

                        <TableRow key={`row-organization-${idx}`}>
                            <TableCell className="no-wrap">{dateTime}</TableCell>
                            <TableCell>{row._id}</TableCell>
                            <TableCell>{ (!!row.origin) ? originTypes[row.origin] : '—' }</TableCell>
                            <TableCell>{type}</TableCell>
                            <TableCell className="no-wrap">{balance} { currency[row.currency] }</TableCell>
                            <TableCell className="no-wrap">
                                <Tooltip title={row.frozen ? 'Денежные средства заморожены' : 'Денежные средства переведены'}>
                                    <Box
                                        width={30}
                                        height={30}
                                        borderRadius={999}
                                        bgcolor={row.frozen ? '#ED8E00' : '#93D36C'}
                                    />
                                </Tooltip>
                            </TableCell>
                            <TableCell className="no-wrap">
                                {
                                    row.frozen ? (
                                        moment(row.dueDate).format('DD.MM.YYYY HH:mm:ss')
                                    ) : (
                                        '—'
                                    )
                                }
                            </TableCell>
                            <TableCell>{from}</TableCell>
                            <TableCell>{to}</TableCell>
                            <TableCell>
                                {
                                    (!!row.coupon) ? (
                                        <Link target="_blank" href={`/organizations?_id=${ row.coupon.organization }`}>{ organization }</Link>
                                    ) : ( <span>{ organization }</span> )
                                }
                            </TableCell>
                            <TableCell>
                                {coupon}
                                {
                                    Boolean(row?.coupon?._id) && (
                                        <>
                                            (<Link href={`/coupons?_id=${row?.coupon?._id}`} target="_blank">Перейти</Link>)
                                        </>
                                    )
                                }
                            </TableCell>
                            <TableCell>
                                <Tooltip title={row.complete ? 'Завершено' : 'Ошибка'}>
                                    <div className={clsx({
                                        [classes.status]: true,
                                        [classes.statusError]: !row.complete,
                                        [classes.statusSuccess]: row.complete
                                    })}/>
                                </Tooltip>
                            </TableCell>
                            <TableCell className="no-wrap">
                                {`${ row.context.slice(0, 4) } •••• ${ row.context.slice(-4) }`}
                            </TableCell>

                            <TableCell align="right">

                                <Grid container spacing={2} wrap="nowrap" justify="flex-end">

                                    <Grid item>
                                        <Tooltip title="Связанные транзакции">
                                            <IconButton disabled={!row.context} onClick={() => handleGoContext(row)}>
                                                <RepeatIcon size={20} color={ row.context ? "#8152E4" : "#999DB1" }/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                    <Grid item>
                                        <Tooltip title={ row.disabled ? 'Включить транзакцию' : 'Выключить транзакцию' }>
                                            <Switch checked={!row.disabled} onChange={() => onDisabledTransaction(row)} color="primary"/>
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

                        <TableCell align="right">
                            <Grid container spacing={2} wrap="nowrap" justify="flex-end">

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
        width: 20,
        height: 20,

        borderRadius: 999,

        borderWidth: 1,
        borderStyles: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    statusError: {
        backgroundColor: '#FA7D7D'
    },
    statusSuccess: {
        backgroundColor: '#94D36C'
    },

}));

export default TableOrganization
