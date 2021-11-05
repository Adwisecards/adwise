import React from "react";
import {
    Box,
    Grid,
    Avatar,
    Typography
} from "@material-ui/core";
import {} from "@material-ui/styles";
import {
    Skeleton
} from "@material-ui/lab";

const User = (props) => {
    const {
        contact,
        isLoading
    } = props;

    if (isLoading) {
        return (
            <Box mb={4}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Skeleton width={64} height={64} variant="circle"/>
                    </Grid>
                    <Grid item>
                        <Skeleton width={325} height={38}/>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    return (
        <Box mb={4}>

            <Grid container spacing={2} alignItems="center">

                <Grid item>

                    <Box
                        borderRadius={999}
                        overflow="hidden"
                        width={64}
                        height={64}
                    >

                        <Avatar
                            src={contact?.picture?.value || '/img/user_empty.png'}
                            style={{width: '100%', height: '100%'}}
                        />

                    </Box>

                </Grid>

                <Grid item>

                    <Typography
                        variant="h1">{`${contact?.firstName?.value || ''} ${contact?.lastName?.value || ''}`}</Typography>

                </Grid>

            </Grid>

        </Box>
    )
}

export default User
