import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    Box,
    Grid,
    Typography,
    Button,
    Link,
} from "@material-ui/core";
import {
    Pagination,
    Skeleton
} from "@material-ui/lab";

const TableLogging = (props) => {
    const {
        rows,
        filter,
        pagination,
        isLoading,
        onChangeFilter
    } = props;

    const handleChangePage = () => {}

    return (
        <>

            <Box>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            count={pagination.countPages}

                            onChange={handleChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mt={1} mb={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Событие</TableCell>
                            <TableCell>Платформа</TableCell>
                            <TableCell>Система</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Пользователь</TableCell>
                            <TableCell>Дата создания</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            isLoading && (
                                <TableRow>
                                    <TableCell><Skeleton height={30} /></TableCell>
                                    <TableCell><Skeleton height={30} /></TableCell>
                                    <TableCell><Skeleton height={30} /></TableCell>
                                    <TableCell><Skeleton height={30} /></TableCell>
                                    <TableCell><Skeleton height={30} /></TableCell>
                                    <TableCell><Skeleton height={30} /></TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </Box>

            <Box>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            count={pagination.countPages}

                            onChange={handleChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

export default TableLogging
