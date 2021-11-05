import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Grid,
    Typography,
    Button, Link,
} from "@material-ui/core";
import {compose} from "recompose";
import {connect} from "react-redux";
import {setOrganization} from "../../AppState";
import Dashboard from "../../pages/dashboard/Dashboard/Dashboard";

const DialogWelcomeWindow = (props) => {
    const { app, isOpen, onClose } = props;
    const { account } = props;

    return (
        <Dialog
            open={isOpen}

            maxWidth="md"

            fullWidth

            onClose={onClose}
        >
            <DialogTitle>
                <Box pt={2} px={2}>
                    <Typography variant="h3">Здравствуйте, {`${ account?.firstName || '' } ${ account?.lastName || '' }`}!</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box pb={3} px={2}>
                    <Box mb={2}>
                        <Typography>Хотим Вам сообщить, что у нас вышло обновление для формы заполнения данных в Реквизитах – теперь она стала намного понятнее и красивее! Также на будущее мы соединили её с формой для регистрации торговой точки в банке, однако мы не смогли перенести данные из этой формы в основную. Мы хотим попросить сделать это Вас. Заполните пожалуйста в Реквизитах(ссылка на страницу сразу открытой вкладкой) недостающие данные и сохраните. Если что-то просмотрели – форма Вам подскажет, что Вы забыли заполнить.</Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography>Перейти в раздел "<Link href="/organization?tab=requisites" target="_blank">Реквизиты</Link>"</Typography>
                    </Box>
                    <Box mb={4}>
                        <Typography>Благодарим за понимание!</Typography>
                    </Box>

                    <Button variant="contained" onClick={onClose}>Принять и продолжить</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default compose(
    connect(
        state => ({
            app: state.app
        })
    ),
)(DialogWelcomeWindow);
