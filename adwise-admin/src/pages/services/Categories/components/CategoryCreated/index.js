import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Typography,

    Grid,

    Button,

    Box,

    TextField
} from "@material-ui/core";

const CategoryCreated = (props) => {
    const { isOpen, onClose, onCreate } = props;

    const [form, setForm] = useState({ name: '' });

    if (!isOpen) {
        return null
    }

    const handleOnChange = ({ target }) => {
        const { name, value } = target;

        let newForm = {...form};

        newForm[name] = value;

        setForm(newForm);
    }

    const handleOnClose = () => {
        setForm({name: ''});

        onClose()
    }

    return (

        <Dialog
            open={isOpen}
            onClose={onClose}

            maxWidth="sm"

            fullWidth
        >

            <DialogTitle>
                <Typography variant="h3">Создание категории</Typography>
            </DialogTitle>

            <DialogContent>

                <Typography variant="formTitle">Наименование</Typography>

                <TextField
                    value={form.name}

                    placeholder="..."
                    variant="outlined"
                    name="name"
                    margin="normal"

                    fullWidth

                    onChange={handleOnChange}
                />

                <Box mt={2}>
                    <Grid container spacing={2} justify="flex-end">

                        <Grid item>
                            <Button variant="contained" size="small" onClick={() => onCreate(form)} disabled={!form.name}>Создать</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" size="small" onClick={handleOnClose}>Отмена</Button>
                        </Grid>

                    </Grid>
                </Box>

            </DialogContent>

        </Dialog>

    )
}

export default CategoryCreated
