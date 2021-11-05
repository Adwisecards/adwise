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
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Code as CodeIcon,
    Archive as ArchiveIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter} = props;

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
                                <Body rows={rows}/>
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
            <TableCell>ID сделки</TableCell>
            <TableCell>Тип сделки</TableCell>
            <TableCell>Ссылка на платеж</TableCell>
            <TableCell>Сумма сделки</TableCell>
            <TableCell>Использованно бонусов</TableCell>
            <TableCell>Оплачено</TableCell>
            <TableCell>ID покупки</TableCell>
            <TableCell align="right">
                <div style={{backgroundColor: 'white'}}/>
            </TableCell>

        </TableHead>
    )
}

const Body = (props) => {
    const {rows} = props;
    const classes = useStyles();

    const handleGoPurchase = (row) => {
        window.open(`/purchases?_id=${ row.ref }`)
    }

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    return (

                        <TableRow key={`row-organization-${idx}`}>

                            <TableCell>{ moment(row.timestamp).format('DD.MM.YYYY / HH:mm') }</TableCell>
                            <TableCell>{row._id}</TableCell>
                            <TableCell>Покупка</TableCell>
                            <TableCell>
                                <Link target="_blank" href={row.paymentUrl}>Перейти к платежу</Link>
                            </TableCell>
                            <TableCell>{ formatMoney(row.sum, 2, '.') } { currency[row.currency] }</TableCell>
                            <TableCell>{ formatMoney(row.usedPoints, 2, '.') } { currency[row.currency] }</TableCell>
                            <TableCell>
                                <Tooltip title={`Банковский платеж: ${ (row.paid) ? 'Успешно' : 'С ошибкой' }`}>
                                    <div className={clsx({
                                        [classes.status]: true,
                                        [classes.statusSuccess]: row.paid,
                                        [classes.statusError]: !row.paid
                                    })}/>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{ row.ref }</TableCell>

                            <TableCell align="right">

                                <Grid container spacing={2} wrap="nowrap" justify="flex-end">

                                    <Grid item>
                                        <Tooltip title="Перейти к покупке">
                                            <IconButton onClick={() => handleGoPurchase(row)}>
                                                <ArchiveIcon size={20} color="#8152E4"/>
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
