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

    IconButton,

    Link,

    Tooltip
} from "@material-ui/core";
import {
    HowToReg as HowToRegIcon,
    PersonAdd as PersonAddIcon
} from "@material-ui/icons";
import {
    Skeleton,
    SpeedDial,
    Pagination,
    SpeedDialAction
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Repeat as RepeatIcon,
    Code as CodeIcon,
    DollarSign as DollarSignIcon,
    Cpu as CpuIcon,
    Layers as LayersIcon,
    GitPullRequest as GitPullRequestIcon,
    MoreVertical as MoreVerticalIcon,
    Key as KeyIcon,
    Users as UsersIcon
} from "react-feather";
import {
    TableSortLabel
} from "../../../../../components";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import alertNotification from "../../../../../common/alertNotification";
import userRole from "../../../../../constants/userRole";
import {useHistory} from "react-router";

const TableOrganization = (props) => {
    const {
        rows,
        filter,
        pagination,
        isLoading,
        onChangeFilter,
        onOpenBalanceAdjustment,
        onSetUserAdmin,
        onSetUserGuest,
        onUserChangePassword,
        onChangeParent
    } = props;

    const [isOpenSpeedDial, setOpenSpeedDial] = useState("");
    const [showShadowFixed, setShowShadowFixed] = useState(true);

    const classes = useStyles();
    const history = useHistory();

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;

        onChangeFilter(newFiler, true)
    }
    const handleGoTransaction = (row) => {
        window.open(`/transactions?to=${row.wallet._id}`)
    }
    const handleGoOrganization = (row) => {
        window.open(`/organizations?_id=${row.organization._id}`)
    }
    const handleOpenAppUser = async (row) => {
        const token = await axiosInstance.get(`${apiUrls["get-user-jwt"]}/${row._id}`).then((response) => {
            return response.data.data.jwt
        });
        alertNotification({
            title: "Системное уведомление",
            message: "Токен отправлен в косоль разработчика.",
            type: "info"
        })
        console.log('Токен мобильного приложения: ', token)
    }
    const handleGoPurchaseUser = (row) => {
        window.open(`/purchases?user=${row._id}`)
    }
    const handleOpenCardsUser = (row) => {
        window.open(`/contacts?ref=${row._id}`);
    }
    const handleOpenReferralTree = (row) => {
        const url = `/users/referral-tree/${row._id}`;
        window.open(url);
    }
    const handleUserChangePassword = async (row) => {
        const token = await axiosInstance.get(`${apiUrls["get-user-jwt"]}/${row._id}`).then((response) => {
            return response.data.data.jwt
        });
        onUserChangePassword(row, token);
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
                        <Typography variant="h5">Всего найдено <span
                            style={{color: '#8152E4'}}>{formatMoney(props.totalCountRows, 0)}</span> элементов</Typography>
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
            <Box mb={1}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Grid container spacing={1}>
                            <Grid item><Box width={20} height={20} borderRadius={999}
                                            bgcolor="rgba(129, 82, 228, 0.1)"/></Grid>
                            <Grid item><Typography variant="h6">Админ</Typography></Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1}>
                            <Grid item><Box width={20} height={20} borderRadius={999} bgcolor="rgba(237, 142, 0, 0.1)"/></Grid>
                            <Grid item><Typography variant="h6">Гость</Typography></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <PerfectScrollbar
                onScrollX={() => setShowShadowFixed(true)}
                onXReachEnd={() => setShowShadowFixed(false)}
            >

                <Box
                    minWidth={3500}
                    className={clsx({
                        [classes.stickyActionsColumn]: true,
                        [classes.stickyActionsShadow]: !showShadowFixed,
                    })}
                >

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
                                        rows.map((row, idx) => {
                                            const isApp = Boolean(!!row.phone && !row.email);
                                            const isAdmin = Boolean(row.admin);
                                            const isGuest = Boolean(row.adminGuest);
                                            let userContactWork = {};
                                            userContactWork = row.contacts.find((item) => {
                                                if (item.type === 'work') {
                                                    return item;
                                                }
                                            }) || {};

                                            return (

                                                <TableRow
                                                    key={`row-organization-${idx}`}
                                                    style={{backgroundColor: isAdmin ? 'rgba(129, 82, 228, 0.1)' : isGuest ? 'rgba(237, 142, 0, 0.1)' : ''}}
                                                >

                                                    <TableCell>{row.lastName || '—'}</TableCell>
                                                    <TableCell>{row.firstName || '—'}</TableCell>
                                                    <TableCell>
                                                        {(isApp) ? (
                                                            <Typography>Приложение</Typography>
                                                        ) : (
                                                            <Grid container wrap="nowrap" direction="column">
                                                                <Grid item>
                                                                    <Typography>CRM</Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Tooltip title="Роль пользователя CRM">
                                                                        <Typography className="no-wrap"
                                                                                    variant="caption"
                                                                                    color="primary">{userRole[row.role] || userRole[""]}</Typography>
                                                                    </Tooltip>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{
                                                        Boolean(!isApp && row.parent) ? (
                                                            <Link href={`/users?_id=${row.parent._id}`} target="_blank"
                                                                  color="primary">{row.parent.firstName} {row.parent.lastName}</Link>
                                                        ) : "—"
                                                    }</TableCell>
                                                    <TableCell>{
                                                        Boolean(isApp && row.parent) ? (
                                                            <Link href={`/users?_id=${row.parent._id}`} target="_blank"
                                                                  color="primary">{row.parent.firstName} {row.parent.lastName}</Link>
                                                        ) : "—"
                                                    }</TableCell>
                                                    <TableCell>{row.wisewinId || '—'}</TableCell>
                                                    <TableCell>
                                                        {
                                                            row.wisewinId ? (
                                                                <Typography className="no-wrap" variant="formTitle">Свободно: {row?.wisewinInfo?.remainingStartPackets}шт</Typography>
                                                            ) : '—'
                                                        }
                                                    </TableCell>
                                                    <TableCell className="no-wrap">{formatMoney(row.wallet.points, 2, '.')} {currency[row.wallet.currency]}</TableCell>
                                                    <TableCell className="no-wrap">{formatMoney(row.wallet.bonusPoints, 2, '.')} {currency[row.wallet.currency]}</TableCell>
                                                    <TableCell className="no-wrap">{formatMoney(row.wallet.cashbackPoints, 2, '.')} {currency[row.wallet.currency]}</TableCell>
                                                    <TableCell className="no-wrap">{formatMoney(row.wallet.frozenPointsSum, 2, '.')} {currency[row.wallet.currency]}</TableCell>
                                                    <TableCell className="no-wrap">{formatMoney(row?.stats?.usedPointsSum || 0)} {currency[row.wallet.currency]}</TableCell>
                                                    <TableCell className="no-wrap">{formatMoney(row?.stats?.withdrawalSum || 0)} {currency[row.wallet.currency]}</TableCell>
                                                    <TableCell className="no-wrap">{formatMoney(row?.stats?.bonusSum || 0)} {currency[row.wallet.currency]}</TableCell>
                                                    <TableCell>{!!row.wisewinInfo ? formatMoney(row.wisewinInfo.remainingPackets, 0, '') : '—'}</TableCell>
                                                    <TableCell>{!!row.wisewinInfo ? row.wisewinInfo.packet : '—'}</TableCell>
                                                    <TableCell>{row.ref.code}</TableCell>
                                                    <TableCell>{row._id}</TableCell>
                                                    <TableCell>{row.paymentCardId || '—'}</TableCell>
                                                    <TableCell>{row.wallet._id}</TableCell>
                                                    <TableCell><RowEmail user={row}/></TableCell>
                                                    <TableCell><RowPhone user={row}/></TableCell>
                                                    <TableCell>
                                                        {(row.organization) ? (
                                                            <>

                                                                <Tooltip title="Перейти на веб версию организации">
                                                                    <Link target="_blank"
                                                                          href={`${process.env.REACT_APP_PRODUCTION_WEB_API}/organization/${row.organization._id}`}>Перейти</Link>
                                                                </Tooltip>

                                                            </>
                                                        ) : '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            Boolean(Object.keys(userContactWork).length > 0) ? (
                                                                <span>{userContactWork?.organization?.name}</span>
                                                            ) : '—'
                                                        }
                                                    </TableCell>
                                                    <TableCell>{row.admin ? 'Администратор' : row.adminGuest ? 'Гость' : 'Пользователь'}</TableCell>
                                                    <TableCell></TableCell>

                                                    <TableCell align="right">

                                                        <Grid container spacing={2} wrap="nowrap">

                                                            <Grid item>
                                                                <Tooltip
                                                                    title={row.adminGuest ? "Уволить пользователя с должности гостя" : "Назначить пользователя на должность гостя"}>
                                                                    <IconButton
                                                                        onClick={() => onSetUserGuest(row)}
                                                                    >
                                                                        <PersonAddIcon
                                                                            style={{color: "#8152E4"}}
                                                                        />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid item>
                                                                <Tooltip
                                                                    title={row.admin ? "Уволить пользователя с должности админестратора" : "Назначить пользователя на должность админестратора"}>
                                                                    <IconButton
                                                                        onClick={() => onSetUserAdmin(row)}
                                                                    >
                                                                        <HowToRegIcon style={{color: "#8152E4"}}/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid item>
                                                                <SpeedDial
                                                                    ariaLabel="Органы управления"
                                                                    direction="left"

                                                                    icon={<MoreVerticalIcon/>}
                                                                    open={isOpenSpeedDial === row._id}
                                                                    onClose={() => setOpenSpeedDial("")}
                                                                    onOpen={() => setOpenSpeedDial(row._id)}
                                                                >

                                                                    <SpeedDialAction
                                                                        icon={<CpuIcon size={20} color="#8152E4"/>}
                                                                        tooltipTitle="Получить токен пользователя ( CRM / APP )"
                                                                        onClick={() => handleOpenAppUser(row)}
                                                                    />

                                                                    <SpeedDialAction
                                                                        icon={<DollarSignIcon size={20}
                                                                                              color="#8152E4"/>}
                                                                        tooltipTitle="Корректировка баланса"
                                                                        onClick={() => onOpenBalanceAdjustment(row)}
                                                                    />

                                                                    <SpeedDialAction
                                                                        icon={<RepeatIcon size={20} color="#8152E4"/>}
                                                                        tooltipTitle="Покупки пользователя"
                                                                        onClick={() => handleGoPurchaseUser(row)}
                                                                    />

                                                                    <SpeedDialAction
                                                                        icon={<LayersIcon size={20} color="#8152E4"/>}
                                                                        tooltipTitle="Визитки пользователя"
                                                                        onClick={() => handleOpenCardsUser(row)}
                                                                    />

                                                                    <SpeedDialAction
                                                                        icon={<GitPullRequestIcon size={20}
                                                                                                  color="#8152E4"/>}
                                                                        tooltipTitle="Реферальное дерево пользователя"
                                                                        onClick={() => handleOpenReferralTree(row)}
                                                                    />

                                                                    <SpeedDialAction
                                                                        icon={<KeyIcon size={20}
                                                                                                  color="#8152E4"/>}
                                                                        tooltipTitle="Изменить пароль пользователя"
                                                                        onClick={() => handleUserChangePassword(row)}
                                                                    />

                                                                    {
                                                                        Boolean(!row.wallet) && (
                                                                            <SpeedDialAction
                                                                                icon={<CpuIcon size={20}
                                                                                               color="#8152E4"/>}
                                                                                tooltipTitle="Транзакции пользователя"
                                                                                onClick={() => handleGoTransaction(row)}
                                                                            />
                                                                        )
                                                                    }

                                                                    {
                                                                        Boolean(!!row.organization) && (
                                                                            <SpeedDialAction
                                                                                icon={<RepeatIcon size={20}
                                                                                                  color="#8152E4"/>}
                                                                                tooltipTitle="Открыть организацию"
                                                                                onClick={() => handleGoOrganization(row)}
                                                                            />
                                                                        )
                                                                    }

                                                                    {
                                                                        Boolean(isApp) && (
                                                                            <SpeedDialAction
                                                                                icon={<UsersIcon size={20} color="#8152E4"/>}
                                                                                tooltipTitle="Изменить родителя"
                                                                                onClick={() => onChangeParent(row)}
                                                                            />
                                                                        )
                                                                    }

                                                                </SpeedDial>
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

const RowEmail = (props) => {
    const {user} = props;

    if (!user || !user.email) {
        return (<span>—</span>)
    }

    return (
        <Tooltip title="Написать пользователю">
            <Link target="_blank" href={`mailto:${user.email}`}>{user.email}</Link>
        </Tooltip>
    )
}
const RowPhone = (props) => {
    const {user} = props;

    if (!user || !user.phone) {
        return (<span>—</span>)
    }

    return (
        <Tooltip title="Позвонить пользователю">
            <Link target="_blank" href={`tel:+${user.phone}`}>{user.phone}</Link>
        </Tooltip>
    )
}

const TableHeader = (props) => {
    const {filter, onChangeFilter} = props;

    const headerElements = [
        {
            title: 'Фамилия',
            isSorted: true,
            sortedName: 'lastName',
        },
        {
            title: 'Имя',
            isSorted: true,
            sortedName: 'firstName',
        },
        {
            title: 'Источник',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Куратор CRM',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Куратор APP',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Wise Win ID',
            isSorted: true,
            sortedName: 'wisewinId',
        },
        {
            title: 'Wise Win Пакеты',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Баланс',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Баланс бонусов',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Баланс кэшбэк',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'К зачислению',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Суммарная оплата баллами',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Суммарная сумма вывода баллов пользователя',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Общая суммы получения вознаграждений за все время',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Кол-во свободных лицензий',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Тариф Wise Win',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Код пользователя',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'ID пользователя',
            isSorted: true,
            sortedName: '_id',
        },
        {
            title: 'ID банковской карты',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'ID кошелька',
            isSorted: true,
            sortedName: '_id',
        },
        {
            title: 'Email',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Телефон',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Организация',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Кассир в организации',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Тип учетной записи',
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

            <TableCell align="right">
                <div style={{backgroundColor: 'white'}}/>
            </TableCell>
            <TableCell align="right">
                <div style={{backgroundColor: 'white'}}/>
            </TableCell>

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
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>

                        <TableCell align="right">
                            <Grid container spacing={2} wrap="nowrap">

                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>
                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>

                            </Grid>
                        </TableCell>

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
    }
}));

export default TableOrganization
