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
    CreditCard as CreditCardIcon,
    Settings as SettingsIcon,
    Edit2 as Edit2Icon
} from "react-feather";
import {
    HelpBadge
} from "../../../../../components";
import moment from "moment";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";

const TableOrganization = (props) => {
    const {rows, isLoading, filter, pagination, onDelete, makePayment, makePaymentLegal, onChangeFilter, onChangeActiveTask, onEdit} = props;

    const classes = useStyles();

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;

        onChangeFilter(newFiler, true)
    }

    return (

        <>

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

            <Box>

                <Table>

                    <TableHeader/>

                    {
                        isLoading && (
                            <BodyLoaders/>
                        )
                    }

                    {
                        !isLoading && (
                            <Body
                                rows={rows}
                                makePayment={makePayment}
                                makePaymentLegal={makePaymentLegal}
                                onChangeActiveTask={onChangeActiveTask}
                                onEdit={onEdit}
                            />
                        )
                    }

                </Table>

            </Box>

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

            <TableCell>Время создания заявки</TableCell>
            <TableCell>Статус заявки</TableCell>
            <TableCell>Фио // Организация</TableCell>
            <TableCell>Выполненная задача</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Адрес кошелька</TableCell>
            <TableCell>Комментарий</TableCell>
            <TableCell align="right"></TableCell>

        </TableHead>
    )
}
const Body = (props) => {
    const { rows, makePayment, makePaymentLegal, onEdit } = props;

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    const status = !row.satisfied ? "Новая" : "Завершено";
                    const colorStatus = !row.satisfied ? "#FA7D7D" : "#94D36C";

                    const isOrganization = Boolean(row.organization);
                    const isTask = Boolean(row.task);
                    const isCryptowalletAddress = Boolean(row.cryptowalletAddress);

                    return (

                        <TableRow key={`row-organization-${idx}`}>

                            <TableCell>{ moment(row.timestamp).format('DD.MM.YYYY HH:mm') }</TableCell>
                            <TableCell><Typography style={{color: colorStatus}}>{status}</Typography></TableCell>
                            <TableCell>
                                { isOrganization ? (
                                  <Link target="_blank" href={`/organizations?_id=${ row.organization._id }`}>{ row.organization.name }</Link>
                                ) : (
                                    <Link target="_blank" href={`/users?_id=${ row.user?._id }`}>{ `${ row.user?.lastName } ${ row.user?.firstName }` }</Link>
                                ) }
                            </TableCell>
                            <TableCell>{ isTask ? row.task.name : (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    Ручной вывод

                                    <HelpBadge titleTooltip="Администратор вручную выплатил сумму пользователю // организации"/>
                                </div>
                            ) }</TableCell>
                            <TableCell>{ formatMoney(row.sum, 2, '.') } { currency[row.currency] }</TableCell>
                            <TableCell>{ (isCryptowalletAddress) ? (
                                <Link target="_blank" href={`https://bscscan.com/address/${ row.cryptowalletAddress }`}>
                                    {`${ row.cryptowalletAddress.slice(0, 4) } •••• ${ row.cryptowalletAddress.slice(-4) }`}
                                </Link>
                            ) : (
                                '—'
                            ) }</TableCell>
                            <TableCell><Box maxWidth={150} style={{overflowWrap: 'break-word', lineHeight: '18px'}}>{ row.comment }</Box></TableCell>
                            <TableCell align="right">

                                {

                                    (!row.satisfied) ? (
                                        <Grid container spacing={1} justify="flex-end">
                                            <Grid item>
                                                <Tooltip title="Произвести выплату">
                                                    <IconButton onClick={() => {if (isOrganization || row?.user?.wisewinId) { makePaymentLegal(row) } else { makePayment(row) }}}>
                                                        <CreditCardIcon size={20} color="#8152E4"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip title="Редактировать выплату">
                                                    <IconButton onClick={() => onEdit(row)}>
                                                        <Edit2Icon size={20} color="#8152E4"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        (row.transactionHash) ? (
                                            <Link target="_blank" href={`https://bscscan.com/tx/${ row.transactionHash }`}>
                                                {`${ row.transactionHash.slice(0, 4) } •••• ${ row.transactionHash.slice(-4) }`}
                                            </Link>
                                        ) : (
                                            (isOrganization) ? "Выплата организации" : "Выплата менеджеру Wise Win"
                                        )
                                    )

                                }

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

    status: {},
}));

export default TableOrganization
