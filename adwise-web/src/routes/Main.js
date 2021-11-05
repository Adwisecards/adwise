import React from 'react';
import {Switch, Redirect} from 'react-router-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';

import {
    Landing as LandingLayout,
    Pages as PagesLayout
} from '../layouts';

import {
    RouteWithLayout
} from '../components';
import CompanyCard from "../components/CompanyCard/CompanyCard";
import SpecialPage from "../components/SpecialPage";
import Refs from "../views/Refs/RefsContainer";
import ExtangeCard from "../components/ExchangeCard/ExtangeCard";
import PrivacyPolicy from "../views/PrivacyPolicy";
import CookiesPolicy from "../views/CookiesPolicy";
import DeliveryTerms from "../views/DeliveryTerms";
import PaymentSuccessful from "../views/PaymentSuccessful";
import PaymentFail from "../views/PaymentFail";
import UserAgrement from "../views/UserAgrement";
import AdvertisingAgreement from "../views/AdvertisingAgreement";
import BuisnessCard from "../components/BusinessCard";
import Contact from "../views/Contact/ContactContainer";
import Tips from "../views/Tips/TipsContainer";
import Purchase from "../views/Purchase/PurchaseContainer";
import ScorePage from "../components/ScorePage/Index";
import Lending from "../views/Lending";
import {
    NotFound as NotFoundView,
    QuestionAnswer as QuestionAnswerView,
    UsersStage as UsersStageView,
    BusinessStage as BusinessStageView
} from "../views";

const pagesMain = [
    {
        path: '/organization/:id/:ref?',
        component: CompanyCard,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/special/:id/:ref?',
        component: SpecialPage,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/ref/:ref?',
        component: Refs,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/sign-up',
        component: ExtangeCard,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/privacy-policy',
        component: PrivacyPolicy,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/cookies-policy',
        component: CookiesPolicy,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/delivery-terms',
        component: DeliveryTerms,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/successful-payment',
        component: PaymentSuccessful,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/fail-payment',
        component: PaymentFail,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/user-agreement',
        component: UserAgrement,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/advertising-agreement',
        component: AdvertisingAgreement,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/card/:id',
        component: BuisnessCard,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/contact-new/:id',
        component: Contact,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/tips/:id',
        component: Tips,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/purchase/:id',
        component: Purchase,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/order/:id/:ref?',
        component: ScorePage,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/not-found',
        component: NotFoundView,
        exact: true,
        layout: PagesLayout
    },
    {
        path: '/question-answer',
        component: QuestionAnswerView,
        exact: true,
        layout: LandingLayout
    },
    {
        path: '/users-stage',
        component: UsersStageView,
        exact: true,
        layout: LandingLayout
    },
    {
        path: '/business-stage',
        component: BusinessStageView,
        exact: true,
        layout: LandingLayout
    },
    {
        path: '/',
        component: Lending,
        exact: true,
        layout: LandingLayout
    },
    {
        component: NotFoundView,
        exact: true,
        layout: PagesLayout
    },
]

const MainRoutes = (props) => {
    return (
        <Switch>
            {
                pagesMain.map((page, idx) => (
                    <RouteWithLayout
                        key={'page-' + idx}
                        {...page}
                    />
                ))
            }

            <Redirect to="/"/>
        </Switch>
    );
};

export default MainRoutes;
