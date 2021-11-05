import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Typography,
    Tooltip,
    Button,

    TextField, FormControl, Select, MenuItem
} from "@material-ui/core";

const initialForm = {
    name: ""
};

const DialogCreated = (props) => {
    const { isOpen, onClose, onCreate } = props;

    const [form, setForm] = useState({...initialForm});

    useEffect(() => {
        setForm({...initialForm})
    }, [isOpen]);

    const handleChangeForm = ({ target }) => {
        const { name, value } = target;
        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm)
    }
    const handleSubmit = () => {
        onCreate(form)
    }

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"

            fullWidth

            onClose={onClose}
        >
            <DialogTitle>
                <Typography variant="h3">Создание "Категории"</Typography>
            </DialogTitle>

            <DialogContent>
                <Box>
                    <Typography variant="formTitle">Наименование</Typography>
                    <TextField
                        value={form.name}
                        placeholder="Не могу войти"
                        variant="outlined"
                        margin="normal"
                        name="name"
                        fullWidth
                        onChange={handleChangeForm}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Box px={2} py={1} width="100%">
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={!form.name}
                                onClick={handleSubmit}
                            >Создать</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" size="small" onClick={onClose}>Закрыть</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default DialogCreated
