import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Radio,
    Dialog,
    Avatar,
    Button,
    TextField,
    Typography,
    DialogContent,


    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@material-ui/core";
import {
    Skeleton,
    Pagination
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {getPageFromCount} from "../../../../../common/pagination";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialFilter = {
    limit: 10,
    page: 1,
    fullName: '',
};

let timeoutSearch;

const UsersDialogs = (props) => {
    const { open, onClose, onChange, selected, organizationId } = props;
    const classes = useStyles();

    const [filter, setFilter] = useState({...initialFilter});
    const [isLoading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({count: 1});
    const [clients, setClients] = useState([]);

    useEffect(() => {
        setFilter({...initialFilter});
        setPagination({count: 1});

        ( async () => {
            await handleGetClients();
        })();

    }, [open]);
    useEffect(() => {
        ( async () => {
            await handleGetClients();
        })();
    }, [filter]);


    // Получение пользователя
    const handleGetClients = async () => {

        setLoading(true);

        const filter = _getFilter();
        const { clients, count } = await axiosInstance.get(`${ urls["get-clients"] }${ organizationId }${ filter }`).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                clients: []
            }
        });

        setClients(clients);
        setPagination({ count: getPageFromCount(count, filter.limit || 10) });
        setLoading(false);
    }
    const _getFilter = () => {
        let string = [];

        Object.keys(filter).map((key) => {
           const value = filter[key];

           if (!!value) {
               string.push(`${key}=${value}`)
           }
        });

        return `?${ string.join('&') }`
    }

    // Изменение фильтра
    const handleOnChangeFilter = ({ target }) => {
        const { name, value } = target;
        let newFilter = {...filter};
        newFilter[name] = value;
        setFilter(newFilter);
    }

    // Выбор пользоваетеля
    const handleOnChange = (user) => {
        let newSelected = [...selected];
        let index = newSelected.findIndex((t) => t._id === user._id);

        if (index > -1) {
            newSelected.splice(index, 1);
        } else {
            newSelected.push(user);
        }

        onChange(newSelected);
    }

    return (
        <Dialog
            open={open}
            maxWidth="lg"
            fullWidth
            scroll="body"
            onClose={onClose}
        >

            <DialogContent style={{ padding: 0 }}>

                <Box py={4} px={6}>

                    <Box mb={6}>

                        <Grid container spacing={4} alignItems="center">
                            <Grid item>
                                <Typography variant="modalTitle">{allTranslations(localization['bill_create.usersDialogs.title'])}</Typography>
                            </Grid>
                            <Grid item>
                                <TextField
                                    value={filter.fullName}
                                    name="fullName"
                                    placeholder={allTranslations(localization['bill_create.usersDialogs.searchPlaceholder'])}
                                    variant="outlined"
                                    onChange={handleOnChangeFilter}
                                />
                            </Grid>
                        </Grid>

                    </Box>

                    <Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{allTranslations(localization['bill_create.usersDialogs.table.client'])}</TableCell>
                                    <TableCell>{allTranslations(localization['bill_create.usersDialogs.table.count_purchase'])}</TableCell>
                                    <TableCell align="right">{allTranslations(localization['bill_create.usersDialogs.table.cashback'])}</TableCell>
                                    <TableCell align="right">{allTranslations(localization['bill_create.usersDialogs.table.amount_purchase'])}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <>

                                    {

                                        Boolean(isLoading) && (
                                            <>
                                                {[0, 1, 2, 4].map(() => (
                                                    <TableRow>
                                                        <TableCell><Skeleton/></TableCell>
                                                        <TableCell><Skeleton/></TableCell>
                                                        <TableCell><Skeleton/></TableCell>
                                                        <TableCell><Skeleton/></TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )

                                    }

                                    {

                                        Boolean(!isLoading) && (
                                            <>

                                                {
                                                    clients.map((client, idx) => (
                                                        <TableRow hover onClick={() => handleOnChange(client)}>
                                                            <TableCell>
                                                                <Grid container spacing={1} alignItems="center">
                                                                    <Grid item>
                                                                        <Radio checked={Boolean(selected.find((t) => t._id === client._id))} color="primary"/>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Avatar
                                                                            src={client?.contact?.picture?.value || '/img/user_empty.png'}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item>
                                                                        {`${client?.contact?.firstName?.value} ${client?.contact?.lastName?.value}`}
                                                                    </Grid>
                                                                </Grid>
                                                            </TableCell>
                                                            <TableCell>
                                                                { formatMoney(client?.stats?.purchaseCount || 0, 0, '') }
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {formatMoney(client?.stats?.cashbackSum || 0, 0, '')} {currency.rub}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {formatMoney(client?.stats?.purchaseSum || 0, 0, '')} {currency.rub}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }

                                            </>
                                        )

                                    }

                                </>
                            </TableBody>
                        </Table>

                        <Box mt={2}>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Pagination
                                        page={filter.page}
                                        count={pagination.count}
                                        onChange={(event, value) => handleOnChangeFilter({target: {name: 'page', value}})}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                    </Box>

                    <Box mt={2}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button variant="contained" onClick={onClose}>Подтвердить</Button>
                            </Grid>
                        </Grid>
                    </Box>

                </Box>

            </DialogContent>

        </Dialog>
    )
}

const useStyles = makeStyles(() => ({
    tabs: {
        minHeight: 40,

        '& .MuiButtonBase-root': {
            padding: '0px 32px',
            minHeight: 32,
            minWidth: 'initial'
        }
    }
}));

export default UsersDialogs
