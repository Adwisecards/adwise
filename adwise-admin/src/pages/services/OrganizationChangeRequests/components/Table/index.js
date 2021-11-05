import React, {useState, useEffect} from "react";
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

    Tooltip,
    Collapse
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
    XCircle as XCircleIcon,
    ChevronUp as ChevronUpIcon,
    ChevronDown as ChevronDownIcon,
    CheckCircle as CheckCircleIcon
} from "react-feather";
import {formatMoney} from "../../../../../helper/format";

import formsIndividual from "../../../../../legalForms/forms/individual";
import formsIp from "../../../../../legalForms/forms/ip";
import formsOoo from "../../../../../legalForms/forms/ooo";
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from "clsx";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import moment from "moment";

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter, onAllowChange, onDisableChange} = props;

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
                                <Body
                                    rows={rows}
                                    onAllowChange={onAllowChange}
                                    onDisableChange={onDisableChange}
                                />
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

            <TableCell></TableCell>
            <TableCell>Организация</TableCell>
            <TableCell>Легальная форма</TableCell>
            <TableCell>Подтвержден</TableCell>
            <TableCell>Причина изменения</TableCell>
            <TableCell>Причина отказа</TableCell>
            <TableCell>Дата / время заявки</TableCell>
            <TableCell></TableCell>

        </TableHead>
    )
}

