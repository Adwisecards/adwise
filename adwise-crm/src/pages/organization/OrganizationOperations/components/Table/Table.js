import React from 'react';
import {
    Switch,

    Grid,

    Box,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    PurchaseIcon
} from '../../../../../icons';

import moment from 'moment';
import {formatCode, formatMoney} from "../../../../../helper/format";
import operationTypes from "../../../../../constants/operationTypes";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import currency from "../../../../../constants/currency";

const TableOrganizationCoupons = (props) => {
    const {isLoading, operations, global, filter, countPage, pagination, onChangeFilter} = props;

    const classes = useStyles();

    const handleOnChangePage = (event, page) => {
        let newFilter = {...filter};
        newFilter['page'] = page;

        onChangeFilter(newFilter);
    }

    return (
        <>

            <Box mb={2}>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h5">{allTranslations(localization.commonTotalFound)} <span
                            style={{color: '#8152E4'}}>{formatMoney(props.totalCountRows, 0)}</span> {allTranslations(localization.commonElements)}</Typography>
                    </Grid>
                    <Grid item>
                        <Pagination
                            page={filter.page}
                            count={pagination.countPages}

                            onChange={handleOnChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>


            <Table>

                <TableHead>
                    <TableRow>
                        <TableCell>{allTranslations(localization.operationsTableDate)}</TableCell>
                        <TableCell>{allTranslations(localization.operationsTableType)}</TableCell>
                        <TableCell>{allTranslations(localization.operationsTableCashback)}, {currency.rub}</TableCell>
                        <TableCell>{allTranslations(localization.operationsTableFirstLevel)}, {currency.rub}</TableCell>
                        <TableCell>{allTranslations(localization.operationsTableOtherLevel)}, {currency.rub}</TableCell>
                        <TableCell>{allTranslations(localization.operationsTableAmountAdwise)}</TableCell>
                        <TableCell>{allTranslations(localization.operationsTableManagerAdwise)}</TableCell>
                        <TableCell>{allTranslations(localization.operationsTableAmount)}</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    {(isLoading) && <TableLoaderRow/>}

                    {!isLoading && (
                        <>
                            {
                                operations.map((operation, idx) => {
                                    const date = moment(operation.timestamp).format('DD.MM.YYYY');
                                    const time = moment(operation.timestamp).format('HH:mm');

                                    return (
                                        <TableRow>
                                            <TableCell>
                                                <span className={classes.date}>{date}</span><br/>
                                                <span className={classes.time}>{time}</span>
                                            </TableCell>
                                            <TableCell>{operationTypes[operation.type]}</TableCell>
                                            <TableCell>
                                                {formatMoney(operation.cashback, 2, '.')}
                                            </TableCell>
                                            <TableCell>
                                                {formatMoney(operation.firstLevel, 2, '.')}
                                            </TableCell>
                                            <TableCell>
                                                {formatMoney(operation.otherLevels, 2, '.')}
                                            </TableCell>
                                            <TableCell>
                                                {formatMoney(operation.adwisePoints, 2, '.')}
                                            </TableCell>
                                            <TableCell>
                                                {formatMoney(operation.managerPoints, 2, '.')}
                                            </TableCell>
                                            <TableCell>
                                                {(operation.type === 'withdrawal' ? '-' : '')}{formatMoney(operation.sum, 2, '.')}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </>
                    )}

                </TableBody>

            </Table>

            <Box mt={4}>

                <Grid container justify="flex-end" alignItems="center">
                    <Grid item>
                        <Pagination
                            page={filter.page}
                            count={pagination.countPages}

                            onChange={handleOnChangePage}
                        />
                    </Grid>
                </Grid>

            </Box>


        </>
    )
}

const TableLoaderRow = () => {
    return (
        <>
            {
                [0, 1, 2, 3, 4, 5, 6].map((item) => (
                    <TableRow key={`table-row-loader-${item}`}>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                    </TableRow>
                ))
            }
        </>
    )
}

const useStyles = makeStyles(() => ({
    date: {
        fontWeight: '500'
    },
    time: {
        color: '#999DB1'
    },
}));

export default TableOrganizationCoupons
