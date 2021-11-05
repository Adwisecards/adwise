import Dashboard from './Dashboard/DashboardContainer';

import RegisterHome from './Register/RegisterHome/RegisterHomeViewContainer';
import RegisterPhoneInput from './Register/RegisterPhoneInput/RegisterPhoneInputViewContainer';
import RegisterCodeConfirmation from './Register/RegisterCodeConfirmation/RegisterCodeConfirmationViewContainer';

import { ResetPasswordHome, ResetPasswordPhone, ResetPasswordCode } from './ResetPassword';

import SelectedCity from './SelectedCity/SelectedCityViewContainer';

import UserBusinessCard from './UserBusinessCard/UserBusinessCardViewContainer';

import PersonalBusinessCard from './PersonalBusinessCard/PersonalBusinessCardViewContainer';
import EditPersonalBusinessCard from './EditPersonalBusinessCard/EditPersonalBusinessCardViewContainer';

import Scheduler from './Scheduler/SchedulerViewContainer';
import SchedulerCreate from './SchedulerCreate/SchedulerCreateViewContainer';
import SchedulerInformation from './SchedulerInformation/SchedulerInformationViewContainer';

import WorkBusinessCard from './WorkBusinessCard/PersonalBusinessCardViewContainer';

import Account from './Account/AccountViewContainer';

import Contacts from './Contacts/ContactsViewContainer';

import Coupons from './Coupons/CouponsViewContainer';
import CouponPage from './CouponPage/CouponPageViewContainer';

import Favorites from './Favorites/FavoritesViewContainer';

import Profile from './Profile/ProfileViewContainer';
import ProfileEdit from './ProfileEdit/ProfileEditViewContainer';

import AboutApp from './AboutApp/AboutAppViewContainer';

import Feedback from './Feedback/FeedbackViewContainer';

import Certificates from './Certificates/CertificatesViewContainer';

import MyConnection from './MyConnection/MyConnectionViewContainer';

import MyRecommendation from './MyRecommendation/MyRecommendationViewContainer';

import Search from './Search/SearchViewContainer';

import CouponsAll from './CouponsAll/CouponsAllViewContainer';
import CouponsDisabled from './CouponsDisabled/CouponsDisabledViewContainer';

import Message from './Message/MessageViewContainer';
import BusinessCardAllContact from './BusinessCardAllContact/BusinessCardAllContactViewContainer';

import BusinessCardAllRecommendation from './BusinessCardAllRecommendation/BusinessCardAllRecommendationViewContainer';

import UserChat from "./UserChat/UserChatViewContainer";

import {
    PersonalExchaner,
    PersonalAcceptOffer,
    OrganizationExchaner
} from './InformationWhenExchanging';

import {
    CutawayUserInformation,
} from './СutawayUser';

import {
    CompanyMap,
    CompanyHome,
    AboutCompany,
    ShareCompany,
    CompanyPageMain,
    ContactsCompany,
    OpenShareCompany,
    UsersCompanyPages,
    OrganizationAllCoupons,
    CreateMultiplePurchase,
    OrganizationCouponsCategory
} from './CompanyPages';

import {
    FinanceHome,
    ReferralProgram,
    FinancialSection,
    ReferralNetwork,
    FinanceAllHistory,
    ReferralNetworkMember,
    AllUsersReferralProgram
} from './Finance';

import {
    MyPayments,
    PaymentPurchase,
    MyPaymentsArchive,
    PaymentPurchaseYandexKassa
} from './Payments';

import {
    LegalInformationTermsUse,
    LegalInformationHome,
    LegalInformationCookie,
    LegalInformationPricavy
} from './LegalInformation';

import HistoryChangeApp from "./HistoryChangeApp/HistoryChangeAppViewContainer";

import PersonalBusinessCardWallet from "./PersonalBusinessCardWallet/PersonalBusinessCardWalletViewContainer";

export { default as CitySelection } from "./CitySelection/CitySelectionViewContainer";
export {  } from "./_about";
export { Login } from "./_authorization";
export {  } from "./_coupons";
export {  } from "./_cutaway";
export {  } from "./_finance";
export {  } from "./_orders";
export {  } from "./_registration";
export { StartScreen, LanguageSelection } from "./_start-screen";
export {
    Settings,
    ChangePassword,
    SettingPushNotification
} from "./settings";
export { default as FeedbackPage } from "./FeedbackPage/FeedbackPageViewContainer";

export {
    Coupons,
    CouponPage,

    Account,

    Contacts,

    Favorites,

    Feedback,

    AboutApp,

    Search,

    Message,

    Certificates,

    Profile,
    ProfileEdit,

    Scheduler,
    SchedulerCreate,
    SchedulerInformation,

    Dashboard,

    RegisterHome,
    RegisterPhoneInput,
    RegisterCodeConfirmation,

    ResetPasswordHome,
    ResetPasswordPhone,
    ResetPasswordCode,

    SelectedCity,

    MyConnection,
    MyRecommendation,

    UserBusinessCard,

    PersonalBusinessCard,
    EditPersonalBusinessCard,

    PersonalExchaner,
    PersonalAcceptOffer,
    OrganizationExchaner,

    CutawayUserInformation,

    CompanyMap,
    CompanyHome,
    CompanyPageMain,
    ContactsCompany,
    AboutCompany,
    ShareCompany,
    UsersCompanyPages,
    OpenShareCompany,
    OrganizationAllCoupons,
    CreateMultiplePurchase,
    OrganizationCouponsCategory,

    FinanceHome,
    ReferralNetwork,
    ReferralProgram,
    FinancialSection,
    FinanceAllHistory,
    ReferralNetworkMember,
    AllUsersReferralProgram,

    MyPayments,
    PaymentPurchase,
    MyPaymentsArchive,
    PaymentPurchaseYandexKassa,

    PersonalBusinessCardWallet,

    WorkBusinessCard,

    LegalInformationTermsUse,
    LegalInformationHome,
    LegalInformationCookie,
    LegalInformationPricavy,

    BusinessCardAllContact,
    BusinessCardAllRecommendation,

    CouponsAll,
    CouponsDisabled,

    HistoryChangeApp,

    UserChat
}
