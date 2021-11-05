import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Button,
    Typography,

    Tabs,
    Tab,

    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Table,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import LegalForm from "../../../../../legalForms";
import {formatMoney} from "../../../../../helper/format";
import legalForm from "../../../../../constants/legalForm";
import methodAcceptingPayments from "../../../../../constants/methodAcceptingPayments";
import currency from "../../../../../constants/currency";
import moment from "moment";
import axiosInstance from "../../../../../agent/agent";
import {getFormFromBody} from "../../../../../legalForms/helpers";

const OrganizationModal = (props) => {
    const { organization, isOpen, onClose } = props;

    const [activeTab, setActiveTab] = useState("about");

    useEffect(() => {
        setActiveTab('about');
    }, [isOpen]);

    return (
        <Dialog
            open={isOpen}
            fullWidth
            maxWidth="lg"

            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">{ organization.name }</Typography>
            </DialogTitle>
            <DialogContent>

                <Box mb={1}>
                    <Tabs value={activeTab} onChange={(event, value) => setActiveTab(value)}>
                        <Tab value="about" label="Общая информация"/>
                        <Tab value="legal" label="Реквизиты"/>
                    </Tabs>
                </Box>

                <Box>
                    {(activeTab === 'about') && (
                        <TabAbout { ...organization }/>
                    )}
                    {(activeTab === 'legal') && (
                        <TabLegal { ...organization }/>
                    )}
                </Box>

            </DialogContent>
            <DialogActions></DialogActions>

        </Dialog>
    )
};

const TabAbout = (props) => {

    if (!props || Object.keys(props).length <= 0) {
        return null
    }

    const { legal, user, manager } = props;
    const classes = useStyles();

    return (
        <Box className={classes.table}>

            <Box mb={2}>
                <Box mb={1}>
                    <Typography variant="h5">Организация</Typography>
                </Box>

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Наименование</TableCell>
                            <TableCell>{ props.name }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Полное наименование</TableCell>
                            <TableCell>{ legal?.info?.fullName }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Тип легальной форма</TableCell>
                            <TableCell>{ legalForm[legal?.form] }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Базовая реферальная программа</TableCell>
                            <TableCell>
                                1 уровень - { props.distributionSchema?.first }%<br/>
                                2 - 21 уровень - { props.distributionSchema?.other * 20 }%<br/>
                                Кэшбек покупателю - { props.cashback }%<br/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Категория</TableCell>
                            <TableCell>{ props.category?.name }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Почта</TableCell>
                            <TableCell>{ props.emails.join(', ') }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Телефоны</TableCell>
                            <TableCell>{ props.phones.join(', ') }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Способ приема платежей</TableCell>
                            <TableCell>
                                { methodAcceptingPayments[props.paymentType] }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Платежный идентификатор магазина</TableCell>
                            <TableCell>{ props.paymentShopId }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Кошелек</TableCell>
                            <TableCell>
                                Баланс - { formatMoney(props?.wallet?.points) } { currency[props.wallet?.currency] }<br/>
                                Бонусы - { formatMoney(props?.wallet?.bonusPoints) } { currency[props.wallet?.currency] }<br/>
                                Кэшбэк - { formatMoney(props?.wallet?.cashbackPoints) } { currency[props.wallet?.currency] }<br/>
                                К зачислению - { formatMoney(props?.wallet?.frozenPointsSum) } { currency[props.wallet?.currency] }<br/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Статистика</TableCell>
                            <TableCell>
                                Депозит - { formatMoney(props?.stats?.depositPayoutSum) } { currency[props?.wallet?.currency] }<br/>
                                Кол-во покупок - { formatMoney(props?.stats?.purchaseCount, 0) } шт.<br/>
                                Оборот - { formatMoney(props?.stats?.totalTurnover) } { currency[props?.wallet?.currency] }<br/>
                                Сумма вывода - { formatMoney(props?.stats?.withdrawalSum) } { currency[props?.wallet?.currency] }<br/>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Наличные платежи</TableCell>
                            <TableCell>{ (props.cash) ? 'Включены' : 'Выключены' }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Чаевые</TableCell>
                            <TableCell>
                                { props.tips ? 'Включены' : 'Выключены' }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            <Box mb={2}>
                <Box mb={1}>
                    <Typography variant="h5">Владелец</Typography>
                </Box>

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>ФИО</TableCell>
                            <TableCell>{ `${ user.lastName } ${ user.firstName }` }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Дата рождения</TableCell>
                            <TableCell>{ (!!user.dob) ? moment(user.dob).format('DD.MM.YYYY') : '-' }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{ user.email }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Телефон</TableCell>
                            <TableCell>{ user.phoneInfo }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>WiseWin Id</TableCell>
                            <TableCell>{ user.wisewinId }</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            {
                Boolean(manager) && (
                    <Box mb={2}>
                        <Box mb={1}>
                            <Typography variant="h5">Менеджер</Typography>
                        </Box>

                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ФИО</TableCell>
                                    <TableCell>{ `${ manager.lastName } ${ manager.firstName }` }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Дата рождения</TableCell>
                                    <TableCell>{ (Boolean(manager.dob)) ? moment(manager.dob).format('DD.MM.YYYY') : '-' }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>{ manager.email }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Телефон</TableCell>
                                    <TableCell>{ manager.phoneInfo }</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>WiseWin Id</TableCell>
                                    <TableCell>{ manager.wisewinId }</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                )
            }

            <Box mb={2}>
                <Box mb={1}>
                    <Typography variant="h5">Идентификаторы</Typography>
                </Box>

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>ID организации</TableCell>
                            <TableCell>{ props._id }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID кошелька организации</TableCell>
                            <TableCell>{ props.wallet._id }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID руководите</TableCell>
                            <TableCell>{ props.user._id }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID кошелька руководите</TableCell>
                            <TableCell>{ props.user.wallet }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID менеджера</TableCell>
                            <TableCell>{ manager?._id }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID кошелька менеджера</TableCell>
                            <TableCell>{ manager?.wallet }</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

        </Box>
    )
}
const TabLegal = (props) => {
    if (!props || Object.keys(props).length <= 0) {
        return null
    }

    const { legal, _id: organizationId } = props;
    const classes = useStyles();
    const [legals, setLegals] = useState({});

    useEffect(() => {
        ( async () => {
            await getLegals();
        })();
    }, []);

    const getLegals = async () => {
        let response = await axiosInstance.get(`/legal/get-organization-legal/${ organizationId }`).then((res) => {
            return res.data.data.legal
        }).catch((err) => {
            return null
        });

        if (!response) {
            return null
        }

        response.info = getFormFromBody(response);

        setLegals(response);
    }

    return (
        <Box className={classes.table}>

            {
                Boolean(Object.keys(legals).length > 0) && (
                    <LegalForm info={legals.info} data={legals.form}/>
                )
            }

        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    table: {
        '& .MuiTableCell-root': {
            width: '50%'
        }
    }
}));

export default OrganizationModal
