import React from "react";
import {
    Box,
    Grid,
    Button,
    Avatar,
    Typography,
    Tooltip,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import {useHistory} from "react-router-dom";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const TableClients = (props) => {
    const { rows, filter, pagination, isLoading, onChangeFilter } = props;
    const history = useHistory();

    const handleChangePagination = (event, page) => {
        let newFilter = {...filter};

        newFilter.page = page;

        onChangeFilter(newFilter, true)
    }

    const handleChangeSort = (name) => {
        const { order, sortBy } = filter;
        let newFilter = {...filter};

        if (sortBy === name && order === -1) {
            newFilter.order = 1;

            onChangeFilter(newFilter, true);

            return null
        }
        if (sortBy === name && order === 1) {
            newFilter.sortBy = 'user';
            newFilter.order = -1;

            onChangeFilter(newFilter, true);

            return null
        }

        newFilter.sortBy = name;
        newFilter.order = -1;

        onChangeFilter(newFilter, true);
    }

    const _routeUser = (user) => {
        history.push(`/clients/${ user._id }`)
    }

    return (
        <>
            <Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization.clientsTableHeaderClient)}</TableCell>
                            <TableCell key="purchasesInOrganization">
                                <TableSortLabel
                                    name="purchasesInOrganization"
                                    active={filter.sortBy === 'purchasesInOrganization'}
                                    direction={filter.sortBy === 'purchasesInOrganization' ? filter.order === 1 ? 'asc' : 'desc' : 'desc'}
                                    onClick={() => handleChangeSort('purchasesInOrganization')}
                                >{allTranslations(localization.clientsTableHeaderCountPurchase)}</TableSortLabel>
                            </TableCell>
                            <TableCell>Кол-во приглашений</TableCell>
                            <TableCell key="purchasesSum">
                                <TableSortLabel
                                    name="purchasesSum"
                                    active={filter.sortBy === 'purchasesSum'}
                                    direction={filter.sortBy === 'purchasesSum' ? filter.order === 1 ? 'asc' : 'desc' : 'desc'}
                                    onClick={() => handleChangeSort('purchasesSum')}
                                >{allTranslations(localization.clientsTableHeaderSumPurchase)}</TableSortLabel>
                            </TableCell>
                            <TableCell key="bonusPoints">
                                <TableSortLabel
                                    name="bonusPoints"
                                    active={filter.sortBy === 'bonusPoints'}
                                    direction={filter.sortBy === 'bonusPoints' ? filter.order === 1 ? 'asc' : 'desc' : 'desc'}
                                    onClick={() => handleChangeSort('bonusPoints')}
                                >{allTranslations(localization.clientsTableHeaderCashback)}</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                {allTranslations(localization.clientsTableHeaderStatus)}
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {
                        isLoading && (
                            <TableBody>
                                <RowLoading/>
                                <RowLoading/>
                                <RowLoading/>
                                <RowLoading/>
                                <RowLoading/>
                                <RowLoading/>
                            </TableBody>
                        )
                    }

                    {
                        !isLoading && (
                            <TableBody>
                                {
                                    rows.map((row, idx) => (
                                        <Row onClick={_routeUser} key={`client-row-${ idx }`} {...row}/>
                                    ))
                                }
                            </TableBody>
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

                            onChange={handleChangePagination}
                        />
                    </Grid>
                </Grid>
            </Box>

        </>
    )

};

const RowLoading = () => {
    return (
        <TableRow>
            <TableCell><Skeleton height={20}/></TableCell>
            <TableCell><Skeleton height={20}/></TableCell>
            <TableCell><Skeleton height={20}/></TableCell>
            <TableCell><Skeleton height={20}/></TableCell>
            <TableCell><Skeleton height={20}/></TableCell>
            <TableCell><Skeleton height={30} width={30} variant="circle"/></TableCell>
        </TableRow>
    )
}
const Row = (props) => {
    return (
        <TableRow hover onClick={() => props.onClick(props)}>
            <TableCell>
                <Grid container spacing={1}>
                    <Grid item>
                        <Avatar
                            style={{ width: 40, height: 40 }}
                            src={props?.contact?.picture?.value}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" style={{ color: 'black' }}>{ props?.contact?.lastName?.value }</Typography>
                        <Typography variant="body2" style={{ color: 'black' }}>{ props?.contact?.firstName?.value }</Typography>
                    </Grid>
                </Grid>
            </TableCell>
            <TableCell>{ formatMoney(props?.stats?.subscriptionCount || 0) }</TableCell>
            <TableCell>{ formatMoney(props.purchasesInOrganization) }</TableCell>
            <TableCell>{ formatMoney(props.purchasesSum, 2, '.') } { currency['rub'] }</TableCell>
            <TableCell>{ formatMoney(props.bonusPoints, 2, '.') } { currency['rub'] }</TableCell>
            <TableCell>
                <Tooltip title={props.disabled ? allTranslations(localization.clientsTableBodyUserUnsubscribe) : allTranslations(localization.clientsTableBodyUserSubscribe)} arrow>
                    <Box
                        width={34}
                        height={34}
                        borderRadius="100%"
                        bgcolor={props.disabled ? "#DB4368" : "#8152E4"}
                        border="2px solid rgba(0, 0, 0, 0.1)"
                    />
                </Tooltip>
            </TableCell>
        </TableRow>
    )
}

export default TableClients
