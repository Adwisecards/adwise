import React, {useState} from "react";
import {
    Box,

    Typography,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    Grid,

    Link,

    Tooltip,
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Code as CodeIcon,
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {TableSortLabel} from "../../../../../components";
import alertNotification from "../../../../../common/alertNotification";
import {copyString} from "../../../../../helper/copyString";

const TableUserSubscriptions = (props) => {
    const {
        rows,
        filter,
        pagination,
        isLoading,
        onOpenSetting,
        onOpenBalanceAdjustment,
        onChangeFilter,
        onChangeDisabled,
        onChangeSignedContract
    } = props;

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
                <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography variant="h5">Всего найдено <span
                            style={{color: '#8152E4'}}>{props.totalCountRows}</span> элементов</Typography>
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

                <Box>

                    <Table>

                        <TableHeader filter={filter} onChangeFilter={onChangeFilter}/>

                        {
                            isLoading && (
                                <BodyLoaders/>
                            )
                        }

                        {
                            !isLoading && (
                                <TableBody>

                                    {
                                        rows.map((row, idx) => (
                                            <RowBody
                                                key={`organization-${row._id}-${idx}`} row={row}
                                                onOpenSetting={onOpenSetting}
                                                onChangeDisabled={onChangeDisabled}
                                                onOpenBalanceAdjustment={onOpenBalanceAdjustment}
                                                onChangeSignedContract={onChangeSignedContract}
                                            />
                                        ))
                                    }

                                </TableBody>
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

const TableHeader = (props) => {
    const {filter, onChangeFilter} = props;

    const headerElements = [
        {
            title: 'Приглашенный',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Приглашающий',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Подписка',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Способ подписки',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Комментарий',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'QR код приглашения',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Дата и время',
            isSorted: false,
            sortedName: '',
        },
    ];

    const handleOnChangeSort = (name) => {
        let newFilter = {...filter};

        const isActive = filter.sortBy === name;

        if (!isActive) {
            newFilter.sortBy = name;
            newFilter.order = 1;
            newFilter.pageNumber = 1;

            onChangeFilter(newFilter, true);

            return null
        }
        if (filter.order === 1) {
            newFilter.sortBy = name;
            newFilter.order = -1;
            newFilter.pageNumber = 1;

            onChangeFilter(newFilter, true);

            return null
        }
        if (filter.order === -1) {
            newFilter.sortBy = name;
            newFilter.order = 1;
            newFilter.pageNumber = 1;

            onChangeFilter(newFilter, true);

            return null
        }
    }

    const order = filter.order === 1 ? 'desc' : 'asc';

    return (
        <TableHead>

            {
                headerElements.map((item, idx) => {
                    if (!item.isSorted) {
                        return (
                            <TableCell>{item.title}</TableCell>
                        )
                    }

                    return (
                        <TableSortLabel
                            sortDirection={filter.sortBy === item.sortedName ? order : false}
                            active={filter.sortBy === item.sortedName}
                            direction={filter.sortBy === item.sortedName ? order : 'desc'}
                            onClick={() => handleOnChangeSort(item.sortedName)}
                            item={item}
                        />
                    )
                })
            }

        </TableHead>
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
                        <TableCell>
                            <Skeleton height={50} width={50}/>
                        </TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>

                    </TableRow>

                ))
            }

        </TableBody>
    )
}

const RowBody = (props) => {
    const {row} = props;

    const classes = useStyles();
    const isChanged = Boolean(row.newParent);

    const handleOnCopyRefLink = () => {
        const ref = row.invitation.ref;
        const urlWeb = process.env.REACT_APP_PRODUCTION_WEB_API;
        const url = `${urlWeb}/organization/${row.invitation.organization}/${ref.code}`;

        copyString(url);

        alertNotification({
            title: "Системное уведомление",
            message: "Ссылка успешно скопирована",
            type: "success"
        })
    }

    const _reasonSubscription = () => {
        const invitationType = row?.invitation?.invitationType || '';

        if (invitationType === 'parent') {
            return "Подписка через наставника"
        }
        if (invitationType === 'following') {
            return "Подписка со страницы пользователя"
        }
        if (invitationType === 'invitation') {
            return "Подписка через приглашение"
        }
        if (invitationType === 'employee') {
            return "Подписка через кассира"
        }

        return "Нет данных"
    }

    return (
        <TableRow>

            <TableCell>
                {
                    (!!row.invitee) && (
                        <Tooltip title="Открыть пользователя">
                            <Link target="_blank"
                                  href={`/users?_id=${row.invitee._id}`}>{row.invitee.firstName || ''} {row.invitee.lastName || ''}</Link>
                        </Tooltip>
                    )
                }
                {
                    isChanged && (
                        <Typography>———</Typography>
                    )
                }
            </TableCell>
            <TableCell>
                {
                    (!!row.inviter) && (
                        <Tooltip title="Открыть пользователя">
                            <Link target="_blank"
                                  href={`/users?_id=${row.inviter._id}`}>{row.inviter.firstName || ''} {row.inviter.lastName || ''}</Link>
                        </Tooltip>
                    )
                }
                {
                    isChanged && (
                        <Typography>———</Typography>
                    )
                }
            </TableCell>
            <TableCell>
                {
                    (!isChanged && !!row.subscription && row.inviter) && (
                        <Typography variant="h6">

                            <Link href={`/users?_id=${row.inviter._id}`}
                                  target="_blank">{row.inviter.firstName} {row.inviter.lastName} </Link>

                            подписал

                            <Link href={`/users?_id=${row.subscription.subscriber._id}`}
                                  target="_blank"> {row.subscription.subscriber.firstName} {row.subscription.subscriber.lastName} </Link>

                            в

                            <Link href={`/organizations?_id=${row.subscription.organization._id}`}
                                  target="_blank"> {row.subscription.organization.name} </Link>

                            на {row.subscription.level} уровень
                        </Typography>
                    )
                }
                {
                    (!isChanged && !!row.subscription && !row.inviter) && (
                        <Typography variant="h6">
                            <Link href={`/users?_id=${row.subscription.subscriber._id}`}
                                  target="_blank">{row.subscription.subscriber.firstName} {row.subscription.subscriber.lastName} </Link>

                            подписался в

                            <Link href={`/organizations?_id=${row.subscription.organization._id}`}
                                  target="_blank"> {row.subscription.organization.name} </Link>

                            на {row.subscription.level} уровень
                        </Typography>
                    )}
                {
                    isChanged && (
                        <Typography variant="h6">
                            Пользователь
                            <Link href={`/users?_id=${row.subscription?.subscriber?._id}`}
                                  target="_blank">{`${row.subscription?.subscriber?.lastName || ''} ${row.subscription?.subscriber?.firstName || ''}`}</Link>,<br/>
                            Смена Родителя&nbsp;
                            {
                                (row.oldParent) ? (
                                    <Link
                                        href={`/users?_id=${row.oldParent?.subscriber?._id}`}
                                        target="_blank"
                                    >
                                        {`${row.oldParent?.subscriber?.lastName || ''} ${row.oldParent?.subscriber?.firstName || ''}`}
                                    </Link>
                                ) : (
                                    <span>С первого уровня</span>
                                )
                            }
                            &nbsp;->&nbsp;
                            <Link href={`/users?_id=${row.newParent?.subscriber?._id}`}
                                  target="_blank">{`${row.newParent?.subscriber?.lastName || ''} ${row.newParent?.subscriber?.firstName || ''}`}</Link>,<br/>
                            Организация
                            <Link href={`/organizations?_id=${row.subscription.organization._id}`}
                                  target="_blank"> {row.subscription.organization.name} </Link>,<br/>
                                  Уровень {row.subscription?.level}
                        </Typography>
                    )
                }
            </TableCell>
            <TableCell width={250}>{_reasonSubscription()}</TableCell>
            <TableCell width={250}>{row.reason}</TableCell>
            <TableCell>
                {
                    (!!row.invitation) && (
                        <div className={classes.qrCode}>
                            <Tooltip title="Скопировать ссылку на приглашение">
                                <img
                                    style={{width: 60, height: 60, cursor: 'pointer'}}
                                    src={row.invitation.ref.QRCode}
                                    onClick={handleOnCopyRefLink}
                                />
                            </Tooltip>
                        </div>
                    )
                }
            </TableCell>
            <TableCell>{moment(row.timestamp).format('DD.MM.YYYY HH:mm')}</TableCell>

        </TableRow>
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

    qrCode: {
        width: 60,
        height: 60
    }
}));

export default TableUserSubscriptions
