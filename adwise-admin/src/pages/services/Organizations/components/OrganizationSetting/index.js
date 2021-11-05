import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,

    Typography,

    Box,
    Grid,
    Button,

    FormControl,
    Select,
    MenuItem,
} from "@material-ui/core";
import {NumericalReliability} from "../../../../../helper/numericalReliability";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";

const OrganizationSetting = (props) => {
    const { organization, tariffs, isOpen, onClose, onSetPacket } = props;

    const [paket, setPacket] = useState('');

    useEffect(() => {
        if (!!organization.packet) {
            setPacket(organization.packet._id)
        }
    }, [organization]);

    const handleOnChangePaket = ({ target }) => {
        const { name, value } = target;

        setPacket(value)
    }

    const handleSetPaket = () => {
        onSetPacket(
            organization._id,
            paket
        )
    }

    return (
        <Dialog
            maxWidth="md"

            fullWidth

            open={isOpen}
            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Настройка организации <span style={{ color: '#8152E4' }}>{ organization.name }</span></Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={2}>

                    <Typography variant="formTitle">Пакет организации</Typography>

                    <FormControl fullWidth margin="normal">
                        <Select
                            value={paket}
                            onChange={handleOnChangePaket}

                            variant="outlined"

                            fullWidth
                        >
                            <MenuItem value="">Сбросить</MenuItem>

                            {
                                tariffs.map((packet, idx) => (
                                    <MenuItem key={`tariff-${ idx }`} value={ packet._id }>
                                        <Grid container spacing={1} alignItems="center" justify="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1">{packet.name} <Typography variant="caption">({packet.period} {NumericalReliability(packet.period, ['месяц', 'месяца', 'месяцев'])})</Typography></Typography>
                                                <Typography variant="caption">
                                                    {
                                                        packet.limit >= 999 ?
                                                            "Без ограничений" :
                                                            `${packet.limit} ${NumericalReliability(packet.limit, ['сотрудник', 'сотрудника', 'сотрудников'])} ${packet.limit} ${NumericalReliability(packet.limit, ['акция', 'акции', 'акций'])}`
                                                    }
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1">{formatMoney(packet.price)} {currency[packet.currency]}</Typography>
                                            </Grid>
                                        </Grid>
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                </Box>

                <Box mb={2}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button variant="contained" size="small" onClick={handleSetPaket}>Применить</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" size="small" onClick={onClose}>Отмена</Button>
                        </Grid>
                    </Grid>
                </Box>

            </DialogContent>

        </Dialog>
    )
};

export default OrganizationSetting
