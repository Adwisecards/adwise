import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {actions} from '../../../store';
import {useHistory} from 'react-router-dom';
import {rootReducer} from '../../../store/';
import checkIsApp from "../../../helper/checkIsApp";
import {openAccountPage} from "../../../helper/eventOpenApp";
// import {
//     openCompanyPage
// } from '../../../helper/eventOpenApp';
// import checkIsApp from "../../../helper/checkIsApp";
import "./classes.css";
import {loggingLogEventWithProperties} from "../../../helper/Logging";
import moment from "moment";

const CustomSubscribe = props =>{
    const {
        color, logo, organization, name, briefDescription,
        qrcode, user, match, error, id, subscribeToUser, location
    } = props;
    const [subscribed, setSubscribed] = useState(false);
    const [isApp, setIsApp] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (!user) return;

        if (user.contacts[0].contacts.find(s => s == match.params.id)) {
            setSubscribed(true);
        } else {
            setSubscribed(false);
        }
    }, [user]);
    useEffect(() => {
        const check = checkIsApp();

        setIsApp(check);
    }, []);

    const onSubscribe = async () => {
        if (isApp) {
            openAccountPage({
                userId: match.params.id
            })
        }

        if (!user) {
            history.push(`/sign-up?next=${location.pathname}`);
            return null
        }
        const body = {
            from: user.contacts[0]._id,
            to: match.params.id
        };
        const [data, error] = await subscribeToUser(body)

        if (!error) {
            await loggingLogEventWithProperties('user-subscribed-invitation-cutaway', {
                ...body,
                url: window.location.href,
                date: moment().format('DD.MM.YYYY HH:mm:ss')
            })
        }
        if (error) {
            await loggingLogEventWithProperties('user-subscribed-invitation-cutaway', {
                ...body,
                ...error,
                url: window.location.href,
                date: moment().format('DD.MM.YYYY HH:mm:ss')
            })
            return;
        }

    };

    const isUserImage = Boolean(logo);

    return (
        <div className="container-user">
            <div className="container__left">

                <div className="user-logo" style={{ borderColor: color, padding: (isUserImage) ? 3 : 0 }}>
                    {
                        isUserImage ? (
                            <img src={ logo }/>
                        ) : (
                            <svg width="100%" height="100%" viewBox="0 0 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M68.4982 135.536C105.407 135.536 135.327 105.57 135.327 68.6044C135.327 31.6393 105.407 1.67322 68.4982 1.67322C31.5894 1.67322 1.66895 31.6393 1.66895 68.6044C1.66895 105.57 31.5894 135.536 68.4982 135.536Z" fill="white"/>
                                <path d="M58.0585 16.3144C95.0234 16.3144 124.888 46.2243 124.888 83.2457C124.888 94.5403 122.173 105.207 117.161 114.411C128.438 102.488 135.33 86.3831 135.33 68.6044C135.33 31.5831 105.466 1.67322 68.5006 1.67322C42.8131 1.67322 20.467 16.1053 9.39844 37.4396C21.5112 24.2625 38.8451 16.3144 58.0585 16.3144Z" fill={ color } fillOpacity="0.4"/>
                                <path d="M68.5017 135.535C88.3416 135.535 106.302 126.751 118.415 112.946C117.371 105.835 111.941 99.9782 104.631 98.7233L90.6389 96.2134C89.8035 96.0042 88.7593 95.795 87.9239 95.3767H48.6618C47.8264 95.795 46.991 96.0042 45.9468 96.2134L31.9544 98.7233C24.645 99.9782 19.2151 105.835 18.1709 112.946C30.7014 126.751 48.4529 135.535 68.5017 135.535Z" fill={ color } fillOpacity="0.4"/>
                                <path d="M71.6327 125.077C87.9223 122.149 103.377 114.619 110.477 100.815C108.598 99.5599 107.136 99.1416 104.838 98.7233L90.8461 96.2134C90.0107 96.0042 88.9665 95.795 88.1311 95.3767H48.6601C47.8247 95.795 46.9894 96.0042 45.9452 96.2134L31.9528 98.7233C25.2698 99.7691 20.2576 104.789 18.5869 111.064C18.7958 111.273 19.0046 111.273 19.2134 111.482C33.6235 122.986 52.2104 128.633 71.6327 125.077Z" fill="white"/>
                                <path d="M68.5008 137C49.0786 137 30.2828 128.634 17.3347 113.992C17.1258 113.574 16.917 113.156 16.917 112.737C17.9612 104.789 24.0176 98.5146 31.9536 97.2596L45.946 94.7497C46.7813 94.5406 47.4079 94.3314 48.2432 94.1222C48.4521 94.1222 48.6609 93.9131 48.8697 93.9131H88.3408C88.5496 93.9131 88.7585 93.9131 88.9673 94.1222C89.5938 94.5406 90.4292 94.7497 91.2646 94.7497L105.257 97.2596C113.193 98.7238 119.04 104.789 120.294 112.737C120.294 113.156 120.294 113.574 119.876 113.992C106.51 128.634 87.9231 137 68.5008 137ZM20.0496 112.528C32.5801 126.124 50.1228 133.863 68.5008 133.863C86.8789 133.863 104.422 126.124 116.743 112.528C115.49 106.254 110.687 101.443 104.422 100.397L90.4292 97.8871C89.5938 97.678 88.5496 97.4688 87.7143 97.0505H49.0786C48.2432 97.4688 47.4079 97.678 46.3636 97.8871L32.3713 100.397C26.106 101.443 21.3027 106.254 20.0496 112.528Z" fill={ color }/>
                                <path d="M56.3853 82.4095L54.9234 88.0569C54.0881 91.4034 51.7908 94.1225 48.6582 95.5866L68.2893 109.81L87.9204 95.5866C84.7878 94.1225 82.4905 91.4034 81.6552 88.0569L80.1933 82.4095H56.3853Z" fill="white"/>
                                <path d="M78.3157 102.698L88.1313 95.5866C84.9987 94.1225 82.7014 91.4034 81.866 88.0569L80.4041 82.4095H70.1709L72.677 92.6584C73.7212 96.6324 75.6008 99.979 78.3157 102.698Z" fill={ color } fillOpacity="0.4"/>
                                <path d="M68.5012 111.273C68.0835 111.273 67.8747 111.273 67.6658 111.064L48.0347 96.841C47.617 96.4227 47.4082 96.0044 47.4082 95.3769C47.4082 94.7494 47.8259 94.3311 48.2436 94.122C50.9585 92.867 52.8381 90.5662 53.6734 87.638L55.1353 81.9907C55.3442 81.3632 55.9707 80.7357 56.5972 80.7357H80.614C81.2405 80.7357 81.8671 81.154 82.0759 81.9907L83.5378 87.638C84.1643 90.5662 86.2527 92.867 88.9677 94.122C89.3853 94.3311 89.803 94.7494 89.803 95.3769C89.803 96.0044 89.5942 96.4227 89.1765 96.841L69.5454 111.064C69.1277 111.273 68.71 111.273 68.5012 111.273ZM51.585 95.7952L68.5012 107.927L85.2085 95.7952C82.7024 94.122 81.0317 91.612 80.1963 88.4746L79.1521 84.0823H57.6414L56.5972 88.4746C55.7619 91.4029 54.0911 93.9128 51.585 95.7952Z" fill={ color }/>
                                <path d="M92.0993 59.6106C92.0993 75.716 81.4483 88.6839 68.2913 88.6839C55.1343 88.6839 44.4834 75.716 44.4834 59.6106C44.4834 43.5053 55.1343 35.1389 68.2913 35.1389C81.4483 35.1389 92.0993 43.5053 92.0993 59.6106Z" fill="white"/>
                                <path d="M68.5006 35.1389C66.4122 35.1389 64.3238 35.3481 62.2354 35.7664C72.2597 38.0672 79.778 46.2244 79.778 59.6106C79.778 72.9969 72.2597 84.2915 62.2354 87.6381C64.3238 88.2656 66.4122 88.6839 68.5006 88.6839C81.6576 88.6839 92.3085 75.716 92.3085 59.6106C92.0997 43.5053 81.4488 35.1389 68.5006 35.1389Z" fill={ color } fillOpacity="0.4"/>
                                <path d="M68.5005 90.1482C54.5081 90.1482 43.2307 76.3436 43.2307 59.6108C43.0218 43.9238 53.2551 33.4658 68.5005 33.4658C83.7459 33.4658 93.7703 43.9238 93.7703 59.6108C93.7703 76.3436 82.284 90.1482 68.5005 90.1482ZM68.5005 36.6032C54.9258 36.6032 46.3633 45.5971 46.3633 59.6108C46.3633 74.6703 56.3877 87.0108 68.5005 87.0108C80.6133 87.0108 90.6377 74.6703 90.6377 59.6108C90.6377 45.5971 81.8664 36.6032 68.5005 36.6032Z" fill={ color }/>
                                <path d="M68.2913 53.1269C58.4758 49.5712 50.1221 50.4078 45.5276 51.6628C44.9011 53.9635 44.4834 56.6826 44.4834 59.6109C44.4834 75.7162 55.1343 88.6841 68.2913 88.6841C81.4483 88.6841 92.0993 75.7162 92.0993 59.6109C92.0993 57.5193 91.8904 55.6368 91.6816 53.9635C86.2517 55.2185 77.2715 56.4735 68.2913 53.1269Z" fill="white"/>
                                <path d="M91.6808 53.7539C89.1747 54.3814 86.0421 55.0089 82.4918 55.218C82.7006 56.6821 82.7006 58.1463 82.7006 59.6104C82.7006 72.3692 76.6442 83.4546 67.6641 88.4745C67.8729 88.4745 68.0817 88.4745 68.2906 88.4745C81.4476 88.4745 92.0985 75.5065 92.0985 59.4012C92.0985 57.5188 92.0985 55.6363 91.6808 53.7539Z" fill={ color } fillOpacity="0.4"/>
                                <path d="M68.4993 90.1485C54.5069 90.1485 43.2295 76.3439 43.2295 59.6111C43.2295 56.6829 43.6472 53.9638 44.2737 51.2447C44.4825 50.6172 44.9002 50.1989 45.3179 50.1989C50.5389 48.9439 58.8926 48.1073 68.917 51.663C77.4795 54.8004 85.8332 53.7546 91.263 52.2905C91.6807 52.0813 92.0984 52.2905 92.5161 52.4997C92.9338 52.7088 93.1426 53.1271 93.1426 53.5455C93.5603 55.4279 93.7691 57.5195 93.7691 59.6111C93.7691 76.3439 82.2829 90.1485 68.4993 90.1485ZM46.9886 52.918C46.571 55.0096 46.3621 57.3103 46.3621 59.6111C46.3621 74.6706 56.3865 87.0111 68.4993 87.0111C80.6121 87.0111 90.6365 74.6706 90.6365 59.6111C90.6365 58.3561 90.6365 57.1012 90.4277 55.8462C84.5801 57.1012 76.2264 57.7287 67.8728 54.8004C59.1014 51.4539 51.792 51.8722 46.9886 52.918Z" fill={ color }/>
                            </svg>
                        )
                    }


                    <div className="user-logo-shadow" style={{ backgroundColor: color }}/>
                </div>

                <div
                    className="container__left-background"
                    style={{ opacity: 0.07, backgroundColor: color }}
                />
            </div>

            <div className="container-user__container">
                <div className="container__body">
                    <div className="user-title">
                        { name.split(' ')[0] || '' }
                        <br/>
                        { name.split(' ')[1] || '' }
                    </div>

                    <div className="user-role">{ briefDescription }</div>


                    {
                        subscribed ? (
                            <div
                                className="user-inforamtion-subscribe"
                                style={{ color: color}}
                            >Вы уже обменялись визитками</div>
                        ) : (
                            <div
                                className="user-button-receive"
                                style={{ backgroundColor: color }}
                                onClick={onSubscribe}
                            >Обменяться визитками</div>
                        )
                    }
                </div>
                <div className="container__right">
                    <div className="user-qr-code">
                        <img src={ qrcode }/>
                    </div>
                </div>
            </div>
        </div>
    )

    return(
        <div className='box box__subscribe box__business-card'>
            <div style={{backgroundColor: `${color}64`}} className='company__back-logo company__buisnessCard'>
                    <div
                    className={organization
                        ? 'background-logo backgound-logo__buisnessCard backgound-logo__buisnessCard_org'
                        : 'background-logo backgound-logo__buisnessCard'}
                    style={{borderColor: color}}>
                        {organization
                        ? (<div style={{display:'flex', position:'relative'}}>
                            <img src={organization.picture ? organization.picture : '/img/logoZagl.svg'} className='logo-org'/>
                            <img src={logo ? logo : '/img/face.svg'} className='logo-mini' style={{borderColor: color}}/>
                            </div>)
                        : <img src={logo ? logo : '/img/face.svg'}/> }
                    </div>
                        {organization ? <div className='buisnessCard__title'>{organization.name ? organization.name : null}</div>: null}
                        {organization ? <div className='buisnessCard__text'>{organization.briefDescription ? organization.briefDescription : null}</div>: null}
            </div>
            <div className='box__content_subscribe box__content_buisnessCard'>
                <h1 className='box__h1'>{name}</h1>
                <p className='box__p'>{briefDescription}</p>

                <button
                    disabled={subscribed}
                    // onClick={handleCheckInstallApp}
                    onClick={onSubscribe}
                    className='button button__subscribe'
                    style={{background: color}}
                >{!subscribed ? 'Подписаться' : 'Подписаны'}
                </button>
            </div>
            <img src={qrcode} alt="qr" className='box__qr'/>
            <div id="iframe-check-app" style={{display: 'none'}}/>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        subscribeToUser: (body) => dispatch(actions.user.subscribeToUser(body))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CustomSubscribe));
