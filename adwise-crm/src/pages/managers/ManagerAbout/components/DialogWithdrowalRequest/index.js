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
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const initialState = {
    deposit: ""
};

const DialogWithdrowalRequest = (props) => {
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
                message: allTranslations(localization['managerAbout.dialogWithdrowalRequest.errorNoDeposit'])
            })

            return null
        }
        if (form.deposit > organizationPoint) {
            alertNotification({
                type: "info",
                message: allTranslations(localization['managerAbout.dialogWithdrowalRequest.errorNoCorrectDeposit'])
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
                    <Typography variant="h2">
                        {allTranslations(localization['managerAbout.dialogWithdrowalRequest.title'])}
                    </Typography>
                </Box>

                <Box mb={6}>
                    <Typography variant="formTitle">{allTranslations(localization['managerAbout.dialogWithdrowalRequest.amount'])}</Typography>
                    <TextField
                        value={form.deposit}
                        name="deposit"
                        fullWidth
                        placeholder={allTranslations(localization['managerAbout.dialogWithdrowalRequest.amountPlaceholder'])}
                        variant="outlined"
                        margin="normal"
                        type="number"
                        helperText={`${allTranslations(localization['managerAbout.dialogWithdrowalRequest.amountCaption'])}: ${organizationPoint}${currency.rub}`}
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
                >{allTranslations(localization['managerAbout.dialogWithdrowalRequest.buttonCreate'])}</Button>

            </Box>

        </Dialog>
    )
}

export default DialogWithdrowalRequest
