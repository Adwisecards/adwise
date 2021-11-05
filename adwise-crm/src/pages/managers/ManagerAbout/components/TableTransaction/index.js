import React from "react";
import {
    Box,
    Grid,
    Avatar,
    Typography,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import {

} from "@material-ui/styles";
import {
    Pagination,
    Skeleton
} from "@material-ui/lab";

import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import transactionTypes from "../../../../../constants/transactionTypes";
import currency from "../../../../../constants/currency";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TableTransaction = (props) => {
    const {
        rows,
        pagination,
        filter,

        isLoading,

        onChangeFilter
    } = props;

    const handleChangePage = (event, page) => {
        let newFilter = {...filter};

        newFilter.page = page;

        onChangeFilter(newFilter)
    }

    return (
        <>

            <Box mb={2} width="100%">
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.page}
                            count={pagination.page}

                            onChange={handleChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box minWidth="100%">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization.managerTableTransactionFrom)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableTransactionType)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableTransactionAmount)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableTransactionDate)}</TableCell>
                        </TableRow>
                    </TableHead>

                    {
                        isLoading ? (
                            <TableLoading/>
                        ) : (
                            <TableData rows={rows}/>
                        )
                    }
                </Table>
            </Box>

            <Box mt={2} width="100%">
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.page}
                            count={pagination.page}

                            onChange={handleChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

const TableData = (props) => {
    const { rows } = props;

    return (
        <TableBody>
            {
                rows.map((row, idx) => {
                    const { organization, sum, timestamp, type } = row;

                    return (
                        <TableRow>
                            <TableCell>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <Avatar
                                            src={organization?.picture || ''}
                                            style={{ width: 40 }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        { organization?.name || '' }
                                        <Typography variant="body2">{allTranslations(localization['managerAbout.tableTransaction.packet'])}: { organization?.packet?.name || '-' }</Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>{ transactionTypes[type] }</TableCell>
                            <TableCell>{ formatMoney(sum, 2, '.') } { currency['rub'] }</TableCell>
                            <TableCell>
                                { moment(timestamp).format('DD.MM.YYYY / HH:mm') }
                            </TableCell>
                        </TableRow>
                    )
                })
            }
        </TableBody>
    )
};
const TableLoading = () => {
    return (
        <TableRow>
            <TableCell><Skeleton height={30}/></TableCell>
            <TableCell><Skeleton height={30}/></TableCell>
            <TableCell><Skeleton height={30}/></TableCell>
            <TableCell><Skeleton height={30}/></TableCell>
        </TableRow>
    )
};

export default TableTransaction
