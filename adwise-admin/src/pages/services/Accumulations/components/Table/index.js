import React from "react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
    Link
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";

import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";

const TableOrganization = (props) => {
    const {rows, isLoading, filter, pagination, totalCountRows, onChangeFilter} = props;
    const classes = useStyles();

    const handleOnChangeFilter = (event, page, pageSize) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;
        newFiler.pageSize = pageSize || filter.pageSize;

        onChangeFilter(newFiler, true)
    }

    return (

        <>

            <Box>
                <Grid container justify="space-between">
                    <Grid item>
                        <Typography variant="h5">Всего найдено <span
                            style={{color: '#8152E4'}}>{formatMoney(props.totalCountRows, 0)}</span> элементов</Typography>
                    </Grid>
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            pageCount={pagination.countPages}
                            count={pagination.countPages}

                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box my={2}>

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

                                                <TableCell>{row.accumulationId}</TableCell>
                                                <TableCell>{formatMoney(row.sum, 0, '')} {currency.rub}</TableCell>
                                                <TableCell>{moment(row.timestamp).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                                                <TableCell>{(row.closed) ? moment(row.dueDate).format("DD.MM.YYYY HH:mm:ss") : '-'}</TableCell>
                                                <TableCell>
                                                    <Grid container>
                                                        <Grid item>
                                                            <Box className={clsx({
                                                                [classes.status]: true,
                                                                [classes.statusActive]: !row.closed,
                                                                [classes.statusClose]: row.closed,
                                                            })}>
                                                                <Typography variant="caption"
                                                                            style={{color: "white"}}>{row.closed ? 'Закрыта' : 'Открыта'}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                                <TableCell>
                                                    {`${row.user?.firstName || ''} ${row.user?.lastName || ''}`} <Link href={`/users?_id=${row.user}`} target="_blank"> (Перейти)</Link>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        row.payments.map((payment, idx) => (
                                                            <>
                                                                <Link href={`/bank-payments?_id=${payment}`} target="_blank">Открыть покупки</Link><br/>
                                                            </>
                                                        ))
                                                    }
                                                </TableCell>

                                            </TableRow>

                                        )
                                    })
                                }

                            </TableBody>
                        )
                    }

                </Table>

            </Box>

            <Box>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            pageCount={pagination.countPages}
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

            <TableCell>ID</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Дата открытия</TableCell>
            <TableCell>Дата закрытия</TableCell>
            <TableCell>Статус копилки</TableCell>
            <TableCell>Пользователь</TableCell>
            <TableCell>Покупки</TableCell>

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

                    </TableRow>

                ))
            }

        </TableBody>
    )
}

const useStyles = makeStyles(() => ({
    status: {
        padding: '4px 8px',
        borderRadius: '100px',
        border: "1px solid rgba(255, 255, 255, 0.5)"
    },
    statusActive: {
        backgroundColor: "#94D36C"
    },
    statusClose: {
        backgroundColor: "#FA7D7D"
    },
}))

export default TableOrganization
