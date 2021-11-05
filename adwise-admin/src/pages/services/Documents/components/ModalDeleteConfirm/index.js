import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Typography,

    Grid,

    Button
} from "@material-ui/core";

const ModalDeleteConfirm = (props) => {
    const { item, isOpen, onClose, onDelete } = props;

    if (!isOpen) {
        return null
    }

    const handleOnDeleteItem = () => {
        onDelete(item, true)
    }

    return (

        <Dialog

            open={isOpen}

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Вы действительно хотите удалить категорию "{ item.name }"</Typography>
            </DialogTitle>

            <DialogContent>

                <Typography>После удаление невозможно будет востоновить категорию</Typography>

            </DialogContent>

            <DialogActions>
                <Grid container spacing={2} justify="flex-end">

                    <Grid item>
                        <Button variant="contained" size="small" onClick={handleOnDeleteItem}>Удалить</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" size="small" onClick={onClose}>Отмена</Button>
                    </Grid>

                </Grid>
            </DialogActions>

        </Dialog>

    )
}

export default ModalDeleteConfirm
