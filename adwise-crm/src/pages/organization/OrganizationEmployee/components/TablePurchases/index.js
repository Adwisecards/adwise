import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import {

} from "@material-ui/lab";
import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TablePurchases = (props) => {
    const { rows, isLoading } = props;

    return (
        <>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>{allTranslations(localization['employee.tablePurchases.date'])}</TableCell>
                        <TableCell>{allTranslations(localization['employee.tablePurchases.coupon'])}</TableCell>
                        <TableCell>{allTranslations(localization['employee.tablePurchases.amount'])}</TableCell>
                        <TableCell>{allTranslations(localization['employee.tablePurchases.usePoints'])}</TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        rows.map((row) => {

                            return (

                                <TableRow>

                                    <TableCell>
                                        {Boolean(row.timestamp) && (<div>Создан — { moment(row.timestamp).format('DD.MM.YYYY HH:mm') }</div>)}
                                        {Boolean(row.paidAt) && (<div>Оплачен — { moment(row.paidAt).format('DD.MM.YYYY HH:mm') }</div>)}
                                        {Boolean(row.completedAt) && (<div>Завершён — { moment(row.paidAt).format('DD.MM.YYYY HH:mm') }</div>)}
                                    </TableCell>
                                    <TableCell>{row.coupons.map((t) => t.name).join('</br>')}</TableCell>
                                    <TableCell>{formatMoney(row?.sumInPoints || 0)}</TableCell>
                                    <TableCell>{formatMoney(row?.usedPoints || 0)}</TableCell>

                                </TableRow>

                            )
                        })

                    }

                </TableBody>

            </Table>

        </>
    )
}

export default TablePurchases
