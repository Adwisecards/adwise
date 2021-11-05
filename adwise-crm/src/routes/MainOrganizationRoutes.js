import React from 'react'
import {Switch, Redirect} from 'react-router-dom'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import { useLocation } from 'react-router-dom';

import {RouteWithLayout} from '../components'
import {
    NotFound as NotFoundView,
    Notifications as NotificationsView,
    OrganizationAbout as OrganizationAboutView,
    OrganizationCoupon as OrganizationCouponView,
    OrganizationCoupons as OrganizationCouponsView,
    OrganizationClients as OrganizationClientsView,
    OrganizationMaterials as OrganizationMaterialsView,
    OrganizationCreateShares as OrganizationCreateSharesView,
    OrganizationDocuments as OrganizationDocumentsView,
    OrganizationClientPage as OrganizationClientPageView,
    OrganizationEmployees as OrganizationEmployeesView,
    OrganizationTariffs as OrganizationTariffsView,
    OrganizationProducts as OrganizationProductsView,
    OrganizationOperations as OrganizationOperationsView,
    OrganizationBills as OrganizationBillsView,
    OrganizationBillCreate as OrganizationBillCreateView,
    OrganizationProductsCreate as OrganizationProductsCreateView,
    OrganizationEmployeesCreate as OrganizationEmployeesCreateView,
    PersonalArea as PersonalAreaView,
    Dashboard as DashboardView,
    СutawaysEmployees as СutawaysEmployeesView,
    СutawayCreate as СutawayCreateView,
    OrganizationEmployee as OrganizationEmployeeView,

    ManagerAbout as ManagerAboutView,

    Privacy as PrivacyView,
    UserAgreement as UserAgreementView,
    CrmAgreement as CrmAgreementView,
    DistributorAgreement as DistributorAgreementView,

    Feedback as FeedbackView,
    ApplicationForm as ApplicationFormView,
    AdwiseBusinessApp as AdwiseBusinessAppView,
    QuestionAnswer as QuestionAnswerView,
    OrganizationActs as OrganizationActsView,
    OrganizationPushNotifications as OrganizationPushNotificationsView,
    OrganizationCreatePushNotification as OrganizationCreatePushNotificationView
} from '../pages'
import {DocumentLayout, Main, MainOrganization, NotFoundLayout} from '../layouts'

const pagesMain = [
    {
        path: '/not-found',
        component: NotFoundView,
        exact: true,
        layout: NotFoundLayout,
    },
    {
        path: '/',
        component: DashboardView,
        exact: true,
        layout: MainOrganization,

        props: {
            dashboard: true
        }
    },
    {
        path: '/organization',
        component: OrganizationAboutView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/push-notifications',
        component: OrganizationPushNotificationsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/push-notifications/create',
        component: OrganizationCreatePushNotificationView,
        exact: true,
        layout: Main,
    },
    {
        path: '/clients',
        component: OrganizationClientsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/clients/:id',
        component: OrganizationClientPageView,
        exact: false,
        layout: MainOrganization,
    },
    {
        path: '/acts',
        component: OrganizationActsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/employees',
        component: OrganizationEmployeesView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/employee/:id',
        component: OrganizationEmployeeView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/employees/create',
        component: OrganizationEmployeesCreateView,
        exact: true,
        layout: MainOrganization,

        props: {
            noPadding: true,
        },
    },
    {
        path: '/materials',
        component: OrganizationMaterialsView,
        exact: true,
        layout: MainOrganization,
    },

    {
        path: '/personal-area',
        component: PersonalAreaView,
        exact: true,
        layout: MainOrganization,
    },

    {
        path: '/coupons',
        component: OrganizationCouponsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/coupons/:id',
        component: OrganizationCouponView,
        exact: true,
        layout: MainOrganization,
        props: {
            noPadding: true,
        }
    },
    {
        path: '/shares/create',
        component: OrganizationCreateSharesView,
        exact: true,
        layout: MainOrganization,

        props: {
            noPadding: true,
        },
    },
    {
        path: '/operations',
        component: OrganizationOperationsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/bills',
        component: OrganizationBillsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/bill/create',
        component: OrganizationBillCreateView,
        exact: false,
        layout: MainOrganization,
    },
    {
        path: '/documents',
        component: OrganizationDocumentsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/tariffs',
        component: OrganizationTariffsView,
        exact: true,
        layout: MainOrganization,
    },

    {
        path: '/products',
        component: OrganizationProductsView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/products/create',
        component: OrganizationProductsCreateView,
        exact: true,
        layout: MainOrganization,

        props: {
            noPadding: true,
        },
    },
    {
        path: '/cutaways',
        component: СutawaysEmployeesView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/cutaways/create',
        component: СutawayCreateView,
        exact: true,
        layout: MainOrganization,
        props: {
            noPadding: true,
        },
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
        path: '/feedback',
        component: FeedbackView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/application-form',
        component: ApplicationFormView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/adwise-business',
        component: AdwiseBusinessAppView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/question-answer',
        component: QuestionAnswerView,
        exact: true,
        layout: MainOrganization,
    },
    {
        path: '/notifications',
        component: NotificationsView,
        exact: true,
        layout: MainOrganization,
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
