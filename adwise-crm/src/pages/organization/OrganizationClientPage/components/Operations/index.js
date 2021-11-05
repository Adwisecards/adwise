import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Skeleton
} from "@material-ui/lab";
import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import localization from "../../../../../localization/localization";
import allTranslations from "../../../../../localization/allTranslations";

const Operations = (props) => {
    const { operations, isLoading } = props;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{allTranslations(localization.clientOperationsHeaderPurchase)}</TableCell>
                    <TableCell>{allTranslations(localization.clientOperationsHeaderDate)}</TableCell>
                    <TableCell>{allTranslations(localization.clientOperationsHeaderCashier)}</TableCell>
                    <TableCell>{allTranslations(localization.clientOperationsHeaderPayment)}</TableCell>
                    <TableCell>{allTranslations(localization.clientOperationsHeaderBonus)}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    isLoading && (
                        <>
                            <TableRow>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                                <TableCell><Skeleton height={30}/></TableCell>
                            </TableRow>
                        </>
                    )
                }

                {
                    !isLoading && (
                        <>
                            {
                                operations.map((item) => (
                                    <TableRow>
                                        <TableCell
                                            dangerouslySetInnerHTML={{ __html: item.coupons.map((coupon) => coupon?.name).join("<br/>") }}
                                        />
                                        <TableCell>{moment(item.timestamp).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                                        <TableCell>{allTranslations(localization.clientOperationsBodyTemporarilyUnavailable)}</TableCell>
                                        <TableCell>{formatMoney(item.sumInPoints, 2, '.')} {currency.rub}</TableCell>
                                        <TableCell>{formatMoney(item.usedPoints, 2, '.')} {currency.rub}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </>
                    )
                }
            </TableBody>
        </Table>
    )
}

const useStyles = makeStyles(() => ({

}));

export default Operations
