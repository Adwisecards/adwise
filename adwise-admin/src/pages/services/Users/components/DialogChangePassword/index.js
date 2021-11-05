import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Button,
    Tooltip,
    TextField,
    Typography,
} from "@material-ui/core";
import alertNotification from "../../../../../common/alertNotification";

const DialogChangePassword = (props) => {
    const { isOpen, onClose, user, onSubmit } = props;

    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = () => {
        const isError = newPassword.length < 6;

        if (isError) {
            alertNotification({
                type: 'warning',
                message: 'Минимальная длина пароля 6 символов'
            })

            return null
        }

        onSubmit({...user, newPassword}, user.jwt, true);
    }

    return (
        <Dialog
            open={isOpen}
            maxWidth="sm"
            onClose={onClose}
            fullWidth
        >

            <DialogTitle>
                <Typography variant="h3">Изменение пароля</Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={2}>
                    <Typography variant="subtitle1">Пользователь: {`${user?.row?.lastName} ${user?.row?.firstName}`}</Typography>
                </Box>

                <Box>

                    <Typography variant="formTitle">Новый пароль</Typography>

                    <TextField
                        value={newPassword}
                        variant="outlined"
                        margin="normal"
                        fullWidth

                        onChange={({target}) => setNewPassword(target.value)}
                    />

                </Box>

            </DialogContent>

            <DialogActions>
                <Box width="100%" px={2}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button variant="contained" size="small" onClick={handleSubmit}>Изменить</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="small" onClick={onClose}>Отмена</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>

        </Dialog>
    )
}

export default DialogChangePassword
