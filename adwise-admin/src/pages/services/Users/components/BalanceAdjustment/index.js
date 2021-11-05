import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,

    Typography,

    Box,
    Grid,
    Button,

    TextField, FormControl, Select, MenuItem
} from "@material-ui/core";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import balancsAdjustmentTypes from "../../../../../constants/balancsAdjustmentTypes";

const BalanceAdjustment = (props) => {
    const { item, isOpen, onClose, onSubmit } = props;

    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [operant, setOperant] = useState('+');
    const [type, setType] = useState('cashback');

    useEffect(() => {
        setAdjustmentAmount('');
    }, [isOpen]);

    const handleOnChangeValue = ({ target }) => {
        const { value } = target;

        setAdjustmentAmount(value);
    }

    const handleOnSubmit = () => {
        const data = {
            amount: (operant === '+') ? +Math.abs(adjustmentAmount) : -Math.abs(adjustmentAmount),
            type: (operant === '+') ? type : ''
        };

        onSubmit(item, data)
    }

    if (Object.keys(item).length <= 0){
        return null
    }

    return (
        <Dialog
            maxWidth="md"

            fullWidth

            open={isOpen}
            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">Корректировка баланса организации <span style={{ color: '#8152E4' }}>{ item.lastName || '' } { item.firstName || '' }</span></Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={2}>

                    <Box mb={2}>
                        <Typography variant="formTitle">Сумма корректировки баланса</Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item>

                            <Grid container spacing={1} wrap="nowrap">
                                <Grid item>
                                    <Button style={{ padding: 0, minWidth: 0, minHeight: 0, lineHeight: 0, width: 38, height: 38 }} variant={operant === '-' ? 'contained' : 'outlined'} onClick={() => setOperant('-')}>-</Button>
                                </Grid>
                                <Grid item>
                                    <Button style={{ padding: 0, minWidth: 0, minHeight: 0, lineHeight: 0, width: 38, height: 38 }} variant={operant === '+' ? 'contained' : 'outlined'} onClick={() => setOperant('+')}>+</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs="auto" style={{ flex: 1 }}>
                            <TextField
                                fullWidth
                                value={adjustmentAmount}
                                placeholder="..."
                                type="number"
                                variant="outlined"
                                onChange={handleOnChangeValue}
                            />
                        </Grid>
                    </Grid>

                    <Box mt={1}>
                        <Typography variant="caption">Бонусов - { formatMoney(item.wallet.bonusPoints) } { currency[item.wallet.currency] }; Кэшбэк - { formatMoney(item.wallet.cashbackPoints) } { currency[item.wallet.currency] }</Typography>
                    </Box>

                </Box>

                {
                    (operant === '+') && (
                        <Box mb={2}>
                            <FormControl margin="normal" fullWidth>
                                <Select
                                    variant="outlined"
                                    value={type}
                                    onChange={({target}) => setType(target.value)}
                                >
                                    {
                                        Object.keys(balancsAdjustmentTypes).map((key) => {
                                            const value = key;
                                            const title = balancsAdjustmentTypes[key];

                                            return (
                                                <MenuItem value={ value }>{ title }</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    )
                }

                <Box mb={2}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button variant="contained" size="small" onClick={handleOnSubmit}>Применить</Button>
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

export default BalanceAdjustment
