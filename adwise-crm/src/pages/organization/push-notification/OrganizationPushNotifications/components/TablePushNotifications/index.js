import React from "react";
import {
    Box,
    Grid,
    Typography,

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
import {NumericalReliability} from "../../../../../../helper/numericalReliability";
import {formatMoney} from "../../../../../../helper/format";
import {
    Users as UsersIcon
} from "react-feather";
import moment from "moment";
import allTranslations from "../../../../../../localization/allTranslations";
import localization from "../../../../../../localization/localization";

const TablePushNotifications = (props) => {
    const {
        rows,
        filter,
        pagination,
        isLoading,

        onChangeFilter,
    } = props;

    const handleOnChangePage = (event, page) => {
        let newFilter = {...filter};
        newFilter.page = page;
        onChangeFilter(newFilter, true);
    }

    return (

        <>

            <Box>

                <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography
                            variant="paginationTitle"
                            dangerouslySetInnerHTML={{
                                __html: allTranslations(
                                    localization['push_notification.pushNotification.tablePushNotifications.total'],
                                    {
                                        count: pagination?.total,
                                        word: NumericalReliability(pagination?.total, [
                                            allTranslations(localization['push_notification.pushNotification.tablePushNotifications.mailing1']),
                                            allTranslations(localization['push_notification.pushNotification.tablePushNotifications.mailing2']),
                                            allTranslations(localization['push_notification.pushNotification.tablePushNotifications.mailing3'])
                                        ])
                                    })
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Pagination
                            page={filter.page}
                            count={pagination.count}

                            onChange={handleOnChangePage}
                        />
                    </Grid>
                </Grid>

            </Box>

            <Box mb={4} mt={4}>

                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization['push_notification.pushNotification.tablePushNotifications.date'])}</TableCell>
                            <TableCell>{allTranslations(localization['push_notification.pushNotification.tablePushNotifications.title'])}</TableCell>
                            <TableCell>{allTranslations(localization['push_notification.pushNotification.tablePushNotifications.message'])}</TableCell>
                            {/*<TableCell align="right">{allTranslations(localization['push_notification.pushNotification.tablePushNotifications.countClients'])}</TableCell>*/}
                            <TableCell align="right">{allTranslations(localization['push_notification.pushNotification.tablePushNotifications.successSend'])}</TableCell>
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

                                </>
                            )
                        }

                        {

                            Boolean(!isLoading) && (
                                <>

                                    {

                                        rows.map((row, idx) => (
                                            <RowData {...row} key={`row-push-notification-${idx}`}/>
                                        ))

                                    }

                                </>
                            )

                        }

                    </TableBody>

                </Table>

            </Box>

            <Box>

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
    return (
        <TableRow>
            <TableCell width={150}>
                <Box>{moment(props.timestamp).format('DD.MM.YYYY')}</Box>
                <Box>{moment(props.timestamp).format('HH:mm:ss')}</Box>
            </TableCell>
            <TableCell width={280}>
                {props.title}
            </TableCell>
            <TableCell>
                {props.body}
            </TableCell>
            <TableCell align="right">
                <Grid container spacing={2} alignItems="center" justify="flex-end">
                    <Grid item>
                        {formatMoney(props.receivers.length, 0, '')}
                    </Grid>
                    <Grid item>
                        <UsersIcon color="#8152E4"/>
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow>
    )
}

export default TablePushNotifications
