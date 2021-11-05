import React, {useState, useEffect} from "react";
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
} from "@material-ui/core";
import alertNotification from "../../../../../common/alertNotification";
import currency from "../../../../../constants/currency";

const initialState = {
    deposit: ""
};

const DialogDeposit = (props) => {
    const {isOpen, onClose, onSubmit, organizationPoint} = props;

    const [form, setForm] = useState({...initialState});

    useEffect(() => {
        setForm({...initialState});
    }, [isOpen]);

    const handleOnChange = ({target}) => {
        const {name, value} = target;
        let newForm = {...form};
        newForm[name] = Math.abs(value);
        setForm(newForm);
    }
    const handleOnSubmit = () => {
        if (!form.deposit) {
            alertNotification({
                type: "info",
                message: "Введите сумму на которую хотите пополнить баланс депозита"
            })

            return null
        }
        if (form.deposit > organizationPoint) {
            alertNotification({
                type: "info",
                message: "Введенная сумма не должна превышать баланс организации"
            })

            return null
        }

        onSubmit(form)
    }

    return (
        <Dialog
            open={isOpen}
            fullWidth
            maxWidth="sm"
            onClose={onClose}
        >

            <Box p={6}>

                <Box mb={5}>
                    <Typography variant="h2">Депозит</Typography>
                </Box>

                <Box mb={6}>
                    <Typography variant="formTitle">Сумма</Typography>
                    <TextField
                        value={form.deposit}
                        name="deposit"
                        fullWidth
                        placeholder="Введите сумму"
                        variant="outlined"
                        margin="normal"
                        type="number"
                        helperText={`Введенная сумма не должна превышать ваш текущий баланс организации: ${organizationPoint}${currency.rub}`}
                        onChange={handleOnChange}
                    />
                </Box>

                <Button
                    variant="contained"
                    style={{
                        fontSize: 18,
                        lineHeight: '36px',
                        padding: '3px 22px',
                        textTransform: 'initial'
                    }}
                    onClick={handleOnSubmit}
                >Пополнить</Button>

            </Box>

        </Dialog>
    )
}

export default DialogDeposit
