import React from "react";
import {
    Box,
    Button,
    Typography,
} from "@material-ui/core";

const NotPermission = () => {
    return (
        <Box display="flex" flex={1} justifyContent="center" alignItems="center" minHeight="50vh">

            <Typography variant="h3">У вас нет доступа до данного раздела</Typography>

        </Box>
    )
}

export default NotPermission
