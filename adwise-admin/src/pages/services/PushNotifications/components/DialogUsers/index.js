import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Typography,
    Button,

    TextField,

    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";

const initialFilter = {
    emailInfo: '',
    firstName: '',
    lastName: '',
    phone: ''
};

const DialogUsers = (props) => {
    const {isOpen, onClose, users} = props;

    const [filter, setFilter] = useState({...initialFilter});

    useEffect(() => {
        setFilter({...initialFilter})
    }, [isOpen]);

    const handleOnChangeFilter = ({target}) => {
        const { name, value } = target;
        let newFilter = {...filter};
        newFilter[name] = value;

        setFilter(newFilter)
    }

    return (
        <Dialog
            open={isOpen}

            maxWidth="lg"
            fullWidth

            onClose={onClose}
        >
            <DialogTitle>
                <Box mb={1}>
                    <Typography variant="h3">Пользователи</Typography>
                </Box>

                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <TextField
                            name="emailInfo"
                            value={filter.emailInfo}
                            variant="outlined"
                            label="Email"
                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            name="firstName"
                            value={filter.firstName}
                            variant="outlined"
                            label="Фамилия"
                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            name="lastName"
                            value={filter.lastName}
                            variant="outlined"
                            label="Имя"
                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            name="phone"
                            value={filter.phone}
                            variant="outlined"
                            label="Телефон"
                            onChange={handleOnChangeFilter}
                        />
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Фамилия</TableCell>
                            <TableCell>Имя</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Пуш токены</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map((user) => {
                                if (
                                    Boolean(user?.emailInfo?.indexOf(filter.emailInfo) <= -1 && !!filter.emailInfo) ||
                                    Boolean(user?.firstName?.indexOf(filter.firstName) <= -1 && !!filter.firstName) ||
                                    Boolean(user?.lastName?.indexOf(filter.lastName) <= -1 && !!filter.lastName) ||
                                    Boolean(user?.phone?.indexOf(filter.phone) <= -1 && !!filter.phone)
                                ) {
                                    return null
                                }

                                return (
                                    <TableRow>
                                        <TableCell>{ user?.emailInfo }</TableCell>
                                        <TableCell>{ user?.firstName }</TableCell>
                                        <TableCell>{ user?.lastName }</TableCell>
                                        <TableCell>{ user?.phone }</TableCell>
                                        <TableCell>
                                            <Typography>
                                                Android:
                                                <Typography
                                                    color="primary"
                                                    style={{ maxWidth: 200, wordWrap: 'break-word!important' }}
                                                >
                                                    { user?.pushToken || '' }
                                                </Typography>
                                            </Typography>
                                            --------------
                                            <Typography>
                                                IOS:
                                                <Typography
                                                    color="primary"
                                                    style={{ maxWidth: 200, wordWrap: 'break-word!important' }}
                                                >
                                                    { user?.deviceToken || '' }
                                                </Typography>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </DialogContent>

            <DialogActions>
                <Box px={2} py={1} width="100%">
                    <Button variant="outlined" size="small" onClick={onClose}>Закрыть</Button>
                </Box>
            </DialogActions>

        </Dialog>
    )
}

export default DialogUsers
