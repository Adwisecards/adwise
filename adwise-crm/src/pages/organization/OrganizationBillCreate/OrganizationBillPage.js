import React, { Component } from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    Backdrop,
    TextField,
    Typography,
    CircularProgress
} from "@material-ui/core";
import {
    ProductsSelected as ProductsSelectedComponent,
    ProductsDialogs as ProductsDialogsComponent,
    UsersSelected as UsersSelectedComponent,
    UsersDialogs as UsersDialogsComponent
} from "./components";
import alertNotification from "../../../common/alertNotification";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class OrganizationBillCreate extends Component{
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            clients: [],
            comment: "",

            openSelectedProducts: false,
            openSelectedClients: false,
            isShowBackdrop: false,
        }
    }

    componentDidMount = async () => {
    }

    onChangeProducts = (products) => {
        this.setState({ products });
    }
    onChangeClients = (clients) => {
        this.setState({ clients });
    }

    onCreateBill = async () => {
        await this.setState({ isShowBackdrop: true });

        const isValid = Boolean(this._getValidForm());

        if (!isValid) {
            await this.setState({ isShowBackdrop: false });

            return null
        }

        const body = this._getBody();

        const response = await axiosInstance.post(`${ urls["bills-create-purchase-clients"] }`, body).then((response) => {
            return response.data.data
        }).catch((error) => {
           return {
               error: error.response
           }
        })

        if (response.error) {

            await this.setState({ isShowBackdrop: false });

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization['bill_create.notification.errorCreateInvoice'], {error: response.error?.data?.error?.details}),
                type: "danger"
            })

            return null
        }

        alertNotification({
            title: allTranslations(localization.notificationSystemNotification),
            message: allTranslations(localization['bill_create.notification.invoiceSuccessfullyCreatedSent']),
            type: "success"
        })

        await this._clearForm();

        await this.setState({ isShowBackdrop: false });
    }


    _getValidForm = () => {
        const { products, clients } = this.state;
        const isEmptyPrice = products.find((product) => Boolean(!product.price || product.price <= 0));

        if (products.length <= 0) {

            alertNotification({
                title: allTranslations(localization['bill_create.notification.createInvoice']),
                message: allTranslations(localization['bill_create.notification.youMustSelectProduct']),
                type: "danger"
            })

            return false
        }
        if (isEmptyPrice) {

            alertNotification({
                title: allTranslations(localization['bill_create.notification.createInvoice']),
                message: allTranslations(localization['bill_create.notification.invalidPrice']),
                type: "danger"
            })

            return false
        }

        if (clients.length <= 0) {

            alertNotification({
                title: allTranslations(localization['bill_create.notification.createInvoice']),
                message: allTranslations(localization['bill_create.notification.userMustSelected']),
                type: "danger"
            })

            return false
        }

        return true
    }
    _getBody = () => {
        const { products, clients, comment } = this.state;
        const { organization } = this.props.app;

        const body = {
            cashierContactId: organization?.employees[0] || '',
            coupons: products.map((coupon) => {
                if (coupon.floating) {
                    return {
                        couponId: coupon._id,
                        count: coupon.count,
                        price: Number.parseFloat(coupon.price),
                    }
                }

                return {
                    couponId: coupon._id,
                    count: coupon.count
                }
            }),
            description: comment || allTranslations(localization['bill_create.purchaseFromCRM']),
            purchaserContactIds: clients.map((client) => client?.contact?._id),
            asOrganization: true
        };

        return body
    }
    _clearForm = async () => {
        await this.setState({
            products: [],
            clients: [],
            comment: ""
        })
    }

    render() {
        const {
            products,
            clients,
            comment,

            openSelectedProducts,
            openSelectedClients,

            isShowBackdrop
        } = this.state;

        return (
            <>

                <Box mb={5}>
                    <Typography variant="h1">{allTranslations(localization['bill_create.header.title'])}</Typography>
                </Box>

                <Box mb={8}>

                    <ProductsSelectedComponent
                        selected={products}
                        onChange={this.onChangeProducts}
                        onOpenSelected={() => this.setState({openSelectedProducts: true})}
                    />

                </Box>

                <Box mb={8}>

                    <UsersSelectedComponent
                        selected={clients}
                        onChange={this.onChangeClients}
                        onOpenSelected={() => this.setState({openSelectedClients: true})}
                    />

                </Box>

                <Box mb={8}>

                    <Typography variant="formTitle">{allTranslations(localization['bill_create.commentOrder'])}</Typography>

                    <TextField
                        value={comment}
                        placeholder={allTranslations(localization['bill_create.commentOrderPlaceholder'])}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        rows={2}
                        onChange={({target: {value: comment}}) => this.setState({comment})}
                    />

                </Box>

                <Box>
                    <Grid container>
                        <Grid item>
                            <Button variant="contained" onClick={this.onCreateBill}>{allTranslations(localization['bill_create.buttonCreateBill'])}</Button>
                        </Grid>
                    </Grid>
                </Box>

                <ProductsDialogsComponent
                    open={openSelectedProducts}
                    selected={products}
                    organizationId={this.props.app.organization._id}
                    onChange={this.onChangeProducts}
                    onClose={() => this.setState({openSelectedProducts: false })}
                />


                <UsersDialogsComponent
                    open={openSelectedClients}
                    selected={clients}
                    organizationId={this.props.app.organization._id}
                    onChange={this.onChangeClients}
                    onClose={() => this.setState({openSelectedClients: false })}
                />

                <Backdrop open={isShowBackdrop} invisible={isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        )
    }
}

export default OrganizationBillCreate
