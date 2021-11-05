import React from 'react'
import {Switch, Redirect} from 'react-router-dom'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import { useLocation } from 'react-router-dom';

import {RouteWithLayout} from '../components'
import {
    NotFound as NotFoundView,

    ManagerAbout as ManagerAboutView,

    Privacy as PrivacyView,
    UserAgreement as UserAgreementView,
    CrmAgreement as CrmAgreementView,
    DistributorAgreement as DistributorAgreementView,

    Feedback as FeedbackView,
    PersonalArea as PersonalAreaView,
    QuestionAnswer as QuestionAnswerView,
    Notifications as NotificationsView
} from '../pages'
import {DocumentLayout, Main, NotFoundLayout, MainManager, MainOrganization} from '../layouts'

const pagesMain = [
    {
        path: '/not-found',
        component: NotFoundView,
        exact: true,
        layout: NotFoundLayout,
    },

    {
        path: '/',
        component: ManagerAboutView,
        exact: true,
        layout: MainManager,
    },

    {
        path: '/privacy-policy',
        component: PrivacyView,
        exact: true,
        layout: DocumentLayout,
    },
    {
        path: '/user-agreement',
        component: UserAgreementView,
        exact: true,
        layout: DocumentLayout,
    },
    {
        path: '/crm-agreement',
        component: CrmAgreementView,
        exact: true,
        layout: DocumentLayout,
    },
    {
        path: '/distributor-agreement',
        component: DistributorAgreementView,
        exact: true,
        layout: DocumentLayout,
    },

    {
        path: '/feedback',
        component: FeedbackView,
        exact: true,
        layout: MainManager,
    },

    {
        path: '/personal-area',
        component: PersonalAreaView,
        exact: true,
        layout: MainManager,
    },
    {
        path: '/question-answer',
        component: QuestionAnswerView,
        exact: true,
        layout: MainManager,
    },
    {
        path: '/notifications',
        component: NotificationsView,
        exact: true,
        layout: MainManager,
    },
]

const MainRoutes = (props) => {
    const location = useLocation();

    const urlsRedirectHome = [
        '/registration-account',
        '/registration-confirmation',
        '/registration-company',
        '/password-reset'
    ];

    return (
        <Switch>
            {pagesMain.map((page, idx) => (
                <RouteWithLayout key={'page-' + idx} {...page} />
            ))}

            { urlsRedirectHome.indexOf(location.pathname) > -1 && ( <Redirect to="/"/> ) }

            <Redirect to="/not-found"/>
        </Switch>
    )
}

export default compose(
    connect(
        (state) => ({}),
        (dispatch) => ({})
    )
)(MainRoutes)
