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
    Trash as TrashIcon,
    Edit2 as Edit2Icon
} from "react-feather";
import {getUrlMedia} from "../../../../../common/media";

const types = {
    "crm": "CRM/WEB",
    "cards": "AdWise Cards",
    "business": "AdWise Business",
};

const TableOrganization = (props) => {
    const {rows, isLoading, onDelete, onEdit} = props;

    const classes = useStyles();

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
                            <Body rows={rows} onDelete={onDelete} onEdit={onEdit}/>
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

            <TableCell>Платформа</TableCell>
            <TableCell>Наименование</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Ссылка</TableCell>
            <TableCell align="right"></TableCell>

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

                    </TableRow>

                ))
            }

        </TableBody>
    )
}
const Body = (props) => {
    const { rows, onDelete, onEdit } = props;

    return (
        <TableBody>

            {
                rows.map((row, idx) => {
                    return (

                        <TableRow key={`row-organization-${idx}`}>

                            <TableCell>{types[row.type]}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>
                                <Link href={getUrlMedia(row.file)} target="_blank">Открыть документ</Link>
                            </TableCell>
                            <TableCell align="right">
                                <Grid container spacing={1} justify="flex-end">
                                    <Grid item>
                                        <Tooltip title="Редактировать документ">
                                            <IconButton onClick={() => onEdit(row)}>
                                                <Edit2Icon color="#8152E4"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Удалить документ">
                                            <IconButton onClick={() => onDelete(row)}>
                                                <TrashIcon color="#D8004E"/>
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
    },

    wiseDefault: {
        width: 30,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 999,

        backgroundColor: '#94D36C',
    }
}));

export default TableOrganization
