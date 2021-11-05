import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TableRatings = (props) => {
    const { rows } = props;

    return (
        <>

            <Table>

                <TableHead>

                    <TableRow>
                        <TableCell>{allTranslations(localization['employee.tableRatings.rating'])}</TableCell>
                        <TableCell>{allTranslations(localization['employee.tableRatings.comment'])}</TableCell>
                        <TableCell align="right">{allTranslations(localization['employee.tableRatings.date'])}</TableCell>
                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        rows.map((row) => {
                            const timestamp = row._id.toString().substring(0,8);
                            const date = new Date( parseInt( timestamp, 16 ) * 1000 );

                            return (
                                <TableRow>
                                    <TableCell width="100">{formatMoney((row?.rating || 0), 1, '.')}Б</TableCell>
                                    <TableCell>{row.comment || allTranslations(localization['employee.tableRatings.noComment'])}</TableCell>
                                    <TableCell align="right">{moment(date).add(5, 'h').format('DD.MM.YYYY HH:mm')}</TableCell>
                                </TableRow>
                            )
                        })
                    }

                </TableBody>

            </Table>

        </>
    )
}

export default TableRatings
