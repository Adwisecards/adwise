import React, { Component } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Button,
    Typography
} from "@material-ui/core";

const ConfirmationDialog = (props) => {
    const { title, message, titleButton, isOpen, onClose, onConfirm } = props;

    if (!isOpen) {
        return null
    }

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"

            fullWidth

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">{ title }</Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={4}>
                    <Typography variant="subtitle1">{ message }</Typography>
                </Box>

                <Grid container spacing={1}>
                    <Grid item>
                        <Button size="small" variant="contained" onClick={onConfirm}>{ titleButton }</Button>
                    </Grid>
                    <Grid item>
                        <Button size="small" variant="outlined" onClick={onClose}>Отмена</Button>
                    </Grid>
                </Grid>

            </DialogContent>

        </Dialog>
    )
};

ConfirmationDialog.defaultProps = {
    title: "Подтверждение",
    message: "Вы действительно хотите сделать это?",
    titleButton: "Подтвердить"
};

export default ConfirmationDialog
