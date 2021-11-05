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
    const { account, organization } = app;
    return (
        <Dialog
            open={isOpen}

            maxWidth="md"

            fullWidth
        >
            <DialogTitle>
                <Box pt={2} px={2}>
                    <Typography variant="h3">Здравствуйте, {`${ account?.firstName || '' } ${ account?.lastName || '' }`}!</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box pb={3} px={2}>
                    <Box mb={3}>

                        <Box mb={2}>
                            <Typography>Приветствуем Вас в нашей CRM-системе AdWise!</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography>AdWise – это Ваш помощник в привлечении клиентов. Для этого у него есть три инструмента:</Typography>
                            <Typography>•  Ваши сотрудники превращаются в менеджеров по продажам при помощи визиток в приложении AdWise Cards</Typography>
                            <Typography>•  Личные рекомендации создают лояльных и постоянных клиентов</Typography>
                            <Typography>•  Реферальная программа побуждает рекомендовать Ваш продукт</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography>Главные преимущества нашей системы:</Typography>
                            <Typography>1.  Новый источник клиента для бизнеса</Typography>
                            <Typography>2.  Чаевые для сотрудников</Typography>
                            <Typography>3.  Мотивация сотрудников рекомендовать Ваш бизнес</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography>Для дальнейшей работы в системе, Вам необходимо:</Typography>
                            <Typography>1.  Скачать заполненную анкету и договор в разделе "Моя компания" во вкладке <Link href="/organization?tab=requisites" target="_blank">Реквизиты</Link></Typography>
                            <Typography>2.  Добавьте следующий перечень документов в виде сканов*:</Typography>
                            {
                                (organization?.legal?.form === 'individual') && (
                                    <Box ml={2}>
                                        <Typography>a. Паспорт (первый разворот + место регистрации);</Typography>
                                        <Typography>b. Справка о постановке на учет физического лица в качестве налогоплательщика НПД.</Typography>
                                    </Box>
                                )
                            }
                            {
                                (organization?.legal?.form === 'ip') && (
                                    <Box ml={2}>
                                        <Typography>a. Паспорт (первый разворот + место регистрации);</Typography>
                                        <Typography>b. Свидетельство о государственной регистрации физического лица в качестве индивидуального предпринимателя (ОГРНИП) либо Лист записи.</Typography>
                                    </Box>
                                )
                            }
                            {
                                (organization?.legal?.form === 'ooo') && (
                                    <Box ml={2}>
                                        <Typography>a. Паспорт руководителя юридического лица (первый разворот + место регистрации);</Typography>
                                        <Typography>b. Свидетельство о постановке на учет юридического лица в налоговом органе (ИНН);</Typography>
                                        <Typography>c. Свидетельство о государственной регистрации юридического лица (ОГРН) или Лист записи;</Typography>
                                        <Typography>d. Решение либо Протокол об избрании руководителя юридического лица, а также о продлении его полномочий.</Typography>
                                    </Box>
                                )
                            }
                            <Typography>3.  Перейти к <Link href="/application-form" target="_blank">форме подачи заявки</Link> и заполните её с пометкой “{`${ account?.firstName || '' } ${ account?.lastName || '' }`} регистрация в CRM”</Typography>
                            <Typography>4.  В ответ на Вашу почту придёт информация по документам, код менеджера, если он нужен, и счёт для оплаты за подключение к CRM-системе</Typography>
                            <Typography>5.  После оплаты счёта Вам нужно будет подписать акт, отправить оригинал по адресу БЦ "ВЫСОЦКИЙ" 620075, г. Екатеринбург, ул. Малышева, 51, 6 этаж, офис. 6/08, а также выслать скан через <Link href="/feedback" target="_blank">форму обратной связи</Link>.</Typography>
                            <Typography>6.  На этом всё! Вы можете приступать к работе! По всем вопросам можно также обращаться через форму обратной связи.</Typography>

                            <Box mt={2}>
                                <Typography style={{ marginLeft: -4 }}>*Документы нужны для выставления счетов и составления Актов.</Typography>
                                <Typography>Документы не передаются третьим лицам(за исключением официального запроса гос.органов)</Typography>
                            </Box>
                        </Box>
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
