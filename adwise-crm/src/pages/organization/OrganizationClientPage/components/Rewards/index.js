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
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const Rewards = (props) => {
    const { rewards, isLoading } = props;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{allTranslations(localization.clientRewardsHeaderPurchase)}</TableCell>
                    <TableCell>{allTranslations(localization.clientRewardsHeaderDate)}</TableCell>
                    <TableCell>{allTranslations(localization.clientRewardsHeaderPayment)}</TableCell>
                    <TableCell>{allTranslations(localization.clientRewardsHeaderBonus)}</TableCell>
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
                            </TableRow>
                            <TableRow>
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
                            </TableRow>
                            <TableRow>
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
                                rewards.map((reward, idx) => (
                                    <TableRow>
                                        <TableCell>{reward.couponName}</TableCell>
                                        <TableCell>{moment(reward.timestamp).format("DD.MM.YYYY HH:mm")}</TableCell>
                                        <TableCell>{formatMoney(reward.sum, 2, '.')} {currency.rub}</TableCell>
                                        <TableCell>{formatMoney(reward.bonusPoints, 2, '.')} {currency.rub}</TableCell>
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

export default Rewards
