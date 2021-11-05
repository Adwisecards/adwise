import React from "react";
import {
    Box,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    Typography,
    Grid,
    Link, IconButton, Tooltip
} from "@material-ui/core";
import {
    Pagination,
    Skeleton
} from "@material-ui/lab";
import {formatMoney} from "../../../../../helper/format";
import {
    Users as UsersIcon,
    RefreshCw as RefreshCwIcon
} from "react-feather";
import moment from "moment";
import {ExcelIcon} from "../../../../../icons";
import apiUrls from "../../../../../constants/apiUrls";

const Sample = (props) => {
    const { rows, isShow, isLoading, filter, pagination, onChangeFilter, onOpenDialogUsers, onUpdateSample } = props;

    if (!isShow) {
        return null
    }

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;

        onChangeFilter(newFiler, true)
    }

    const handleExport = async (row) => {
        const url = `${process.env.REACT_APP_PRODUCTION_HOST_API}${apiUrls["export-receiver-group"]}/${row._id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                authentication: localStorage.getItem('jwt')
            }
        });
        if (!response) {
            return null
        }
        const data = await response.blob();
        const file = new Blob([data], {
            type: 'xlsx',
        });

        var downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.download = "receiver-group.xlsx";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return (
        <Box>

            <Box>
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

            <Box mb={2} mt={1}>
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell width={300}>Наименование выборки</TableCell>
                            <TableCell>Критерии выборки</TableCell>
                            <TableCell>Пользователи</TableCell>
                            <TableCell align="right">Создание</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            isLoading && (
                                <>
                                    <TableRow>
                                        <TableCell><Skeleton height={30}/></TableCell>
                                        <TableCell><Skeleton height={30}/></TableCell>
                                        <TableCell><Skeleton height={30}/></TableCell>
                                        <TableCell><Skeleton height={30}/></TableCell>
                                        <TableCell><Skeleton height={30}/></TableCell>
                                    </TableRow>
                                </>
                            )
                        }
                        {
                            !isLoading && (
                                <>
                                    {
                                        rows.map((row, idx) => {

                                            return (
                                                <TableRow>
                                                    <TableCell>{ row.name }</TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            dangerouslySetInnerHTML={{ __html: `
                                                        Платформа: ${ row?.parameters?.os || 'Все' };<br/>
                                                        Совершалась ли покупка: ${ row?.parameters?.hasPurchase ? 'Да' : 'Нет' }<br/>
                                                        ` }}
                                                        />
                                                        <Grid container spacing={2} wrap="nowrap" alignItems="center">
                                                            <Grid item>
                                                                <Typography>Организации</Typography>
                                                            </Grid>
                                                            <Grid container spacing={1}>
                                                                {
                                                                    row.parameters.organizations.map((organization) => (
                                                                        <Link target="_blank" href={`/organizations?_id=${organization}`}>{ organization }</Link>
                                                                    ))
                                                                }
                                                                <Grid item></Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Grid container spacing={1} alignItems="center">
                                                            <Grid item>
                                                                <Typography>Кол-во пользователей: { row.receivers.length }</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Tooltip title="Показать пользователей">
                                                                    <IconButton onClick={() => onOpenDialogUsers(row.receivers)}>
                                                                        <UsersIcon color="#8152E4" size={20}/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        { row.timestamp ? (
                                                          moment(row.timestamp).format('DD.MM.YYYY HH:mm')
                                                        ) : (
                                                            <Typography>Дата создания не указана</Typography>
                                                        ) }
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Grid container spacing={1} justify="flex-end">
                                                            <Grid item>
                                                                <Tooltip title="Экспортировать выгрузку пользователей">
                                                                    <IconButton onClick={() => handleExport(row)}>
                                                                        <ExcelIcon/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid item>
                                                                <Tooltip title="Обновить выборку">
                                                                    <IconButton onClick={() => onUpdateSample(row._id)}>
                                                                        <RefreshCwIcon color="rgb(129, 82, 228)"/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </>
                            )
                        }
                    </TableBody>

                </Table>
            </Box>

            <Box>
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

        </Box>
    )
};

export default Sample
