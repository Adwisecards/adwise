import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Button,
    TextField,
    Typography,
    Tabs,
    Tab
} from "@material-ui/core";
import alertNotification from "../../../../../common/alertNotification";

const initialForm = {
    depost: '',
};

const DialogEditDeposite = (props) => {
    const { isOpen, onClose, organization, onEdit } = props;

    const [form, setForm] = useState({...initialForm});
    const [directionDeposit, setDirectionDeposit] = useState("deposit");

    useEffect(() => {
        return () => {
            setForm({...initialForm});
            setDirectionDeposit('deposit');
        };
    }, [isOpen]);


    const handleChangeForm = ({target}) => {
        const { value, name } = target;
        let newForm = {...form};
        newForm[name] = Math.abs(value);
        setForm(newForm);
    }
    const handleSubmit = () => {
        let validForm = {...form};
        let depost = Number.parseFloat(validForm.depost);

        if (!depost) {
            alertNotification({
                type: "error",
                message: "Введен некоректный депозит"
            })

            return null
        }

        if (directionDeposit === 'balance') {
            validForm.depost = Math.abs(validForm.depost) * -1;
        }

        onEdit({...organization, validForm}, true);
    }

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                <Typography variant="h3">Депозито</Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={3}>
                    <Box mb={1}>
                        <Typography variant="formTitle">Направление денежных средств</Typography>
                    </Box>

                    <Tabs value={directionDeposit} onChange={(event, value) => setDirectionDeposit(value)}>
                        <Tab value="deposit" label="На депозит"/>
                        <Tab value="balance" label="На баланс"/>
                    </Tabs>

                </Box>

                <Box>
                    <Typography variant="formTitle">Сумма депозита</Typography>
                    <TextField
                        fullWidth
                        value={form.depost}
                        variant="outlined"
                        margin="normal"
                        type="number"
                        name="depost"
                        placeholder="Введети сумму депозита"
                        onChange={handleChangeForm}
                    />
                    <Typography component="div" variant="caption">Сумма редактирования депозита должна быть равно или меньше сумме баланса.</Typography>
                    <Typography variant="caption">Баланс организации: {organization?.wallet?.points}</Typography>
                </Box>

            </DialogContent>

            <DialogActions>
                <Box px={2} width="100%">
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button size="small" variant="contained" onClick={handleSubmit}>Редактировать</Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" variant="contained" onClick={onClose}>Закрыть</Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>

        </Dialog>
    )
}

export default DialogEditDeposite
