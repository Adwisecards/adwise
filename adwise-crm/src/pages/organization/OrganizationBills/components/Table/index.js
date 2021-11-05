import React, {useState} from "react";
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Collapse,
    Grid,
    Link,
    Typography
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    ChevronUp as ChevronUpIcon,
    ChevronDown as ChevronDownIcon
} from "react-feather";
import moment from "moment";
import {formatCode, formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import paymentTypes from "../../../../../constants/paymentTypes";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter, onOpenCoupons} = props;

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.page = page;

        onChangeFilter(newFiler, true)
    }

    return (

        <>
            <Box>

                <Table>

                    <TableHeader/>

                    {
                        isLoading && (
                            <BodyLoaders/>
                        )
                    }

                    {
                        !isLoading && (
                            <Body rows={rows} onOpenCoupons={onOpenCoupons}/>
                        )
                    }

                </Table>

            </Box>

            <Box mt={2}>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.page}
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

            <TableCell width={40}></TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderName)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderDateCreate)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderDatePayment)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderDateCompletion)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderStatus)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderAmount)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderCashback)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderMarketing)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderProfit)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderClient)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderReceipt)}</TableCell>
            <TableCell>{allTranslations(localization.billsTableHeaderEvaluation)}</TableCell>

        </TableHead>
    )
}
const Body = (props) => {
    const {rows, onOpenCoupons} = props;

    const [opens, setOpens] = useState([]);

    const classes = useStyles();

    const handleOnChangeOpens = (id) => {
        let newOpens = [...opens];
        const indexItem = newOpens.findIndex(t => t === id);

        if (indexItem > -1) {
            newOpens.splice(indexItem, 1)
        } else {
            newOpens.push(id)
        }

        setOpens(newOpens);
    }

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    const isUser = !!row.user;
                    const cashback = row.offer.percent;
                    const stats = row.stats;
                    const isOpen = opens.indexOf(row._id) > -1;
                    const Icon = Boolean(isOpen) ? ChevronUpIcon : ChevronDownIcon;

                    return (

                        <>

                            <TableRow
                                key={`row-organization-${idx}`}
                                hover
                                onClick={() => handleOnChangeOpens(row._id)}
                            >
                                <TableCell width={40}>
                                    <Icon color={Boolean(isOpen) ? '#ED8E00' : '#8152E4'}/>
                                </TableCell>
                                <TableCell width={250}>
                                    {
                                        row.coupons.length > 1 ? (
                                            <Link onClick={() => onOpenCoupons(row)}>{row?.coupon?.name} ...</Link>
                                        ) : (
                                            <Link onClick={() => onOpenCoupons(row)}>{row?.coupon?.name}</Link>
                                        )
                                    }
                                </TableCell>
                                <TableCell className="no-wrap">{(!!row.timestamp) ?
                                    <div>{moment(row.timestamp).format("DD.MM.YYYY")}<br/>{moment(row.timestamp).format("HH:mm")}
                                    </div> : '—'}</TableCell>
                                <TableCell className="no-wrap">{(!!row.paidAt) ?
                                    <div>{moment(row.paidAt).format("DD.MM.YYYY")}<br/>{moment(row.paidAt).format("HH:mm")}
                                    </div> : '—'}</TableCell>
                                <TableCell className="no-wrap">{(!!row.completedAt) ?
                                    <div>{moment(row.completedAt).format("DD.MM.YYYY")}<br/>{moment(row.completedAt).format("HH:mm")}
                                    </div> : '—'}</TableCell>

                                <TableCell align="left">
                                    <Grid container>
                                        <Grid item>
                                            <div className={clsx({
                                                "no-wrap": true,
                                                [classes.status]: true,
                                                [classes.statusConfirmed]: (!row.archived && row.confirmed && !row.complete),
                                                [classes.statusNotConfirmed]: (row.archived || !row.confirmed && !row.processing),
                                                [classes.statusProcessing]: (!row.archived && row.processing && !row.confirmed),
                                                [classes.statusFinish]: (!row.archived && row.confirmed && row.complete),
                                            })}>
                                                {(row.archived) && "Архив"}
                                                {(!row.archived && row.confirmed && !row.complete) && allTranslations(localization.purchaseStatusPaid)}
                                                {(!row.archived && !row.confirmed && !row.processing) && allTranslations(localization.purchaseStatusNotPaid)}
                                                {(!row.archived && row.processing && !row.confirmed) && allTranslations(localization.purchaseStatusProcessing)}
                                                {(!row.archived && row.confirmed && row.complete) && allTranslations(localization.purchaseStatusComplete)}
                                            </div>
                                        </Grid>
                                    </Grid>

                                </TableCell>

                                <TableCell
                                    className="no-wrap">{formatMoney(row.sumInPoints, 2, '.')} {currency[row.currency]}</TableCell>
                                <TableCell
                                    className="no-wrap">{formatMoney(stats.cashback, 2, '.')} {currency[row.currency]}</TableCell>
                                <TableCell
                                    className="no-wrap">{formatMoney(stats.marketingSum, 2, '.')} {currency[row.currency]}</TableCell>
                                <TableCell
                                    className="no-wrap">{formatMoney((row.sumInPoints - Math.abs(stats.cashback) - Math.abs(stats.marketingSum)), 2, '.')} {currency[row.currency]}</TableCell>
                                <TableCell>{isUser ? `${row.user.lastName || ''} ${row.user.firstName || ''}` : '—'}</TableCell>
                                <TableCell className="no-wrap"></TableCell>
                                <TableCell className="no-wrap">
                                    {(row.rating > 0) ? `${row.rating} ${allTranslations(localization.billsPoints)}` : '—'}
                                </TableCell>

                            </TableRow>


                            <TableRow key={`row-organization-collapse-${idx}`}>
                                <TableCell style={{paddingTop: 0, paddingBottom: 0}} colSpan={13}>
                                    <Collapse in={isOpen} timeout="auto" unmountOnExit>

                                        <Box px={3} py={2} bgcolor="#f9f9fa" mb={1} borderRadius="0 0 16px 16px">

                                            <Typography>
                                                {allTranslations(localization.billsTableHeaderScore)} — {formatCode(row.ref.code)}
                                            </Typography>
                                            <Typography>
                                                {allTranslations(localization.billsTableHeaderType)} — {paymentTypes[row.type]}
                                            </Typography>
                                            <Typography>
                                                {allTranslations(localization.billsTableHeaderComment)} — {row.comment || allTranslations(localization.billsTableHeaderNoComment)}
                                            </Typography>
                                            <Typography>
                                                {allTranslations(localization.billsTableHeaderFeedback)} — {row.review || allTranslations(localization.billsTableHeaderNoFeedback)}
                                            </Typography>
                                            <Typography>
                                                {allTranslations(localization.billsTableHeaderCashierFeedback)} — {row.employeeRating?.comment || allTranslations(localization.billsTableHeaderNoFeedback)}
                                            </Typography>
                                            <Typography>
                                                {allTranslations(localization.billsTableHeaderCashierEvaluation)} — {row.employeeRating?.rating || ''}
                                            </Typography>

                                        </Box>

                                    </Collapse>
                                </TableCell>
                            </TableRow>

                        </>
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

                    </TableRow>

                ))
            }

        </TableBody>
    )
}

const useStyles = makeStyles((theme) => ({
    status: {
        padding: '3px 6px',
        borderRadius: 36,
        color: 'white',
        fontWeight: '500'
    },
    statusConfirmed: {
        backgroundColor: '#61AE2C'
    },
    statusFinish: {
        backgroundColor: '#8152E4'
    },
    statusNotConfirmed: {
        backgroundColor: '#D8004E'
    },
    statusProcessing: {
        backgroundColor: '#ED8E00'
    },

    boxCollapse: {
        margin: '16px 0',
        padding: 32,

        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)'
    }

}));

export default TableOrganization
