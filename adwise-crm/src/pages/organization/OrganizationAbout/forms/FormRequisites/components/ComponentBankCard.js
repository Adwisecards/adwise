import React, { PureComponent } from "react";
import {
    Backdrop,
    Box, Button, CircularProgress, Grid, IconButton, Link, Tooltip, Typography

} from "@material-ui/core";
import axiosInstance from "../../../../../../agent/agent";
import urls from "../../../../../../constants/urls";
import {Trash2 as Trash2Icon} from "react-feather";
import {withStyles} from "@material-ui/styles";
import allTranslations from "../../../../../../localization/allTranslations";
import localization from "../../../../../../localization/localization";

class ComponentBankCard extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            userCreditCard: null,

            messageLoading: '',
            actionUrl: '',

            isLoadingCreditCard: true
        }
    }

    componentDidMount = () => {
        this.onGetUserCard();
    }

    onGetUserCard = () => {
        this.setState({ isLoadingCreditCard: true })

        axiosInstance.get(urls['get-user-card']).then((response) => {
            this.setState({
                userCreditCard: response.data.data.card,
                isLoadingCreditCard: false
            })
        });
    }
    onAddUserCard = () => {
        this.setState({ isLoadingCreditCard: true })

        axiosInstance.post(urls['add-card-to-user']).then((response) => {

            window.open(response.data.data.bankRequest.actionUrl);

            this.setState({
                isLoadingCreditCard: false,
                actionUrl: response.data.data.bankRequest.actionUrl
            });

        }).catch((error) => {
            this.setState({ isOpenLoading: false });
        });
    }
    onDeleteUserCard = () => {
        this.setState({ isLoadingCreditCard: true });

        axiosInstance.put(urls["remove-card-from-user"]).then((response) => {
            this.onGetUserCard();
        });
    }

    render() {
        const { classes } = this.props;
        const { actionUrl, userCreditCard } = this.state;
        const isCard = Boolean(this.state.userCreditCard);

        return (
            <>

                <Box mb={2}>
                    <Typography variant="h4">{allTranslations(localization.organizationAboutBankCardTitle)}</Typography>
                </Box>

                {

                    (!isCard && !actionUrl) && (
                        <Box>

                            <Box mb={1}>
                                <Typography variant="subtitle1">{allTranslations(localization.organizationAboutBankCardEmpty)}</Typography>
                            </Box>

                            <Button
                                variant="contained"
                                size="small"

                                onClick={this.onAddUserCard}
                            >{allTranslations(localization.organizationAboutButtonsBind)}</Button>

                        </Box>
                    )

                }


                {

                    (!!actionUrl) && (
                        <Box>

                            <Typography variant="subtitle1">{allTranslations(localization.organizationAboutBankCardMessageRoute)}</Typography>

                            <Link href={actionUrl} target="_blank">{allTranslations(localization.organizationAboutButtonsGoRoute)}</Link>

                        </Box>
                    )

                }


                {
                    isCard && (

                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Box mb={1}>
                                    <Typography variant="body1">{allTranslations(localization.organizationAboutBankCardYourCard)}</Typography>
                                </Box>

                                <Box className={classes.card}>
                                    <Typography style={{ color: 'white' }} variant="subtitle1">•••• •••• •••• { userCreditCard.Pan.slice(-4) }</Typography>
                                    <Typography style={{ color: 'white' }} variant="body2">{ userCreditCard.ExpDate.slice(0, 2) }/{ userCreditCard.ExpDate.slice(-2) }</Typography>
                                </Box>
                            </Grid>

                            <Grid item>

                                <Tooltip arrow title={allTranslations(localization.organizationAboutBankCardDeleteCard)}>
                                    <IconButton onClick={this.onDeleteUserCard}>
                                        <Trash2Icon color="#8152E4"/>
                                    </IconButton>
                                </Tooltip>

                            </Grid>

                        </Grid>
                    )
                }

                <Backdrop open={this.state.isLoadingCreditCard} invisible={this.state.isLoadingCreditCard}>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <Box mb={2}>
                            <CircularProgress size={80} style={{color: 'white'}}/>
                        </Box>
                    </Box>
                </Backdrop>

            </>
        )
    }
}

const styles = {
    card: {
        padding: '12px 16px',

        border: '1px solid #8152E4',
        backgroundColor: '#8152E4',
        borderRadius: 10,

        color: 'white'
    }
}

export default withStyles(styles)(ComponentBankCard)
