import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Grid,
    Button,
    TextField,
    Typography
} from "@material-ui/core";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const MessageChangeRequest = (props) => {
    const { isOpen, onClose, onSubmit } = props;

    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("");
    }, [isOpen]);

    const onChangeMessage = ({target}) => {
        const { value } = target;

        setMessage(value);
    }
    const onSend = () => {
        onSubmit(message);
    }

    return (
        <Dialog
            open={isOpen}
            maxWidth="md"
            fullWidth

            onClose={onClose}
        >
            <DialogTitle>
                <Typography variant="h3">{allTranslations(localization['organization_about.messageChangeRequest.title'])}</Typography>
            </DialogTitle>

            <DialogContent>
                <Typography variant="formTitle">{allTranslations(localization['organization_about.messageChangeRequest.message'])}</Typography>
                <TextField
                    value={message}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    onChange={onChangeMessage}
                />
            </DialogContent>

            <DialogActions>
                <Box px={2} width="100%">
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button disabled={!message} size="small" onClick={() => onSend()} variant="contained">
                                {allTranslations(localization['organization_about.messageChangeRequest.buttonCreate'])}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" onClick={onClose} variant="outlined">
                                {allTranslations(localization['organization_about.messageChangeRequest.buttonCancel'])}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default MessageChangeRequest
