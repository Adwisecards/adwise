import React, {useState, useEffect} from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    TextField,
    Typography,

    Dialog,

    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow, Checkbox, Avatar, Switch,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {formatMoney} from "../../../../../../helper/format";
import currency from "../../../../../../constants/currency";
import clsx from "clsx";
import allTranslations from "../../../../../../localization/allTranslations";
import localization from "../../../../../../localization/localization";

const initialForm = {
    title: "",
    message: "",
    isActiveClients: true
};

const DialogCreatedPushNotification = (props) => {
    const {open, onClose, initialClient, onCreate} = props;
    const classes = useStyles();

    const [clients, setClients] = useState([...initialClient]);
    const [form, setForm] = useState({...initialForm});

    useEffect(() => {
        const clientsList = initialClient.map((client) => {
            return {
                ...client,
                disabledList: false
            };
        });

        setClients([...clientsList]);
        setForm({...initialForm});
    }, [open]);

    const handleOnChangeForm = ({target}) => {
        const {name, value} = target;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
    }
    const handleOnChangeClients = ({ _id: clientId }) => {
        let newClients = [...clients];
        let client = newClients.find((t) => t._id === clientId);
        client.disabledList = !Boolean(client.disabledList);

        setClients(newClients);
        handleOnChangeForm({
            target: {
                name: "isActiveClients",
                value: Boolean(newClients.find((t) => !t.disabledList))
            }
        })
    }

    const handleOnCreatePushNotification = () => {
        const activeClients = clients.filter(t => !t.disabledList);
        let body = {
            title: form.title,
            body: form.message,
            type: 'common',
            data: {},
            asOrganization: true
        };

        body.receiverIds = activeClients.map((t) => t.user);

        onCreate(body);
    }

    const disabledForm = Boolean(!form.title || !form.message || !form.isActiveClients);

    return (
        <Dialog
            open={open}
            onClose={onClose}

            fullWidth
            maxWidth="md"
            scroll="body"
        >

            <Box px={7} py={6} bgcolor="white">

                {/* Заголовок */}
                <Box mb={5}>
                    <Typography variant="modalTitle">{allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.title'])}</Typography>
                </Box>

                {/* Заголовок пуш уведомления */}
                <Box mb={4}>

                    <Typography className={classes.formTitle}>
                        {allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.form.title'])}
                    </Typography>

                    <TextField
                        name="title"
                        value={form.title}
                        placeholder={allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.form.titlePlaceholder'])}
                        fullWidth
                        variant="outlined"
                        onChange={handleOnChangeForm}
                    />

                </Box>

                {/* Сообщение пуш уведомления */}
                <Box mb={5}>

                    <Typography className={classes.formTitle}>{allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.form.message'])}</Typography>

                    <TextField
                        name="message"
                        value={form.message}
                        placeholder={allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.form.messagePlaceholder'])}
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        onChange={handleOnChangeForm}
                    />

                </Box>

                {/* Клиенты */}
                <Box mb={5}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{backgroundColor: 'white'}}>{allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.table.client'])}</TableCell>
                                <TableCell style={{backgroundColor: 'white'}}>{allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.table.countPurchase'])}</TableCell>
                                <TableCell style={{backgroundColor: 'white'}} align="right">{allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.table.cashback'])}</TableCell>
                                <TableCell style={{backgroundColor: 'white'}} align="right">{allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.table.amountPurchase'])}</TableCell>
                                <TableCell style={{backgroundColor: 'white'}} align="right">{allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.table.status'])}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                clients.map((client) => (
                                    <TableRow hover selected={Boolean(!client.disabledList)}
                                              onClick={() => handleOnChangeClients(client)}>
                                        <TableCell>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid item>
                                                    <Checkbox color="primary"
                                                              checked={Boolean(!client.disabledList)}/>
                                                </Grid>
                                                <Grid item>
                                                    <Avatar
                                                        src={client?.contact?.picture?.value || '/img/user_empty.png'}/>
                                                </Grid>
                                                <Grid item>
                                                    {`${client?.contact?.firstName?.value} ${client?.contact?.lastName?.value}`}
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                        <TableCell>
                                            {formatMoney(client.stats?.purchaseCount || 0, 0, '')}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatMoney(client.stats?.cashbackSum || 0, 0, '')} {currency.rub}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatMoney(client.stats?.purchaseSum || 0, 0, '')} {currency.rub}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Switch checked={!client.disabled} disabled/>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Box>

                <Box>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                className={clsx({
                                    [classes.buttonCreate]: true,
                                    [classes.buttonCreateDisabled]: disabledForm,
                                })}
                                disabled={disabledForm}
                                onClick={handleOnCreatePushNotification}
                            >
                                {allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.buttonCreate'])}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="text" className={classes.buttonCancel} onClick={onClose}>
                                {allTranslations(localization['push_notification.createPushNotification.dialogCreatedPushNotification.buttonReset'])}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

            </Box>

        </Dialog>
    )
}

const useStyles = makeStyles((theme) => ({
    formTitle: {
        fontSize: 16,
        color: '#25233E',
        fontWeight: '500',
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginBottom: 8
    },

    tableClients: {},

    buttonCreate: {
        padding: '0 46px'
    },
    buttonCreateDisabled: {
        backgroundColor: '#808080!important',
        opacity: '1!important'
    },

    buttonCancel: {
        color: '#EE6A6A'
    }
}));

export default DialogCreatedPushNotification
