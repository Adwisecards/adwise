import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    Box,
    Grid,
    Tooltip,
    IconButton,
    Typography,
} from "@material-ui/core";
import {

} from "@material-ui/lab";
import {
    Edit2 as Edit2Icon,
    X as XIcon
} from "react-feather";
import varibles from "../../../../../constants/varibles";

const TableComponent = (props) => {
    const { rows, onEdit, onDelete } = props;

    return (
        <>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Наименование организации</TableCell>
                        <TableCell>Ссылка на видео</TableCell>
                        <TableCell>Логотип</TableCell>
                        <TableCell align="right">Управление</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rows.map((row) => (
                            <TableRow>
                                <TableCell>
                                    {row._id}
                                </TableCell>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                <TableCell>
                                    {row.presentationUrl}
                                </TableCell>
                                <TableCell>
                                    <img
                                        src={`${varibles["media-url"]}/${row.picture}`}
                                        width={40}
                                        height={40}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid item>
                                            <Tooltip title="Редактировать">
                                                <IconButton onClick={() => onEdit(row)}>
                                                    <Edit2Icon color="#8152E4"/>
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item>
                                            <Tooltip title="Удалить">
                                                <IconButton onClick={() => onDelete(row._id)}>
                                                    <XIcon color="#ED4C5C"/>
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

        </>
    )
}

export default TableComponent
