import React, {useState, useEffect} from 'react'
import {Link, withRouter} from 'react-router-dom';
import { Copy, Share } from '../../../icons'
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import {actions} from '../../../store';
import {rootReducer} from '../../../store/';
import {
    openCompanyCouponPage,
    openCompanyPage
} from '../../../helper/eventOpenApp';
import checkIsApp from "../../../helper/checkIsApp";
import {loggingLogEventWithProperties} from "../../../helper/Logging";
import moment from "moment";

const SpecialItem = (props) =>{
    const {match, name, id, description, quantity, initialQuantity,
        distributionSchema, offer, qrcode, price, user, organization, couponRef,
        error,subscribeToOrganization, location, coupon} = props
    const [subscribed, setSubscribed] = useState(false);
    const [isApp, setIsApp] = useState(false);
    const history = useHistory();
    const currency = {
        eur: '€',
        rub: '₽',
        usd: '$'
    }
    useEffect(() => {
        const couponId = match.params.id
        if (!organization || !user) return;

        if (user.contacts[0].coupons.find(c => c == couponId)) {
            setSubscribed(true);
        } else {
            setSubscribed(false);
        }
    }, [user, organization]);
    useEffect(() => {
        const check = checkIsApp();

        setIsApp(check);
    }, []);

    const handleCheckInstallApp = async () => {
        if (isApp) {
            const couponId = (!!coupon) ? coupon._id : '';
            const organizationId = (!!coupon) ? coupon.organization : '';
            const inviteId = (!!coupon && coupon.ref) ? coupon.ref.code : '';

            openCompanyCouponPage({
                couponId,
                organizationId,
                inviteId
            });

            setTimeout(async () => {
                await handleSubscribeCompany()
            }, 1000);

            return null
        }

        await handleSubscribeCompany()
    }
    const handleSubscribeCompany = async () => {
        if (!user) {
            history.push(`/sign-up?next=${location.pathname}`);

            return null
        }

        await onSubscribe();
    }
    const onSubscribe = async () => {
        const body = {
            contactId: user.contacts[0]._id
        };

        if (couponRef) {
            body.invitationId = couponRef.ref;
        }
        if (props.id){
            const [data, error] = subscribeToOrganization(id, body)
        } else {const [data, error] = await subscribeToOrganization(organization._id, body);}

        if (!error){
            await loggingLogEventWithProperties('user-subscribe-organization', {
                ref: couponRef?.code || '',
                companyId: props?.id || organization?._id || '',
                url: window.location.href,
                date: moment().format('DD.MM.YYYY HH:mm:ss')
            })
        }

        if (error) {
            return;
        }

    };

    return(
        <div className='box box-score box-special'>
            <div className='box-special-box'>
                <div className='box-special-box-df'>
                    <div className='box-special-header'>
                        <div className='box-special-title'>{name}</div>
                        <div className='box-special-desc'>{description}</div>
                    </div>
                    <div className='box-special-body'>
                        <div className='box-special-sum'>{!price ? 'Бесплатно' : `${price} ${offer? offer.currency? currency[offer.currency] : '' : ''}`}</div>

                        {offer && distributionSchema
                        ? <div className='box-special-schema'>
                            {offer.type === 'cashback' ? 'Кэшбэк' : 'Тип возврата не определён'} - {offer.percent}%, 1 ур. - {distributionSchema.first}%, 2-21 уровень {distributionSchema.other}%
                        </div>
                        : null}
                    </div>
                </div>
                <div className='box-special-qr-box'>
                    <div className='box-special-qr'>
                        <img src={qrcode} alt=""/>
                    </div>
                    <div className='box-special-qr-quantity'>
                        Использовано {initialQuantity-quantity} / {initialQuantity}
                    </div>
                </div>
            </div>
            <div className='box-special-buttons-box'>
                <button
                className='button'
                disabled={subscribed}
                onClick={handleCheckInstallApp}
                >{subscribed ? 'Получено': 'Получить'}</button>
                {/* <button className='button special-button'><Share/></button> */}
            </div>

        </div>
    )
}

const mapStateToProps = state => {
    return {
        organization: state.organization.organization,
        user: state.user.user,
        couponRef: state.organization.ref
    };
};

const mapDispatchToProps = dispatch => {
    return {
        subscribeToOrganization: (organizationId, body) => dispatch(actions.organization.subscribeToOrganization(organizationId, body))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SpecialItem));
