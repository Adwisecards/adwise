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
    Code as CodeIcon,
    Trash as TrashIcon,
    Edit2 as Edit2Icon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from "clsx";
import changeHistoryTypes from "../../../../../constants/changeHistoryTypes";

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter, onDeleteVersion, onEditVersion} = props;

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
                                <Body rows={rows} onDelete={onDeleteVersion} onEdit={onEditVersion}/>
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

            <TableCell>Система</TableCell>
            <TableCell>Версия</TableCell>
            <TableCell>Заголовок</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Сообщение</TableCell>
            <TableCell></TableCell>

        </TableHead>
    )
}

const Body = (props) => {
    const {rows, onDelete, onEdit} = props;
    const classes = useStyles();


    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    return (

                        <TableRow key={`row-organization-${idx}`}>
                            <TableCell className="no-wrap">{changeHistoryTypes[row.type]}</TableCell>
                            <TableCell className="no-wrap">{row.version}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell className="no-wrap">{moment(row.date).format('DD.MM.YYYY')}</TableCell>
                            <TableCell width={450}>
                                <Tooltip
                                    title={
                                        <React.Fragment>
                                            <Typography className={classes.messagePopup} color="inherit" dangerouslySetInnerHTML={{__html: row.comment}}/>
                                        </React.Fragment>
                                    }
                                    placement="bottom-start"
                                >
                                    <Typography
                                        className={classes.message}
                                        dangerouslySetInnerHTML={{__html: row.comment}}
                                    />
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                <Grid container spacing={1} justify="flex-end">
                                    <Grid item>
                                        <Tooltip title="Редактировать">
                                            <IconButton onClick={() => onEdit(row)}>
                                                <Edit2Icon size={20} color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Удалить">
                                            <IconButton onClick={() => onDelete(row)}>
                                                <TrashIcon size={20} color="#8152E4"/>
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

    message: {
        maxHeight: 53,
        overflow: 'hidden',

        '& > p': {
            marginTop: 0,
            marginBottom: 0,
        }
    },
    messagePopup: {
        '& > p': {
            marginTop: 4,
            marginBottom: 4,
        }
    },
}));

export default TableOrganization
