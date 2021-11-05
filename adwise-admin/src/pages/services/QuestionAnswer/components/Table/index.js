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
    Trash as TrashIcon,
    Edit2 as Edit2Icon
} from "react-feather";

const platforms = {
    crm: "CRM",
    cards: "AdWise Cards",
    business: "AdWise Business",
}

const TableOrganization = (props) => {
    const {rows, filter, pagination, isLoading, onChangeFilter, onDelete, onEdit} = props;

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
                    <TableHead>
                        <TableRow>
                            <TableCell>Платформа</TableCell>
                            <TableCell>Категория</TableCell>
                            <TableCell>Вопрос</TableCell>
                            <TableCell>Ответ</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            isLoading && (
                                <TableRow>
                                    <TableCell><Skeleton height={30}/></TableCell>
                                    <TableCell><Skeleton height={30}/></TableCell>
                                    <TableCell><Skeleton height={30}/></TableCell>
                                    <TableCell><Skeleton height={30}/></TableCell>
                                    <TableCell><Skeleton height={30}/></TableCell>
                                </TableRow>
                            )
                        }
                        {
                            rows.map((row, idx) => {

                                return (
                                    <TableRow>
                                        <TableCell>{ platforms[row.type] }</TableCell>
                                        <TableCell>{ row.category?.name || '' }</TableCell>
                                        <TableCell><Typography variant="body1" dangerouslySetInnerHTML={{__html: row.question}}/></TableCell>
                                        <TableCell>
                                            <Box maxWidth={600}>
                                                <Typography variant="body1" dangerouslySetInnerHTML={{__html: row.answer}}/>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Grid container spacing={1} wrap="nowrap" justify="flex-end">
                                                <Grid item>
                                                    <Tooltip title="Редактировать">
                                                        <IconButton onClick={() => onEdit(row)}>
                                                            <Edit2Icon color="#8152E4"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item>
                                                    <Tooltip title="Удалить">
                                                        <IconButton onClick={() => onDelete(row)}>
                                                            <TrashIcon color="#ED1C24"/>
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

export default TableOrganization
