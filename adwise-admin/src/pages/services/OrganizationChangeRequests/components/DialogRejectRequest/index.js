import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Button,
    Typography,
    TextField
} from "@material-ui/core";
import alertNotification from "../../../../../common/alertNotification";

const DialogRejectRequest = (props) => {
    const { id, isOpen, onClose, onReject } = props;

    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("");
    }, [isOpen]);


    const handleOnReject = () => {
        if (!message) {
            alertNotification({
                title: "Предупреждение",
                message: "Введите причину вашего отказа",
                type: "warning"
            })

            return null
        }

        onReject(id, message)
    }

    return (
        <Dialog
            open={isOpen}
            maxWidth="md"
            fullWidth

            onClose={onClose}
        >
            <DialogTitle>
                <Typography variant="h3">Отказ об изменении</Typography>
            </DialogTitle>

            <DialogContent>
                <Box>
                    <Typography variant="formTitle">Сообщение об отказе</Typography>

                    <TextField
                        value={message}
                        fullWidth
                        placeholder="Причина вашего отказа"
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                        rowsMax={4}

                        onChange={({target}) => setMessage(target.value)}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Box px={2} width="100%">
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button variant="contained" size="small" onClick={handleOnReject}>Отказать</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" size="small" onClick={onClose}>Закрыть</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>
        </Dialog>
    )
};

export default DialogRejectRequest
