import React, {Component} from "react";
import {
    Box,
    Grid,
    Switch,
    Button,
    Backdrop,
    IconButton,
    Typography,
    CircularProgress
} from "@material-ui/core";
import {
    ChevronLeft as ChevronLeftIcon
} from "react-feather";
import {
    MainForm as MainFormComponent,
    SettingsForm as SettingsFormComponent,
    DocumentsForm as DocumentsFormComponent,
    ReferalForm as ReferalFormComponent,
    AdditionalForm as AdditionalFormComponent
} from "./components";
import * as Yup from "yup";
import {Formik} from "formik";
import moment from "moment";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import {getMediaFile, getMediaId} from "../../../common/media";
import {getAddressId} from "../../../common/address";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import alertNotification from "../../../common/alertNotification";
import currency from "../../../constants/currency";
import queryString from "query-string";

class OrganizationCreateShares extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coupon: {
                name: "",
                description: "",
                ageRestricted: "", // Возрастные органичения
                type: "",

                picture: null,
                termsDocumentMediaId: null,
                couponCategoryIds: [],

                disabled: false,
                floating: false, // Динамическая цена

                'distributionSchema.first': props?.organization?.distributionSchema?.first || 10,
                'distributionSchema.other': (props?.organization?.distributionSchema?.other || 0.5) * 20,
                offerPercent: props?.organization?.cashback || 10,
                quantity: 100,
                price: '',

                locationAddressId: props?.organization?.address?.placeId || '',

                startDate: moment(),
                endDate: moment().add(7, 'days'),
            },

            isShowBackdrop: false
        };

        this.refFormik = React.createRef();
    }

    componentDidMount = async () => {

        const urlSearch = this.props?.history?.location?.search || "";
        const urlSearchParse = queryString.parse(urlSearch);

        if (urlSearchParse?.base) {
            await this.onCreateCouponFromBase(urlSearchParse?.base || '');
        }

    }

    onCreateCouponFromBase = async (initialCouponId) => {

        await this.setState({isShowBackdrop: true});

        const coupon = await axiosInstance.get(`${ urls["get-coupon"] }${ initialCouponId }`).then((res) => {
            return res.data.data.coupon
        }).catch(() => {
            return null
        });

        if (!coupon) {

            await this.setState({isShowBackdrop: false});

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: "Купон не найден",
                type: "danger"
            })

            return null
        }

        let formCoupon = {
            ...this.state.coupon
        };

        formCoupon.name = coupon.name;
        formCoupon.description = coupon.description;
        formCoupon.quantity = coupon.quantity;
        formCoupon.offerSum = coupon.offerSum;
        formCoupon.price = coupon.price;
        formCoupon.type = coupon.type;
        formCoupon.startDate = new Date(coupon.startDate);
        formCoupon.endDate = new Date(coupon.endDate);
        formCoupon.ageRestricted = coupon.ageRestricted || '';
        formCoupon.couponCategoryIds = coupon.categories || [];
        formCoupon['distributionSchema.first'] = coupon.distributionSchema?.first || 10;
        formCoupon['distributionSchema.other'] = (coupon.distributionSchema?.other * 20) || 10;

        if (coupon.pictureMedia) {
            formCoupon.picture = await getMediaFile(coupon.pictureMedia);
        }
        if (coupon.termsDocumentMedia) {
            formCoupon.termsDocumentMediaId = await getMediaFile(coupon.termsDocumentMedia);
        }

        await this.setState({
            isShowBackdrop: false
        });

        this.onChangeCoupon(formCoupon);
    }

    // Функционал изменения формы
    onChangeCoupon = (coupon) => {
        this.refFormik.current?.setValues(coupon);
    }
    onChangeCouponItem = ({target}) => {
        const {name, value} = target;

        let coupon = this.refFormik.current?.values;
        coupon[name] = value;

        this.onChangeCoupon(coupon);
    }

    // Фунционал создания купона
    onCreateCoupon = async (form) => {
        await this.setState({isShowBackdrop: true});

        const body = await this.getBodyCoupon(form);

        const response = await axiosInstance.post(`${urls["create-coupon"]}`, body).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                error: error.response
            }
        });

        await this.setState({isShowBackdrop: false});

        if (response.error) {

            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization['coupons_create.notification.errorCreated'], {
                    error: response.error?.data?.error?.details || 'Ошибка сервера'
                }),
                type: "danger"
            })

            return null
        }

        alertNotification({
            title: allTranslations(localization.notificationSystemNotification),
            message: allTranslations(localization['coupons_create.notification.successCreated']),
            type: "success"
        })

        this.props.history.replace('/coupons');
    }
    getBodyCoupon = async (form) => {
        let body = {...form};

        body.offerType = "cashback";
        body.organizationId = this.props?.organization?._id || '';
        body.locationAddressId = await getAddressId(form.locationAddressId);
        body.endDate = moment(body.endDate).format('YYYY-MM-DD');
        body.startDate = moment(body.startDate).format('YYYY-MM-DD');
        body.distributionSchema = {
            first: Number.parseFloat(body['distributionSchema.first']),
            other: Number.parseFloat(body['distributionSchema.other']),
        }

        if (!!body.picture) {
            body.pictureMediaId = await getMediaId(body.picture)
        }
        if (!!body.termsDocumentMediaId) {
            body.termsDocumentMediaId = await getMediaId(body.termsDocumentMediaId)
        } else {
            delete body.termsDocumentMediaId;
        }
        if (!body.ageRestricted) {
            delete body.ageRestricted;
        }
        if (body.couponCategoryIds.length <= 0) {
            delete body.couponCategoryIds
        } else {
            body.couponCategoryIds = body.couponCategoryIds.map((t) => {
                return t._id
            });
        }

        delete body.picture;
        delete body['distributionSchema.first'];
        delete body['distributionSchema.other'];

        return body
    }


    // Навигационная логика
    _routeGoBack = () => {
        this.props.history.replace('/coupons');
    }

    render() {
        const {
            coupon,

            isShowBackdrop
        } = this.state;

        return (
            <Box bgcolor="#9887b7" py={5} px={10}>

                <Grid container spacing={2}>

                    <Grid item>

                        <IconButton onClick={this._routeGoBack} style={{
                            width: 50,
                            height: 50,
                            border: "1.5px solid #FFFFFF",
                            borderRadius: 999,
                            opacity: 0.5
                        }}>
                            <ChevronLeftIcon color="white" size={35}/>
                        </IconButton>

                    </Grid>

                    <Grid item xs={true}>

                        <Box px={8} py={6} bgcolor="white" borderRadius={8}>

                            <Formik
                                innerRef={this.refFormik}

                                initialValues={coupon}
                                validationSchema={validationSchema}
                                onSubmit={this.onCreateCoupon}
                            >
                                {(props) => {
                                    const {values, errors, touched, handleSubmit} = props;

                                    return (

                                        <>

                                            {/* Шапка страницы */}
                                            <Box mb={5}>

                                                <Grid container spacing={3} alignItems="center">

                                                    <Grid item>
                                                        <Typography variant="h3">
                                                            {allTranslations(localization['coupons_create.title'])}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item>
                                                        <Switch
                                                            color="primary"
                                                            name="disabled"
                                                            checked={!values.disabled}
                                                            onChange={() => this.onChangeCouponItem({
                                                                target: {
                                                                    name: 'disabled',
                                                                    value: !Boolean(values.disabled)
                                                                }
                                                            })}
                                                        />
                                                    </Grid>

                                                </Grid>

                                            </Box>

                                            {/* Тело страницы */}
                                            <Box mb={5}>

                                                <Grid container spacing={7}>

                                                    <Grid item xs={6}>

                                                        <Box mb={5}>

                                                            <MainFormComponent
                                                                values={values}
                                                                errors={errors}
                                                                touched={touched}

                                                                onChange={this.onChangeCoupon}
                                                            />

                                                        </Box>

                                                        <Box mb={5}>

                                                            <AdditionalFormComponent
                                                                values={values}
                                                                errors={errors}
                                                                touched={touched}

                                                                onChange={this.onChangeCoupon}
                                                            />

                                                        </Box>

                                                        <Box>

                                                            <ReferalFormComponent
                                                                values={values}
                                                                errors={errors}
                                                                touched={touched}

                                                                onChange={this.onChangeCoupon}
                                                            />

                                                        </Box>

                                                    </Grid>

                                                    <Grid item xs={6}>

                                                        <Box mb={5}>
                                                            <SettingsFormComponent
                                                                values={values}
                                                                errors={errors}
                                                                touched={touched}

                                                                onChange={this.onChangeCoupon}
                                                            />
                                                        </Box>

                                                        <Box>
                                                            <DocumentsFormComponent
                                                                values={values}
                                                                errors={errors}
                                                                touched={touched}

                                                                onChange={this.onChangeCoupon}
                                                            />
                                                        </Box>

                                                    </Grid>

                                                </Grid>

                                            </Box>

                                            <Box>
                                                <Button variant="outlined" onClick={handleSubmit}>
                                                    {allTranslations(localization['coupons_create.buttonSave'])}
                                                </Button>
                                            </Box>

                                        </>

                                    )

                                }}
                            </Formik>

                        </Box>

                    </Grid>

                </Grid>

                <Backdrop open={isShowBackdrop} invisible={isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </Box>
        )
    }
}

