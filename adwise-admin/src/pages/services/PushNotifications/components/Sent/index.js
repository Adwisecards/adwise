import React from "react";
import {
    Box,
    Grid,
    Tooltip,
    IconButton,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell, Typography,
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    Users as UsersIcon
} from "react-feather";

import moment from "moment";
import {formatMoney} from "../../../../../helper/format";

const Sent = (props) => {
    const {rows, isShow, isLoading, filter, pagination, onChangeFilter, onOpenDialogUsers} = props;

    if (!isShow) {
        return null
    }

    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};

        newFiler.pageNumber = page;

        onChangeFilter(newFiler, true)
    }

    return (
        <>

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
                         <TableCell width={300}>Дата отправки</TableCell>
                         <TableCell>Заголовок</TableCell>
                         <TableCell>Сообщение</TableCell>
                         <TableCell width={200} align="right">Всего пользователей</TableCell>
                         <TableCell width={200} align="right">Успешно отправленные</TableCell>
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
                                             <TableRow key={`push-notification-${ idx }`}>
                                                 <TableCell width={300}>{moment(row.timestamp).format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                                                 <TableCell width={350}>{ row.title }</TableCell>
                                                 <TableCell width={500}>{ row.body }</TableCell>
                                                 <TableCell align="right" className="no-wrap">-----------</TableCell>
                                                 <TableCell align="right" className="no-wrap">
                                                     <Grid container spacing={1} alignItems="center" justify="flex-end">
                                                         <Grid item>
                                                             { row.receivers.length }
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

        </>
    )
};

export default Sent
