import React from "react";
import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import {formatCode, formatMoney} from "../../../../../helper/format";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const roles = {
    "cashier": "Кассир",
    "manager": "Менеджер"
};

const CommonInformations = (props) => {
    const { employee, contact } = props;

    return (
        <Box mb={7}>

            <Grid container spacing={1}>

                <Grid item>

                    <Box borderRadius={8} border="0.5px solid rgba(168, 171, 184, 0.6)" px={2} py={1}>

                        <Box mb={1}>

                            <Typography variant="subtitle1">{allTranslations(localization['employee.commonInformations.rating'])}</Typography>

                        </Box>

                        <Typography variant="h5">{ formatMoney((employee?.rating || 0), 1, '.') }</Typography>

                    </Box>

                </Grid>

                <Grid item>

                    <Box borderRadius={8} border="0.5px solid rgba(168, 171, 184, 0.6)" px={2} py={1}>

                        <Box mb={1}>

                            <Typography variant="subtitle1">{allTranslations(localization['employee.commonInformations.role'])}</Typography>

                        </Box>

                        <Typography variant="h5">{ roles[employee?.role] || 0 }</Typography>

                    </Box>

                </Grid>

            </Grid>

        </Box>
    )
}

export default CommonInformations
