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
import moment from "moment";

const TableOrganization = (props) => {
    const {
        rows,
        filter,
        pagination,
        isLoading,
        onChangeFilter
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

    const _getTypeRef = (ref) => {
        const {mode, type} = ref;

        if (mode === 'organization' && type === 'invitation') {
            return "Приглашение в организацию от пользователя";
        }
        if (mode === 'organization' && type === 'subscription') {
            return "Вхождение в организацию без приглашения";
        }
        if (mode === 'coupon' && type === 'purchase') {
            return "Вхождение в купон организации без приглашения";
        }
        if (mode === 'contact' && type === 'personal') {
            return "Пользователь подписался на личную визитку пользователя";
        }
        if (mode === 'contact' && type === 'work') {
            return "Пользователь подписался на рабочию визитку пользователя";
        }

        return `Тип не определен: mode=${mode}; type=${type}`
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

            <PerfectScrollbar>

                <Box
                    className={clsx({
                        // [classes.stickyActionsColumn]: true,
                        // [classes.stickyActionsShadow]: !showShadowFixed,
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
                                            return (

                                                <TableRow
                                                    key={`row-organization-${idx}`}
                                                >

                                                    <TableCell width="200">
                                                        {_getTypeRef(row.ref || {})}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            Boolean(row?.organization?.name) ? (
                                                                <Link target="_blank"
                                                                      href={`/organizations?_id=${row?.organization?._id}`}>{row?.organization?.name}</Link>
                                                            ) : "-"
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            Boolean(row?.coupon?.name || row?.coupon) ? (
                                                                <Link target="_blank"
                                                                      href={`/coupons?_id=${row?.coupon?._id || row?.coupon}`}>{row?.coupon?.name || row?.coupon}</Link>
                                                            ) : "-"
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link target="_blank" href={row.ref.QRCode2.split('data=')[1]}>
                                                            <img src={row.ref.QRCode} width="60" height="60"/>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>Родитель: <Link target="_blank" href={`/users?_id=${row?.subscription?.parent}`}>{row?.subscription?.parent}</Link></Box>
                                                        <Box>Организация: <Link target="_blank" href={`/organizations?_id=${row?.subscription?.organization}`}>{row?.subscription?.organization}</Link></Box>
                                                        <Box>Подписчик: <Link target="_blank" href={`/users?_id=${row?.subscription?.subscriber}`}>{row?.subscription?.subscriber}</Link></Box>
                                                        <Box>Уровень: {row?.subscription?.level}</Box>
                                                    </TableCell>
                                                    <TableCell>{moment(row.timestamp).format("DD.MM.YYYY HH:mm:ss")}</TableCell>

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

const TableHeader = (props) => {
    const {filter, onChangeFilter} = props;

    const headerElements = [
        {
            title: 'Тип приглашения',
            isSorted: false,
            sortedName: '',
        },
        {
            title: 'Организация',
            isSorted: false,
            sortedName: 'lastName',
        },
        {
            title: 'Купон',
            isSorted: false,
            sortedName: 'lastName',
        },
        {
            title: 'Приглашение',
            isSorted: false,
            sortedName: 'lastName',
        },
        {
            title: 'Подписка',
            isSorted: false,
            sortedName: 'lastName',
        },
        {
            title: 'Дата и время',
            isSorted: false,
            sortedName: 'lastName',
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
    }
}));

export default TableOrganization
