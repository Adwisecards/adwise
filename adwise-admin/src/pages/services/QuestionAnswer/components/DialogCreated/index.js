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

    TextField, FormControl, Select, MenuItem,

    Paper
} from "@material-ui/core";
import {TextCKEditor, TextWYSIWYG} from "../../../../../components";
import {formatUnicode} from "../../../../../helper/formatUnicodeMarkdown";

const initialForm = {
    type: "",
    question: "",
    answer: "",
    categoryId: ""
};

const DialogCreated = (props) => {
    const { groups, isOpen, onClose, onCreate } = props;

    const [form, setForm] = useState({...initialForm});

    useEffect(() => {
        setForm({...initialForm})
    }, [isOpen]);

    const handleChangeForm = ({ target }) => {
        let { name, value } = target;
        let newForm = {...form};
        newForm[name] = value;
        setForm(newForm)
    }
    const handleSubmit = () => {
        onCreate(form);
    }

    return (
        <Dialog
            open={isOpen}
            maxWidth="md"
            fullWidth
            onClose={onClose}

            TransitionProps={{tabIndex: 1}}
        >
            <DialogTitle>
                <Typography variant="h3">Создание "Вопрос/ответ"</Typography>
            </DialogTitle>

            <DialogContent>
                <Box mb={2}>
                    <Typography variant="formTitle">Категория</Typography>
                    <FormControl fullWidth margin="normal">
                        <Select
                            name="categoryId"
                            variant="outlined"
                            value={form.categoryId}
                            onChange={handleChangeForm}
                        >
                            <MenuItem value="">Сбросить</MenuItem>
                            {
                                (groups || []).map((group, idx) => (
                                    <MenuItem value={ group._id } key={`group-${ idx }-${ group._id }`}>{ group.name }</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={2}>
                    <Typography variant="formTitle">Платформа</Typography>
                    <FormControl fullWidth margin="normal">
                        <Select
                            name="type"
                            variant="outlined"
                            value={form.type}
                            onChange={handleChangeForm}
                        >
                            <MenuItem value={'crm'}>CRM</MenuItem>
                            <MenuItem value={'cards'}>AdWise Cards</MenuItem>
                            <MenuItem value={'business'}>AdWise Business</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box mb={2}>
                    <Box mb={1}><Typography variant="formTitle">Вопрос</Typography></Box>
                    <TextWYSIWYG
                        value={form.question}
                        placeholder="Что такое AdWise"
                        variant="outlined"
                        margin="normal"
                        name="question"
                        fullWidth
                        multiline
                        isFullSettings
                        rows={2}
                        rowsMax={4}
                        onChange={handleChangeForm}
                    />
                </Box>
                <Box mb={2}>
                    <Box mb={1}><Typography variant="formTitle">Ответ</Typography></Box>
                    <TextWYSIWYG
                        value={form.answer}
                        placeholder="Системы удобных покупок с кэшбэком"
                        variant="outlined"
                        margin="normal"
                        name="answer"
                        fullWidth
                        multiline
                        isFullSettings
                        rows={3}
                        rowsMax={6}
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
                                disabled={!form.question || !form.answer || !form.categoryId || !form.type}
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
