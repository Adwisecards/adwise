import React, {Component} from 'react';
import {
    Box,
    Grid,
    IconButton,
    Typography,

    Tabs,
    Tab, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/styles";
import {
    MainForm
} from './form';
import {
    ArrowLeftCircle as ArrowLeftCircleIcon
} from "react-feather";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import getErrorMessage from "../../../helper/getErrorMessage";
import {store} from "react-notifications-component";
import alertNotification from "../../../common/alertNotification";


class OrganizationProductsCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: 'goods',

            products: {
                name: '',
                description: '',
                code: '',

                picture: null,

                disabled: false,
                price: 0
            },

            picture: null,

            isSubmittingForm: false
        }

        this.formMain = React.createRef();
        this.organizationId = this.props.organization._id;
    }

    componentDidMount = () => {}

    onChangeCategory = (event, category) => {
        this.setState({ category })
    }

    onChangePicture = (picture) => {
        this.setState({ picture })
    }

    onChangeForm = (products) => {
        this.formMain.current.setValues(products);
        this.setState({ products });
    }
    onSubmitForm = (form, event) => {
        this.setState({ isSubmittingForm: true })

        const body = this.getBodyForm(form);

        axiosInstance.post(urls["create-product"], body).then((response) => {
            this.updateOrganization()
        }).catch((error) => {
            const errorMessage = getErrorMessage(error);
            this.setState({isSubmittingForm: false});

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })

        })
    }
    getBodyForm = (form) => {
        let body = new FormData();

        body.append('name', form.name)
        body.append('description', form.description)
        body.append('disabled', form.disabled)
        body.append('price', form.price)
        body.append('code', form.code)
        body.append('organizationId', this.organizationId)
        body.append('type', this.state.category)

        if (this.state.picture){
            body.append('picture', this.state.picture)
        }

        return body
    }

    updateOrganization = () => {
        axiosInstance.get(urls["get-me-organization"]).then((response) => {
            this.setState({isSubmittingForm: false});

            alertNotification({
                title: 'Успешно',
                message: 'Товар создан',
                type: 'success',
            })

            this.props.setOrganization(response.data.data.organization);

            this.props.history.push('/products')
        })
    }

    goBack  = () => {
        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;

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
                            <Box mb={4}>
                                <Grid container spacing={3} alignItems={'center'}>
                                    <Grid item>
                                        <Typography variant={'h1'}>Новый</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Tabs value={this.state.category} onChange={this.onChangeCategory}>
                                            <Tab value={'goods'} label={'Товар'}/>
                                            <Tab value={'service'} label={'Услуга'}/>
                                        </Tabs>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box>
                                <MainForm
                                    setRef={this.formMain}

                                    products={this.state.products}
                                    picture={this.state.picture}

                                    onChangeForm={this.onChangeForm}
                                    onSubmitForm={this.onSubmitForm}
                                    onChangePicture={this.onChangePicture}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Backdrop open={this.state.isSubmittingForm} invisible={this.state.isSubmittingForm}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
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
        paddingLeft: 75,

        minHeight: 'calc(100vh - 60px)'
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

export default withStyles(styles)(OrganizationProductsCreate)