const Body = (props) => {
    const {rows, onAllowChange, onDisableChange} = props;
    const classes = useStyles();


    return (
        <TableBody>
            {
                rows.map((row, idx) => {
                    return (
                        <BodyRow {...row} onAllowChange={onAllowChange} onDisableChange={onDisableChange}/>
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
const BodyRow = (row) => {
    const [isOpen, setOpen] = useState(false);
    const classes = useStyles();

    const objectFormCurrent = Boolean(row?.legal?.form) ? (row.legal.form === 'ooo') ? formsOoo : (row.legal.form === 'ip') ? formsIp : formsIndividual : null;
    const objectFormOld = Boolean(row?.previousLegal?.form) ? (row.previousLegal.form === 'ooo') ? formsOoo : (row.previousLegal.form === 'ip') ? formsIp : formsIndividual : null;

    const [organization, setOrganization] = useState({});

    useEffect(() => {
        ( async () => {
            await handleOnLoadOrganization();
        })();
    }, []);

    const handleOpen = () => {
        setOpen(!isOpen);
    };
    const handleOnLoadOrganization = async () => {
        const organization = await axiosInstance.get(`${apiUrls["get-organization"]}/${row.organization}`).then((res) => {
            return res.data.data.organization
        });

        setOrganization(organization);
    }

    return (
        <>

            <TableRow>
                <TableCell width={40}>
                    <Tooltip title={isOpen ? 'Свернуть' : 'Развернуть'}>
                        <IconButton onClick={handleOpen}>
                            {isOpen ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                        </IconButton>
                    </Tooltip>
                </TableCell>
                <TableCell>{organization.name}</TableCell>
                <TableCell>{`${row?.legal?.form} ⇐ ${row?.legal?.form}`}</TableCell>
                <TableCell>
                    <Tooltip title={row.satisfied ? "Разрешенно" : row.rejected ? "Отказ" : "Ожидает принятия решения"}>
                        <Box className={clsx({
                            [classes.status]: true,
                            [classes.statusSuccess]: row.satisfied,
                            [classes.statusExpects]: !row.satisfied && !row.rejected,
                            [classes.statusError]: row.rejected,
                        })}/>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    {
                        row?.comment || '—'
                    }
                </TableCell>
                <TableCell>
                    {
                        row?.rejectionReason || '—'
                    }
                </TableCell>
                <TableCell>
                    {
                        moment(row.timestamp).format('DD.MM.YYYY HH:mm:ss')
                    }
                </TableCell>
                <TableCell align="right">
                    <Grid container spacing={1} justify="flex-end">
                        <Grid item>
                            <Tooltip title="Подтвердить изменения организации">
                                <IconButton disabled={row.satisfied || row.rejected} onClick={() => row.onAllowChange(row._id)}>
                                    <CheckCircleIcon size={20} color={ row.satisfied || row.rejected ? "#999DB1" : "#8152E4" }/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Запретить изменения организации">
                                <IconButton disabled={row.satisfied || row.rejected} onClick={() => row.onDisableChange(row._id)}>
                                    <XCircleIcon size={20} color={ row.satisfied || row.rejected ? "#999DB1" : "#DB4368" }/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </TableCell>
            </TableRow>

            <TableCell colSpan={6}>
                <Collapse in={isOpen}>
                    <Box bgcolor="white" py={2} style={{ borderRadius: '0 0 10px 10px', marginBottom: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box mb={3}>
                                    <Box mb={2}><Typography variant="subtitle2">Новые данные</Typography></Box>

                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemNew]: row?.name !== organization?.name,
                                    })}>
                                        <Typography variant="caption">Наименование организации</Typography>
                                        <Typography variant="body1">{row.name}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemNew]: row?.category?.name !== organization?.category?.name,
                                    })}>
                                        <Typography variant="caption">Категория</Typography>
                                        <Typography variant="body1">{row?.category?.name}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemNew]: row?.address?.address !== organization?.address?.address,
                                    })}>
                                        <Typography variant="caption">Адресс</Typography>
                                        <Typography variant="body1">{row.address?.placeId}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemNew]: (organization?.phones || []).join(', ') !== (row?.phones || []).join(', '),
                                    })}>
                                        <Typography variant="caption">Телефоны</Typography>
                                        <Typography variant="body1">{(row?.phones || []).join(', ')}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemNew]: (organization?.emails || []).join(', ') !== (row?.emails || []).join(', '),
                                    })}>
                                        <Typography variant="caption">Emails</Typography>
                                        <Typography variant="body1">{(row?.emails || []).join(', ')}</Typography>
                                    </Box>

                                </Box>

                                {
                                    Boolean(objectFormCurrent && row.legal) && (
                                        <Box>
                                            <Box mb={2}><Typography variant="subtitle2">Новые реквизиты</Typography></Box>
                                            {Object.keys(objectFormCurrent).map((key) => {
                                                const item = objectFormCurrent[key];

                                                return (
                                                    <Box mb={2}>
                                                        <Typography variant="subtitle1">{item.tab.label}</Typography>

                                                        {
                                                            item.sections.map((section) => (
                                                                <>
                                                                    {section.items.map(item => (
                                                                        <Box
                                                                            mb={1}
                                                                            className={clsx({
                                                                                [classes.legalItem]: true,
                                                                                [classes.legalItemNew]: row?.legal?.info?.[item.name] !== row?.previousLegal?.info?.[item.name],
                                                                            })}
                                                                        >
                                                                            <Typography variant="caption">{item.title}</Typography>
                                                                            <Typography variant="body1">{row.legal.info[item.name]}</Typography>
                                                                        </Box>
                                                                    ))}
                                                                </>
                                                            ))
                                                        }
                                                    </Box>
                                                )
                                            })}
                                        </Box>
                                    )
                                }
                            </Grid>

                            <Grid item xs={6}>
                                <Box mb={3}>
                                    <Box mb={2}><Typography variant="subtitle2">Старые данные</Typography></Box>

                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemOld]: row?.name !== organization?.name,
                                    })}>
                                        <Typography variant="caption">Наименование организации</Typography>
                                        <Typography variant="body1">{organization.name}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemOld]: row?.category?.name !== organization?.category?.name,
                                    })}>
                                        <Typography variant="caption">Категория</Typography>
                                        <Typography variant="body1">{organization?.category?.name}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemOld]: row?.address?.address !== organization?.address?.address,
                                    })}>
                                        <Typography variant="caption">Адресс</Typography>
                                        <Typography variant="body1">{organization.address?.placeId}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemOld]: (organization?.phones || []).join(', ') !== (row?.phones || []).join(', '),
                                    })}>
                                        <Typography variant="caption">Телефоны</Typography>
                                        <Typography variant="body1">{(organization?.phones || []).join(', ')}</Typography>
                                    </Box>
                                    <Box mb={1} className={clsx({
                                        [classes.legalItem]: true,
                                        [classes.legalItemOld]: (organization?.emails || []).join(', ') !== (row?.emails || []).join(', '),
                                    })}>
                                        <Typography variant="caption">Emails</Typography>
                                        <Typography variant="body1">{(organization?.emails || []).join(', ')}</Typography>
                                    </Box>
                                </Box>

                                {
                                    Boolean(objectFormOld) && (
                                        <Box>
                                            <Box mb={2}><Typography variant="subtitle2">Старые реквизиты</Typography></Box>
                                            {Object.keys(objectFormOld).map((key) => {
                                                const item = objectFormOld[key];

                                                return (
                                                    <Box mb={2}>
                                                        <Typography variant="subtitle1">{item.tab.label}</Typography>

                                                        {
                                                            item.sections.map((section) => (
                                                                <>
                                                                    {section.items.map(item => (
                                                                        <Box
                                                                            mb={1}
                                                                            className={clsx({
                                                                                [classes.legalItem]: true,
                                                                                [classes.legalItemOld]: row.legal.info[item.name] !== row.previousLegal.info[item.name],
                                                                            })}
                                                                        >
                                                                            <Typography variant="caption">{item.title}</Typography>
                                                                            <Typography variant="body1">{row.previousLegal.info[item.name]}</Typography>
                                                                        </Box>
                                                                    ))}
                                                                </>
                                                            ))
                                                        }
                                                    </Box>
                                                )
                                            })}
                                        </Box>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>
            </TableCell>

        </>
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
        width: 30,
        height: 30,

        borderRadius: 999,

        borderWidth: 1,
        borderStyles: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    statusError: {
        backgroundColor: '#FA7D7D'
    },
    statusExpects: {
        backgroundColor: '#CBCCD4'
    },
    statusSuccess: {
        backgroundColor: '#94D36C'
    },

    legalItem: {
        borderRadius: 4,
        padding: 4
    },
    legalItemNew: {
        backgroundColor: '#94d36c29'
    },
    legalItemOld: {
        backgroundColor: '#fff2f2'
    }
}));

export default TableOrganization
