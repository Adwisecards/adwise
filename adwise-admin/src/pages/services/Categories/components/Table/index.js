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
    Trash as TrashIcon
} from "react-feather";

import moment from "moment";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import clsx from "clsx";

const TableOrganization = (props) => {
    const {rows, isLoading, onDelete} = props;

    return (

        <>

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
                            <TableBody>

                                {
                                    rows.map((row, idx) => {
                                        return (

                                            <TableRow key={`row-organization-${idx}`}>

                                                <TableCell>{row.name}</TableCell>

                                                <TableCell align="right">

                                                    <Grid container spacing={2} wrap="nowrap" justify="flex-end">

                                                        <Grid item>
                                                            <Tooltip title="Удалить категорию">
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

                </Table>

            </Box>

        </>

    )
}

const TableHeader = () => {
    return (
        <TableHead>

            <TableCell>Название</TableCell>
            <TableCell></TableCell>

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

                        <TableCell align="right">
                            <Grid container spacing={2} wrap="nowrap">

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
