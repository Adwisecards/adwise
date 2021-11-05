import React from "react";
import {
    Avatar,
    Grid,
    Typography
} from "@material-ui/core";
import {
    Skeleton
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";

const User = (props) => {
    const { user, isLoading } = props;
    const classes = useStyles();

    if (isLoading) {
        return (
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Skeleton width={64} height={64} variant="circle"/>
                </Grid>
                <Grid item>
                    <Skeleton width={325} height={38}/>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item>
                <Avatar
                    src={user?.picture || '/img/user_empty.png'}
                    style={{ width: 64, height: 64 }}
                />
            </Grid>
            <Grid item>
                <Typography className={classes.userName}>{ `${user?.firstName || ''} ${user?.lastName || ''}` }</Typography>
            </Grid>
        </Grid>
    )
};

const useStyles = makeStyles((theme) => ({
    userName: {
        fontSize: 32,
        lineHeight: "38px",
        color: '#25233E',
        fontFeatureSettings: "'ss03' on"
    }
}));

export default User
