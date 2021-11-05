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

    Tooltip
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    GitPullRequest as GitPullRequestIcon,
    Layers as LayersIcon,
    Settings as SettingsIcon,
    Repeat as RepeatIcon,
    Code as CodeIcon,
    CreditCard as CreditCardIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import {HelpBadge} from "../../../../../components";
import couponTypes from "../../../../../constants/couponTypes";

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

const RowEmail = (props) => {
    const {user} = props;

    if (!user) {
        return ''
    }

    return (
        <Tooltip title="Написать пользователю">
            <Link target="_blank" href={`mailto:${user.email}`}>{user.email}</Link>
        </Tooltip>
    )
}
const RowPhone = (props) => {
    const {user} = props;

    if (!user) {
        return ''
    }

    return (
        <Tooltip title="Позвонить пользователю">
            <Link target="_blank" href={`tel:+${user.phone}`}>{user.phone}</Link>
        </Tooltip>
    )
}

const TableHeader = () => {
    return (
        <TableHead>

            <TableCell>Наименование</TableCell>
            <TableCell>ID купона</TableCell>
            <TableCell>Тип купона</TableCell>
            <TableCell>Организация</TableCell>
            <TableCell>Осталось</TableCell>
            <TableCell>Дата начала / дата конца</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Маркетинг</TableCell>
            <TableCell>Кешбек (%)</TableCell>
            <TableCell>1 уровень (%)</TableCell>
            <TableCell>2 - 21 уровень (%)</TableCell>
            <TableCell>Доход (гряз)</TableCell>
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

                        <TableCell align="right">
                            <Grid container spacing={2} wrap="nowrap" justify="flex-end">

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
const Body = (props) => {
    const {rows} = props;

    const handleOpenCouponsOrganization = (row) => {
        window.open(`/coupons?organization=${row.organization}`)
    }
    const handleOpenCouponSales = (row) => {
        window.open(`/purchases?coupon=${ row._id }`)
    }

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    return (

                        <TableRow key={`row-organization-${idx}`}>

                            <TableCell>
                                <Box maxWidth={350}>{row.name}</Box>
                            </TableCell>
                            <TableCell>
                                <Box maxWidth={350}>{row._id}</Box>
                            </TableCell>
                            <TableCell>
                                { couponTypes[row.type] }
                            </TableCell>
                            <TableCell>
                                <Link
                                    target="_blank"
                                    href={`/organizations?_id=${row.organization}`}
                                >{row.organizationName}</Link>
                            </TableCell>
                            <TableCell>{row.quantity} шт</TableCell>
                            <TableCell>
                                <span className="no-wrap">{moment(row.startDate).format('DD.MM.YYYY HH:mm')}</span>
                                <br/>
                                <span className="no-wrap">{moment(row.endDate).format('DD.MM.YYYY HH:mm')}</span>
                            </TableCell>
                            <TableCell>{formatMoney(row.price, 2, '.')} {currency[row.offer.currency]}</TableCell>
                            <TableCell>{formatMoney(row.marketingSum, 2, '.')} {currency[row.offer.currency]}</TableCell>
                            {/*<TableCell>{formatMoney(row.offerSum, 2, '.')} {currency[row.offer.currency]} offerSum</TableCell>*/}
                            <TableCell>{row.offer.percent}%</TableCell>
                            <TableCell>{row.distributionSchema.first}%</TableCell>
                            <TableCell>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {row.distributionSchema.other}%
                                    <HelpBadge titleTooltip={`${row.distributionSchema.other}% на каждый уровень`}/>
                                </div>
                            </TableCell>
                            <TableCell>{formatMoney(row.purchaseSum, 2, '.')} {currency[row.offer.currency]}</TableCell>

                            <TableCell align="right">

                                <Grid container spacing={2} wrap="nowrap" justify="flex-end">

                                    <Grid item>
                                        <Tooltip title="Купоны организации">
                                            <IconButton onClick={() => handleOpenCouponsOrganization(row)}>
                                                <LayersIcon size={20} color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Продажи по купонам">
                                            <IconButton onClick={() => handleOpenCouponSales(row)}>
                                                <CreditCardIcon size={20} color="#8152E4"/>
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
