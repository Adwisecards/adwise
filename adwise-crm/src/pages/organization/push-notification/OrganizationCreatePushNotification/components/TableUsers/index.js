import React from "react";
import {
    Box,
    Grid,
    Avatar,
    Switch,
    Checkbox,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import {
    Pagination,
    Skeleton
} from "@material-ui/lab";
import {formatMoney} from "../../../../../../helper/format";
import currency from "../../../../../../constants/currency";
import allTranslations from "../../../../../../localization/allTranslations";
import localization from "../../../../../../localization/localization";

const TableUsers = (props) => {
    const { rows, filter, pagination, isLoading, onChangeClient, selectedClients, onChangeFilter } = props;

    const handleOnChangePage = (event, page) => {
        let newFilter = {...filter};
        newFilter.page = page;
        onChangeFilter(newFilter, true);
    }

    return (
        <>

            <Box mb={2}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization['push_notification.createPushNotification.tableUsers.client'])}</TableCell>
                            <TableCell>{allTranslations(localization['push_notification.createPushNotification.tableUsers.countPurchase'])}</TableCell>
                            <TableCell align="right">{allTranslations(localization['push_notification.createPushNotification.tableUsers.cashback'])}</TableCell>
                            <TableCell align="right">{allTranslations(localization['push_notification.createPushNotification.tableUsers.amountPurchase'])}</TableCell>
                            <TableCell align="right">{allTranslations(localization['push_notification.createPushNotification.tableUsers.status'])}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Boolean(isLoading) && (
                                <>
                                    <RowLoading/>
                                    <RowLoading/>
                                    <RowLoading/>
                                    <RowLoading/>
                                    <RowLoading/>
                                    <RowLoading/>
                                    <RowLoading/>
                                    <RowLoading/>
                                </>
                            )
                        }
                        {
                            Boolean(!isLoading) && (
                                <>

                                    {

                                        rows.map((client, idx) => (
                                            <RowData
                                                key={`row-client-${idx}-${client._id}`}
                                                client={client}
                                                isActive={Boolean(selectedClients.find((t) => t._id === client._id))}
                                                onChangeClient={onChangeClient}
                                            />
                                        ))

                                    }

                                </>
                            )
                        }
                    </TableBody>
                </Table>

            </Box>

            <Box>
                <Grid container justify="flex-end">
                    <Pagination
                        count={pagination.count}
                        page={filter.page}
                        onChange={handleOnChangePage}
                    />
                </Grid>
            </Box>

        </>
    )
}

const RowLoading = () => {
    return (
        <TableRow>
            <TableCell><Skeleton/></TableCell>
            <TableCell><Skeleton/></TableCell>
            <TableCell><Skeleton/></TableCell>
            <TableCell><Skeleton/></TableCell>
            <TableCell><Skeleton/></TableCell>
        </TableRow>
    )
}
const RowData = (props) => {
    const { client, isActive, onChangeClient } = props;
    return (
        <TableRow hover onClick={() => onChangeClient(client)} selected={isActive}>
            <TableCell>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Checkbox color="primary" checked={isActive}/>
                    </Grid>
                    <Grid item>
                        <Avatar src={client?.contact?.picture?.value || '/img/user_empty.png'}/>
                    </Grid>
                    <Grid item>
                        {`${ client?.contact?.firstName?.value } ${ client?.contact?.lastName?.value }`}
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell>
                {formatMoney(client.stats?.purchaseCount || 0, 0, '')}
            </TableCell>
            <TableCell align="right">
                {formatMoney(client.stats?.cashbackSum || 0, 0, '')} {currency.rub}
            </TableCell>
            <TableCell align="right">
                {formatMoney(client.stats?.purchaseSum || 0, 0, '')} {currency.rub}
            </TableCell>
            <TableCell align="right">
                <Switch checked={!client.disabled} disabled/>
            </TableCell>
        </TableRow>
    )
}

export default TableUsers
