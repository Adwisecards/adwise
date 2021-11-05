import React, { Component } from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    IconButton,
    Typography, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    UserX as UserXIcon
} from "react-feather";
import {
    DialogReferralChange
} from "./components";

import {store} from "react-notifications-component";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";

class ReferralChange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowBackdrop: false,
            isOpenDialogReferralChange: false
        };
    }

    componentDidMount = () => {}

    onOpenDialogReferralChange = () => {
        this.setState({ isOpenDialogReferralChange: true })
    }
    onChangeParent = (props) => {
        const { parent, reason, subscription, userReferral } = props;
        console.log('props: ', props);

        this.setState({ isShowBackdrop: true });
        axiosInstance.put(`${ apiUrls["change-subscription-parent"] }${ subscription._id }`, {
            parentId: userReferral?._id,
            reason
        }).then((response) => {
            alertNotification({
                title: 'Системное уведомление',
                message: 'Пользователь успешно изменил родителя подписки',
                type: 'success'
            });

            this.setState({ isShowBackdrop: false })
        }).catch(() => {
            alertNotification({
                title: 'Системное уведомление',
                message: 'Произошла ошибка при изменении подписки пользователя',
                type: 'danger'
            });
            this.setState({ isShowBackdrop: false })
        })

    }

    render() {
        const { isOpenDialogReferralChange } = this.state;

        return (
            <>

                <Box mb={2}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h1">Смена реферала</Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title="Создать запрос на смену реферала">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    style={{padding: 10, minWidth: 0}}

                                    onClick={this.onOpenDialogReferralChange}
                                >
                                    <UserXIcon color="#8152E4"/>
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <DialogReferralChange
                    isOpen={isOpenDialogReferralChange}

                    onClose={() => this.setState({ isOpenDialogReferralChange: false })}
                    onChangeParent={this.onChangeParent}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default ReferralChange
