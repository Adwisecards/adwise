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
    Repeat as RepeatIcon
} from "react-feather";
import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter} = props;

    const classes = useStyles();

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;

        onChangeFilter(newFiler, true)
    }

    const handleGoTransaction = (row) => {
        window.open(`/transactions?context=${ row._id }`, '_blank')
    }

    return (

        <>

            <Box>

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

                <Table>

                    <TableHeader/>

                    {
                        isLoading && (
                            <BodyLoaders/>
                        )
                    }

                    {
                        !isLoading && (
                            <TableBody>

                                {
                                    rows.map((row, idx) => {
                                        return (

                                            <TableRow key={`row-organization-${idx}`}>

                                                <TableCell>
                                                    {row?._id || 'В разработке'}
                                                </TableCell>
                                                <TableCell>
                                                    {row.reason}
                                                </TableCell>
                                                <TableCell>
                                                    {Boolean(row.manager) ? (
                                                        <Link target="_blank" href={`/users?_id=${ row.manager._id }`}>{ row.manager.lastName || '' } { row.manager.firstName || '' }</Link>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Link target="_blank" href={`/organizations?_id=${ row.organization._id }`}>{ row.organization.name }</Link>
                                                </TableCell>
                                                <TableCell>
                                                    { row.packet.name }
                                                </TableCell>
                                                <TableCell>
                                                    { formatMoney(row.packet.price) } { currency[row.packet.currency] }
                                                </TableCell>
                                                <TableCell>
                                                    { formatMoney(row.packet.managerReward) } { currency[row.packet.currency] }
                                                </TableCell>
                                                <TableCell>
                                                    { formatMoney(row.packet.refBonus) } { currency[row.packet.currency] }
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Связанные транзакции">
                                                        <IconButton disabled={!Boolean(row._id)} onClick={() => handleGoTransaction(row)}>
                                                            <RepeatIcon
                                                                size={20}
                                                                color="#8152E4"
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>

                                            </TableRow>

                                        )
                                    })
                                }

                            </TableBody>
                        )
                    }

                </Table>

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

            </Box>

        </>

    )
}

const TableHeader = () => {
    return (
        <TableHead>

            <TableCell>ID выплаты</TableCell>
            <TableCell>Основание на выплату</TableCell>
            <TableCell>Фио менеджера</TableCell>
            <TableCell>Организация</TableCell>
            <TableCell>Тариф</TableCell>
            <TableCell>Сумма тарифа</TableCell>
            <TableCell>Вознаграждение</TableCell>
            <TableCell>Вознаграждение реф. сети</TableCell>
            <TableCell></TableCell>

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

    wiseDefault: {
        width: 30,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 999,

        backgroundColor: '#94D36C',
    }
}));

export default TableOrganization
