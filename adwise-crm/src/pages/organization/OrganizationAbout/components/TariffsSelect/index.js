import React from "react";
import {
    Box,
    Grid,
    Select,
    MenuItem,
    Typography,
    FormControl,
    FormHelperText,
} from "@material-ui/core";
import {NumericalReliability} from "../../../../../helper/numericalReliability";
import currency from "../../../../../constants/currency";
import {formatMoney} from "../../../../../helper/format";
import {compose} from "recompose";
import {connect} from "react-redux";
import {setOrganization} from "../../../../../AppState";
import OrganizationTariffs from "../../../OrganizationTariffs/OrganizationTariffs";

const TariffsSelect = (props) => {
    const { app, activePacket, value, disabled, packets, onChange, wiseWinPacket } = props;
    const isWiseWin = Boolean(app?.account?.wisewinId);

    return (
        <Box style={{opacity: disabled ? 0.6 : 1}}>
            <FormControl
                fullWidth
                margin="normal"
                disabled={disabled}
                variant={"outlined"}
                error={Boolean(props.error)}
            >
                <Select
                    value={value}
                    name={props.name}
                    disabled={disabled}
                    onChange={onChange}
                >

                    {
                        Boolean(activePacket?._id) && (
                            <MenuItem value={activePacket._id}>
                                <Grid container spacing={1} alignItems="center" justify="space-between">
                                    <Grid item>
                                        <Typography variant="subtitle1">{activePacket.name} <Typography variant="caption">({activePacket.period} {NumericalReliability(activePacket.period, ['месяц', 'месяца', 'месяцев'])})</Typography></Typography>
                                        <Typography variant="caption">
                                            {
                                                activePacket.limit >= 999 ?
                                                    "Без ограничений" :
                                                    `${activePacket.limit} ${NumericalReliability(activePacket.limit, ['сотрудник', 'сотрудника', 'сотрудников'])} ${activePacket.limit} ${NumericalReliability(activePacket.limit, ['акция', 'акции', 'акций'])}`
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle1">{formatMoney(activePacket.price)} {currency[activePacket.currency]}</Typography>
                                    </Grid>
                                </Grid>
                            </MenuItem>
                        )
                    }

                    {
                        packets.map((packet, idx) => {
                            if (packet._id === activePacket?._id) {
                                return null
                            }

                            const price = Boolean(!!isWiseWin && wiseWinPacket !== 'default' && packet.wisewinOption) ? 1 : packet.price;

                            return (
                                <MenuItem value={packet._id}>
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
                                            <Typography variant="subtitle1">{formatMoney(price)} {currency[packet.currency]}</Typography>
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                            )
                        })
                    }
                </Select>

                {
                    Boolean(props.error) && (
                        <FormHelperText error>{props.helperText}</FormHelperText>
                    )
                }

            </FormControl>

        </Box>
    )
}

export default compose(
    connect(
        state => ({
            app: state.app
        })
    ),
)(TariffsSelect);
