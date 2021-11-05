import React from "react";
import {
    Grid,
    Switch,
    Typography
} from "@material-ui/core";

const Header = (props) => {
    const {
        organizationName,
        organizationDisabled,
    } = props;

    return (
        <Grid container alignItems="center" spacing={2}>

            <Grid item>
                <Typography variant="h1">Моя компания</Typography>
            </Grid>

            <Grid item>
                <Typography variant="h1" color="primary">{organizationName}</Typography>
            </Grid>

            <Grid item>
                <Switch
                    checked={!organizationDisabled}
                    color="primary"
                />
            </Grid>

        </Grid>
    )
}

export default Header
