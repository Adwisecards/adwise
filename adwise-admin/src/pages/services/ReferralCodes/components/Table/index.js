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
    Switch, Collapse, Paper
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
    Code as CodeIcon, ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatCode, formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";
import transactionTypes from "../../../../../constants/transactionTypes";
import originTypes from "../../../../../constants/originTypes";
import referralCodeMode from "../../../../../constants/referralCodeMode";
import referralCodeType from "../../../../../constants/referralCodeType";

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
                <Typography variant="caption">Если обнаружили пустую строчку (когда развернута) просьба обратиться разработчикам</Typography>
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

            <TableCell width={50}></TableCell>
            <TableCell>ID</TableCell>
            <TableCell width={100}>Код</TableCell>
            <TableCell>Mode</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Дата создания</TableCell>

        </TableHead>
    )
}
const Body = (props) => {
    const {rows} = props;
    const classes = useStyles();

    return (
        <TableBody>

            {
                rows.map((row, idx) => (
                    <RowComponent row={row}/>
                ))
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
const RowComponent = (props) => {
    const { row } = props;

    const [isOpen, setOpen] = useState();
    const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
    const referals = row.ref || {};

    return (
        <>
            <TableRow>
                <TableCell width={50}>
                    <IconButton onClick={() => setOpen(!isOpen)}>
                        <Icon color={"#8152E4"}/>
                    </IconButton>
                </TableCell>
                <TableCell width={200}>{row._id}</TableCell>
                <TableCell width={100}>{formatCode(row.code)}</TableCell>
                <TableCell>{referralCodeMode[row.mode] || row.mode}</TableCell>
                <TableCell>{referralCodeType[row.type] || row.type}</TableCell>
                <TableCell>{(row.timestamp) ? moment(row.timestamp).format('DD.MM.YYYY HH:mm:ss') : '-'}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={6}>
                    <Collapse in={isOpen}>
                        <Paper elevation={0}>
                            {
                                Object.keys(referals).map(key => (
                                    <ComponentMessage level={0} messageKey={key} message={referals[key]}/>
                                ))
                            }
                        </Paper>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}
const ComponentMessage = (props) => {
    const {level, message, messageKey} = props;

    return (
        <Typography style={{ marginLeft: level * 8 }}>
            <span style={{fontWeight: '500'}}>{messageKey}:</span>
            {(typeof message === "object") ? (
                Object.keys(message).map(key => (
                    <ComponentMessage level={level+1} messageKey={key} message={message[key]}/>
                ))
            ) : (
                <span>{message || ''}</span>
            )}
        </Typography>
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
