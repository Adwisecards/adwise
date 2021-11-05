import React from "react";
import {
    Box,
    Grid,
    Typography,
} from "@material-ui/core";
import {formatMoney} from "../../../../../helper/format";
import moment from "moment";

const Information = (props) => {
    const { stats, filter } = props;

    const _selectedPeriodSummary = () => {
        if ( !filter.dateFrom || !filter.dateTo ) {
            return "За все время"
        }

        return `от ${ moment(filter.dateFrom).format('DD.MM.YYYY') } до ${ moment(filter.dateTo).format('DD.MM.YYYY') }`
    }
console.log('filter: ', )

    return (
        <Grid container>
            <Grid item>
                <Box bgcolor="#EADEFE" borderRadius={8} p={2}>

                    <Box mb={1}>
                        <Grid container spacing={2} alignItems="flex-end">
                            <Grid item>
                                <Typography variant="h4">Сводка за выбранный период</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">{ _selectedPeriodSummary() }</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container spacing={4} wrap="nowrap">

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Сумма<br/>кэшбэк</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ stats.cashback ? formatMoney(stats.cashback) : '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Сумма<br/>1 уровня</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ stats.firstLevel ? formatMoney(stats.firstLevel) : '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Сумма<br/>2 - 21 уровня</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ stats.otherLevels ? formatMoney(stats.otherLevels) : '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Сумма<br/>AdWise</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ stats.adwisePoints ? formatMoney(stats.adwisePoints) : '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Сумма<br/>менеджера AdWise</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ stats.managerPoints ? formatMoney(stats.managerPoints) : '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Сумма<br/>прибыли</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ stats.organizationPoints ? formatMoney(stats.organizationPoints) : '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Сумма<br/>маркетинга</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ stats.marketingSum ? formatMoney(stats.marketingSum) : '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Покупок<br/>сумма / прибыль / кол-во</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ formatMoney(stats?.purchaseSum || 0 ) } / { formatMoney((stats?.cashOrganizationPoints || 0) + (stats?.onlineOrganizationPoints || 0)) } / { stats.purchaseCount || '-' }</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Наличные<br/>сумма / прибыль / кол-во</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ formatMoney(stats?.cashPurchaseSum || 0) } / { formatMoney(stats?.cashOrganizationPoints || 0) } / {stats?.cashPurchaseCount || '-'}</Typography>
                        </Grid>

                        <Grid item>
                            <Box mb={1}>
                                <Typography variant="caption">Онлайн<br/>сумма / прибыль / кол-во</Typography>
                            </Box>

                            <Typography variant="h5" color="primary">{ formatMoney(stats?.onlinePurchaseSum || 0) } / { formatMoney(stats?.onlineOrganizationPoints || 0) } / {stats?.onlinePurchaseCount || '-'}</Typography>
                        </Grid>

                    </Grid>

                </Box>
            </Grid>
        </Grid>
    )
}

export default Information
