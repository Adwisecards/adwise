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
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TableOrganization = (props) => {
    const {
        rows,
        pagination,
        filter,

        isLoading,

        onChangeFilter
    } = props;

    return (
        <>

            <Box mb={2}></Box>

            <Box minWidth="100%">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization.managerTableOrganizationOrganization)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableOrganizationAmount)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableOrganizationCoupons)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableOrganizationChecks)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableOrganizationEmploes)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableOrganizationTariff)}</TableCell>
                            <TableCell>{allTranslations(localization.managerTableOrganizationDate)}</TableCell>
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

            <Box mt={2}></Box>

        </>
    )
}

const TableData = (props) => {
    const { rows } = props;

    return (
        <TableBody>
            {
                rows.map((row, idx) => {
                    const { organization, couponCount, enabledCouponCount, purchaseCount, purchaseSum } = row;

                    return (
                        <TableRow>
                            <TableCell>

                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <Avatar
                                            src={organization.picture}
                                            style={{ width: 40 }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        { organization.name }
                                    </Grid>
                                </Grid>

                            </TableCell>
                            <TableCell>{ formatMoney(purchaseSum) }</TableCell>
                            <TableCell>{ couponCount } / { enabledCouponCount }</TableCell>
                            <TableCell>{ formatMoney(purchaseCount, 0) }</TableCell>
                            <TableCell>{ organization?.employees.length - 1 }</TableCell>
                            <TableCell>{ organization.packet?.name || '—' }</TableCell>
                            <TableCell>{ (Boolean(organization?.packet)) ? moment(organization?.packet.timestamp).add(1, 'year').format('DD.MM.YYYY') : '-' }</TableCell>
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
            <TableCell>
                <Skeleton height={30}/>
            </TableCell>
            <TableCell>
                <Skeleton height={30}/>
            </TableCell>
            <TableCell>
                <Skeleton height={30}/>
            </TableCell>
            <TableCell>
                <Skeleton height={30}/>
            </TableCell>
            <TableCell>
                <Skeleton height={30}/>
            </TableCell>
            <TableCell>
                <Skeleton height={30}/>
            </TableCell>
            <TableCell>
                <Skeleton height={30}/>
            </TableCell>
        </TableRow>
    )
};

export default TableOrganization
