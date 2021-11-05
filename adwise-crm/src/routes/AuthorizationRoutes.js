import React from 'react';
import {Switch, Redirect} from 'react-router-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';

import {
    SignUpStartLayout,
    SignUpStepLayout,

    RegistrationLayout,

    NotFoundLayout,

    DocumentLayout,
    MainLayout
} from '../layouts';

import {
    RouteWithLayout
} from '../components';

import {
    NotFound as NotFoundView,

    Authorization as AuthorizationView,

    RegistrationAccount as RegistrationAccountView,
    RegistrationEntryType as RegistrationEntryTypeView,
    RegistrationСonfirmationAccount as RegistrationСonfirmationAccountView,

    PasswordReset as PasswordResetView,

    Privacy as PrivacyView,
    UserAgreement as UserAgreementView,
    CrmAgreement as CrmAgreementView, DistributorAgreement as DistributorAgreementView,
} from '../pages';

const pagesMain = [
    {
        path: '/',
        component: AuthorizationView,
        exact: true,
        layout: SignUpStartLayout,

        props: {
            title: "Войти в аккаунт"
        }
    },

    {
        path: '/registration-account',
        component: RegistrationAccountView,
        exact: true,
        layout: RegistrationLayout,
    },
    {
        path: '/registration-entry-type',
        component: RegistrationEntryTypeView,
        exact: true,
        layout: MainLayout,
    },
    {
        path: '/registration-confirmation',
        component: RegistrationСonfirmationAccountView,
        exact: true,
        layout: RegistrationLayout,
    },

    {
        path: '/password-reset',
        component: PasswordResetView,
        exact: true,
        layout: RegistrationLayout,
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
        path: '/not-found',
        component: NotFoundView,
        exact: true,
        layout: NotFoundLayout
    },
]

const AuthorizationRoutes = (props) => {
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

export default compose(
    connect(
        state => ({}),
        dispatch => ({}),
    ),
)(AuthorizationRoutes);