const validationSchema = Yup.object().shape({
    name: Yup.string().max(60).required(allTranslations(localization.yupValidationRequired)),
    description: Yup.string().max(200).required(allTranslations(localization.yupValidationRequired)),
    type: Yup.string().required(allTranslations(localization.yupValidationRequired)),
    locationAddressId: Yup.string().required(allTranslations(localization.yupValidationRequired)),
    quantity: Yup.number().min(1, allTranslations(localization.yupValidationMin, {count: 1})).required(allTranslations(localization.yupValidationRequired)),
    offerPercent: Yup.number().min(1, allTranslations(localization.yupValidationMin, {count: 1})).required(allTranslations(localization.yupValidationRequired)),
    'distributionSchema.first': Yup.number().min(1, allTranslations(localization.yupValidationMin, {count: 1})).max(25, allTranslations(localization.yupValidationMaxAmount, {count: 25})).required(allTranslations(localization.yupValidationRequired)),
    'distributionSchema.other': Yup.number().min(1, allTranslations(localization.yupValidationMin, {count: 1})).max(25, allTranslations(localization.yupValidationMaxAmount, {count: 25})).required(allTranslations(localization.yupValidationRequired)),
    price: Yup.number().required(allTranslations(localization.yupValidationRequired)).min(90, allTranslations(localization['coupons_create.validation.minimalPrice'], {minimal: `${90} ${currency.rub}`})).max(9007199254740991, allTranslations(localization.yupValidationMaxAmount, {count: 9007199254740991}))
});

export default OrganizationCreateShares
