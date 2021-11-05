import React, {useState} from "react";
import {
    Box,

    Typography,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,

    Grid,

    IconButton,

    Link,

    Tooltip,
    Switch
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Repeat as RepeatIcon,
    Code as CodeIcon,
    User as UserIcon,
    Server as ServerIcon,
    Trello as TrelloIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import transactionTypes from "../../../../../constants/transactionTypes";
import originTypes from "../../../../../constants/originTypes";
import userContactsType from "../../../../../constants/userContactsType";
import contactRoles from "../../../../../constants/contactRoles";

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter} = props;

    const [showShadowFixed, setShowShadowFixed] = useState(true);

    const classes = useStyles();

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;

        onChangeFilter(newFiler, true)
    }

    return (

        <>

            <Box mb={1}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item><Typography variant="body2" color="primary">Таблица имеет скролл</Typography></Grid>
                    <Grid item><CodeIcon size={20} color="#8152E4"/></Grid>
                </Grid>
            </Box>

            <Box mb={2}>
                <Grid container justify="space-between">
                    <Grid item>
                        <Typography variant="h5">Всего найдено <span style={{ color: '#8152E4' }}>{ formatMoney(props.totalCountRows, 0) }</span> элементов</Typography>
                    </Grid>
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            count={pagination.countPages}

                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                </Grid>
            </Box>

            <PerfectScrollbar
                onScrollX={() => setShowShadowFixed(true)}
                onXReachEnd={() => setShowShadowFixed(false)}
            >

                <Box
                    minWidth={1800}
                    className={clsx({
                        [classes.stickyActionsColumn]: true,
                        [classes.stickyActionsShadow]: !showShadowFixed,
                    })}
                >

                    <Table>

                        <TableHeader/>

                        {
                            isLoading && (
                                <BodyLoaders/>
                            )
                        }

                        {
                            !isLoading && (
                                <Body rows={rows}/>
                            )
                        }

                    </Table>

                </Box>

            </PerfectScrollbar>

            <Box mt={2}>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
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
            <TableCell>ID</TableCell>
            <TableCell>Фио</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Телефон</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Должность</TableCell>
            <TableCell>Кол-во друзей</TableCell>
            <TableCell>Кол-во организаций</TableCell>
            <TableCell>Организация</TableCell>
            <TableCell>Цвет визитной карточки</TableCell>
            <TableCell></TableCell>
        </TableHead>
    )
}

const Body = (props) => {
    const {rows} = props;
    const classes = useStyles();

    const handleOpenUser = (row) => {
        window.open(`/users?_id=${ row.ref }`);
    }
    const handleOpenOrganization = (row) => {
        window.open(`/organizations?_id=${ row.organization._id }`);
    }

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    const fullName = `${ row?.lastName?.value } ${ row?.firstName?.value }`;
                    const email = row?.email?.value || '';
                    const phone = row?.phone?.value || '';
                    const organization = row?.organization?.name;

                    return (
                        <TableRow key={`row-organization-${idx}`}>
                            <TableCell>{ row._id }</TableCell>
                            <TableCell>{ fullName }</TableCell>
                            <TableCell>{ email }</TableCell>
                            <TableCell>{ phone }</TableCell>
                            <TableCell>{ userContactsType[row.type] }</TableCell>
                            <TableCell>{ (row?.employee?.role) ? contactRoles[row.employee.role] : '-'}</TableCell>
                            <TableCell width={80}>{ row.contacts.length } шт.</TableCell>
                            <TableCell width={80}>{ row.subscriptions.length } шт.</TableCell>
                            <TableCell>{ organization || '-' }</TableCell>
                            <TableCell width={40}>
                                <Box style={{ width: 25, height: 25, borderRadius: 999, backgroundColor: row.color }}/>
                            </TableCell>


                            <TableCell>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Tooltip title="Открыть пользователя">
                                            <IconButton
                                                onClick={() => handleOpenUser(row)}
                                            >
                                                <UserIcon size={20} color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Открыть организацию">
                                            <IconButton
                                                onClick={() => handleOpenOrganization(row)}
                                                disabled={!row.organization?._id}
                                            >
                                                <TrelloIcon size={20} color={Boolean(!row.organization?._id) ? "#CBCCD4" : "#8152E4"}/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>

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
                    </TableRow>

                ))
            }

        </TableBody>
    )
}

const useStyles = makeStyles((theme) => ({
    stickyActionsColumn: {
        '& table:first-child': {
            '& tr': {
                '& td:last-child, th:last-child': {
                    backgroundColor: '#f9f9fa',
                    position: 'sticky',
                    right: 0,
                    zIndex: 0,

                    '&::before': {
                        content: "''",
                        width: 5,
                        height: 'calc(100% + 1px)',

                        position: 'absolute',

                        right: '100%',
                        top: -8,
                        zIndex: -1,

                        background: 'linear-gradient(90deg, rgba(248,108,108,0) 0%, rgba(129, 82, 228, .3) 100%)',

                        transition: 'all 1s'
                    },
                    '&::after': {
                        content: "''",
                        width: '100%',

                        position: 'absolute',

                        left: 0,
                        // top: -8,
                        zIndex: -1,

                        backgroundColor: '#f9f9fa'
                    },
                },
                '& th:first-child': {
                    zIndex: 1
                }
            },
            '& tr:nth-child(2n)': {
                '& td:last-child, th:last-child': {
                    backgroundColor: 'white',
                    position: 'sticky',
                    right: 0,
                    zIndex: 0,
                    '&::after': {
                        content: "''",
                        width: '100%',

                        position: 'absolute',

                        left: 0,
                        top: -8,
                        zIndex: -1,

                        backgroundColor: 'white'
                    },
                },
                '& th:first-child': {
                    zIndex: 1
                }
            },
            '& th': {
                backgroundColor: 'white',
                position: 'sticky',
                right: 0,
                zIndex: 1
            },
        }
    },
    stickyActionsShadow: {
        '& table:first-child': {
            '& tr': {
                '& td:last-child, th:last-child': {
                    '&::before': {
                        background: 'transparent'
                    }
                }
            }
        }
    },

    status: {
        width: 20,
        height: 20,

        borderRadius: 999,

        borderWidth: 1,
        borderStyles: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    statusError: {
        backgroundColor: '#FA7D7D'
    },
    statusSuccess: {
        backgroundColor: '#94D36C'
    },

}));

export default TableOrganization
