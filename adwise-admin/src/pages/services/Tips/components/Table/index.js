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

const RowEmail = (props) => {
    const {user} = props;

    if (!user) {
        return ''
    }

    return (
        <Tooltip title="Написать пользователю">
            <Link target="_blank" href={`mailto:${user.email}`}>{user.email}</Link>
        </Tooltip>
    )
}
const RowPhone = (props) => {
    const {user} = props;

    if (!user) {
        return ''
    }

    return (
        <Tooltip title="Позвонить пользователю">
            <Link target="_blank" href={`tel:+${user.phone}`}>{user.phone}</Link>
        </Tooltip>
    )
}
const TableHeader = () => {
    return (
        <TableHead>

            <TableCell>ID</TableCell>
            <TableCell>Дата / время</TableCell>
            <TableCell>Клиент</TableCell>
            <TableCell>Кассир</TableCell>
            <TableCell>Организация</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Статус оплаты</TableCell>

        </TableHead>
    )
}

const Body = (props) => {
    const {rows, onDisabledTransaction} = props;
    const classes = useStyles();

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    console.log('row ', row);

                    return (

                        <TableRow key={`row-organization-${idx}`}>
                            <TableCell width={250}>{ row._id }</TableCell>
                            <TableCell width={150}>{ moment(row.timestamp).format('DD.MM.YYYY / HH:mm') }</TableCell>
                            <TableCell>
                                {!!row.from ? (
                                    <Link href={`/users?_id=${ row.from._id }`} target="_blank">{ row.from.firstName } { row.from.lastName }</Link>
                                ) : (
                                    <Typography variant="body2" style={{ maxWidth: 200 }}>Оплата чаевых произведена с WEB интервейса</Typography>
                                )
                                }
                            </TableCell>
                            <TableCell>
                                <Link href={`/users?_id=${ row.to._id }`} target="_blank">{ row.to.firstName } { row.to.lastName }</Link>
                            </TableCell>
                            <TableCell>
                                <Link href={`/organizations?_id=${ row.organization._id }`} target="_blank">{ row.organization.name }</Link>
                            </TableCell>
                            <TableCell>
                                { formatMoney(row.sum) } { currency.rub }
                            </TableCell>
                            <TableCell>
                                <Tooltip title={(row.processing) ? 'Ожидает оплаты' : 'Оплата произведена'}>
                                    <div className={clsx({
                                        [classes.status]: true,
                                        [classes.statusDanger]: row.processing,
                                        [classes.statusSuccess]: row.confirmed
                                    })}/>
                                </Tooltip>
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
    statusDanger: {
        backgroundColor: '#ED8E00'
    },
    statusSuccess: {
        backgroundColor: '#94D36C'
    },

}));

export default TableOrganization
