import React from 'react';
import {
    Box,
    Grid,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    TextField,

    Switch,

    Tooltip,
    IconButton
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Skeleton,
    Pagination
} from '@material-ui/lab';
import {
    Percent as PercentIcon
} from '../../../../../icons';
import {useHistory} from 'react-router-dom';
import {
    Plus as PlusIcon
} from "react-feather";
import PerfectScrollbar from 'react-perfect-scrollbar';
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {formatMoney} from "../../../../../helper/format";
import moment from 'moment';
import couponTypes from "../../../../../constants/couponTypes";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import currency from "../../../../../constants/currency";

const TableLoaderRow = () => {
    const classes = useStyles();

    return (
        <>
            {
                [0, 1, 2, 3, 4, 5, 6].map((item) => (
                    <TableRow key={`table-row-loader-${ item }`}>
                        <TableCell width={40}>
                            <div className={classes.percentCircle}>
                                <PercentIcon />
                            </div>
                        </TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'right'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'right'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'right'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'right'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'right'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'right'}><Skeleton height={35}/></TableCell>
                        <TableCell width={35}>
                            <Switch />
                        </TableCell>
                        <TableCell width={35}>
                            <Skeleton height={40} width={40}/>
                        </TableCell>
                    </TableRow>
                ))
            }
        </>
    )
}

const TableShares = (props) => {
    const { activeTab, type, filter, pagination, isLoadSharesList, onChangeSharesList, onChangeList, onChangeFilter, onCreateBasisCoupon } = props;
    let { sharesList } = props;
    const classes = useStyles();
    const history = useHistory();

    const handleOpenPageCoupon = ({ target }, id) => {
        const parent = target.closest('.MuiTableCell-body');

        if (!parent) {
            return null
        }

        const isSwitch = parent.querySelector('.table-coupons-switch');

        if (isSwitch){
            return null
        }

        history.push(`/coupons/${ id }`);
    }
    const handleDisabledRow = (event, value, id) => {
        axiosInstance.put(`${ urls["set-coupon-disabled"] }${ id }`, {
            disabled: !value
        }).then((response) => {
            let row = sharesList.find((row) => row._id === id);
            row.disabled = !value;

            onChangeSharesList(sharesList);
        })
    }

    const handleOnChangeIndex = ({target}, row) => {
        let { value } = target;

        if (value < 0){
            value = 0
        }
        if (value > 999){
            value = 999
        }

        row.index = value;

        onChangeList(sharesList)
    }

    const handleOnChangePage = (event, page) => {
        let newFilter = {...filter};

        newFilter.page = page;

        onChangeFilter(newFilter);
    }

    return (
        <Box>

            <Box mb={2}>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.page}
                            count={pagination.countPages}

                            onChange={handleOnChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>

            <PerfectScrollbar>
                <Box minWidth={1000}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={40}></TableCell>
                                <TableCell align={'left'}>{allTranslations(localization.couponsTableHeaderDate)}</TableCell>
                                <TableCell align={'left'}>{allTranslations(localization.couponsTableHeaderName)}</TableCell>
                                <TableCell align={'left'}>{allTranslations(localization.couponsTableHeaderType)}</TableCell>
                                <TableCell align={'left'}>{allTranslations(localization.couponsTableHeaderPrice)}</TableCell>
                                <TableCell align={'left'}>{allTranslations(localization.couponsTableHeaderCount)}</TableCell>
                                <TableCell align={'left'}>{allTranslations(localization.couponsTableHeaderCountUse)}</TableCell>
                                <TableCell align={'right'}>{allTranslations(localization.couponsTableHeaderAmount)}</TableCell>
                                <TableCell align={'right'}>{allTranslations(localization.couponsTableHeaderAmountCashback)}</TableCell>
                                <TableCell align={'right'}>{allTranslations(localization.couponsTableHeaderAmountMarketing)}</TableCell>
                                <TableCell align={'right'} width={80}>{allTranslations(localization.couponsTableHeaderSortIndex)}</TableCell>
                                <TableCell width={35}></TableCell>
                                <TableCell width={35}></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            { (isLoadSharesList) && <TableLoaderRow/> }

                            {
                                sharesList.map((row, idx) => {

                                    if (activeTab === 'active') {
                                        if (row.disabled !== false) {
                                            return null
                                        }
                                    }
                                    if (activeTab === 'disabled') {
                                        if (row.disabled !== true) {
                                            return null
                                        }
                                    }

                                    if (type !== 'all' && type !== row.type) {
                                        return null
                                    }

                                    const cashbackSum = row.purchaseSum * ( row.offer.percent / 100 );
                                    const dateStart = moment(row.startDate).format('DD.MM.YYYY')

                                    return (
                                        <TableRow
                                            key={idx}
                                            onClick={(event) => handleOpenPageCoupon(event, row._id)}

                                            hover
                                        >
                                            <TableCell width={40}>
                                                <div className={classes.percentCircle}>
                                                    <PercentIcon />
                                                </div>
                                            </TableCell>
                                            <TableCell align={'left'}>{ dateStart }</TableCell>
                                            <TableCell align={'left'}>{ row.name }</TableCell>
                                            <TableCell align={'left'}>{ couponTypes[row.type] }</TableCell>
                                            <TableCell className="no-wrap" align={'left'}>{ (row.price) ? `${ formatMoney(row.price, 2, '.') } ${currency.rub}` : '—' }</TableCell>
                                            <TableCell className="no-wrap" align={'left'}>{ row.quantity }</TableCell>
                                            <TableCell align={'left'}>{ Number( row.initialQuantity ) - row.quantity }</TableCell>
                                            <TableCell className="no-wrap" align={'right'}>{ formatMoney(row.purchaseSum, 2, '.') } ₽</TableCell>
                                            <TableCell className="no-wrap" align={'right'}>{ formatMoney(cashbackSum, 2, '.') } ₽</TableCell>
                                            <TableCell className="no-wrap" align={'right'}>{ formatMoney(row.marketingSum, 2, '.') } ₽</TableCell>
                                            <TableCell align={'right'}>
                                                <TextField
                                                    value={row.index || ''}
                                                    defaultValue={1}
                                                    fullWidth
                                                    type="number"
                                                    className="table-coupons-switch"
                                                    variant="outlined"
                                                    placeholder="0"
                                                    style={{ textAlign: 'center' }}

                                                    onChange={(event) => handleOnChangeIndex(event, row)}
                                                />
                                            </TableCell>
                                            <TableCell width={35}>
                                                <Switch className={'table-coupons-switch'} checked={!row.disabled} onChange={(event, value) => handleDisabledRow(event, value, row._id)}/>
                                            </TableCell>
                                            <TableCell width={40}>
                                                <Tooltip arrow title={allTranslations(localization.couponsCreateCouponBased)}>
                                                    <IconButton className="table-coupons-switch" onClick={() => onCreateBasisCoupon(row)}>
                                                        <PlusIcon color="#8152E4"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>

            <Box mt={2}>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.page}
                            count={pagination.countPages}

                            onChange={handleOnChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    percentCircle: {
        width: 40,
        height: 40,

        borderRadius: '100%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#CBCCD4',

        backgroundColor: 'white',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

export default TableShares
