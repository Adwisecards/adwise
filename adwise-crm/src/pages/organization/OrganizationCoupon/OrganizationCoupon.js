import React, {Component} from 'react';
import {
    Backdrop,
    Box, CircularProgress,
    Grid,

    IconButton,

    Typography
} from '@material-ui/core';
import {
    ArrowLeftCircle as ArrowLeftCircleIcon
} from 'react-feather';
import {
    FormMain,
    FormDocuments
} from './form';
import {
    ReferralSystem
} from './components';
import {withStyles} from "@material-ui/styles";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";

class OrganizationCoupon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            share: {},
            documents: [],

            isNoCoupon: false,
            isLoading: true
        }
    }

    componentDidMount = () => {
        this.onGetCoupon();
    }

    onGetCoupon = () => {
        const couponId = this.props.match.params.id;

        if (!couponId){
            this.setState({ isNoCoupon: true });
            return null
        }

        axiosInstance.get(`${ urls["get-coupon"] }${ couponId }`).then((response) => {
            this.setState({
                share: response.data.data.coupon,
                isLoading: false
            }, () => {
                ( async () => {
                    await this.getDocument();
                })();
            })
        }).catch(() => {
            this.setState({
                isNoCoupon: true,
                isLoading: false
            })
        })
    }
    getDocument = async () => {
        const { share } = this.state;

        const documents = await axiosInstance.get(`${ urls["legal-get-coupon-documents"] }/${ share._id }`).then((response) => {
            return response.data.data.couponDocuments
        }).catch((error) => {
            return []
        })

        this.setState({documents})
    }

    goBack = () => {
        this.props.history.goBack()
    }

    render() {
        const {documents} = this.state;
        const {classes} = this.props;

        return (
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item>
                        <IconButton onClick={this.goBack}>
                            <ArrowLeftCircleIcon size={50} color={'rgba(255, 255, 255, 0.5)'} strokeWidth={1}/>
                        </IconButton>
                    </Grid>
                    <Grid item style={{flex: 1}}>
                        <Box className={classes.container}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <Box mb={5}>
                                        <Typography variant="h3">{ (this.state.isLoading) ? 'Идет загрузка...' : this.state.share.name }</Typography>
                                    </Box>
                                    <Box>
                                        <FormMain
                                            share={this.state.share}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box mb={5}>
                                        <Typography variant="h3">Базовая реферальная программа</Typography>
                                    </Box>

                                    <Box mb={5}>
                                        <ReferralSystem
                                            share={this.state.share}
                                            global={this.props.app.global}
                                            onChange={this.onChangeShare}
                                        />
                                    </Box>

                                    <Box>
                                        <FormDocuments
                                            documents={documents}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                <Backdrop open={this.state.isSubmitForm} invisible={this.state.isSubmitForm}>
                    <CircularProgress size={ 80 } style={{ color: 'white' }}/>
                </Backdrop>
            </Box>
        );
    }
}

const styles = {
    root: {
        flex: 1,

        borderRadius: '5px 5px 0 0',
        backgroundColor: '#9889ba',

        padding: 65,
        paddingLeft: 75
    },

    container: {
        flex: 1,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 5,

        boxShadow: '0px 3px 4px rgba(168, 171, 184, 0.25)',

        backgroundColor: 'white',

        padding: '48px 65px'
    },
};

export default withStyles(styles)(OrganizationCoupon)
