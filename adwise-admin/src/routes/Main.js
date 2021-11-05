import React from 'react';
import {Switch, Redirect} from 'react-router-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';

import {
    Main as MainLayouts
} from '../layouts';

import {
    RouteWithLayout
} from '../components';

import {
    Dashboard as DashboardPage,
    Organizations as OrganizationsPage,
    Users as UsersPage,
    Categories as CategoriesPage,
    Tariff as TariffPage,
    Transactions as TransactionsPage,
    Purchases as PurchasesPage,
    Coupons as CouponsPage,
    Tasks as TasksPage,
    Documents as DocumentsPage,
    Settings as SettingsPage,
    WithdrawalRequest as WithdrawalRequestPage,
    OrganizationReferralTree as OrganizationReferralTreePage,
    BankPayments as BankPaymentsPage,
    SaleLicenses as SaleLicensesPage,
    UserSubscriptions as UserSubscriptionsPage,
    Tips as TipsPage,
    ChangeHistory as ChangeHistoryPage,
    Contacts as ContactsPage,
    ReferralChange as ReferralChangePage,
    PushNotifications as PushNotificationsPage,
    Logging as LoggingPage,
    SystemLogging as SystemLoggingPage,
    LoggingStdOut as LoggingStdOutPage,
    QuestionAnswer as QuestionAnswerPage,
    ReferralCodes as ReferralCodesPage,
    Language as LanguagePage,
    OrganizationChangeRequests as OrganizationChangeRequestsPage,
    Accumulations as AccumulationsPage,
    UsersReferralTree as UsersReferralTreePage,
    Invitations as InvitationsPage,
    Advantage as AdvantagePage,
    Partner as PartnerPage
} from '../pages';

const pagesMain = [
    {
        path: '/',
        component: DashboardPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/organizations',
        component: OrganizationsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/users',
        component: UsersPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/users/referral-tree/:id',
        component: UsersReferralTreePage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/categories',
        component: CategoriesPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/tariffs',
        component: TariffPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/transactions',
        component: TransactionsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/purchases',
        component: PurchasesPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/coupons',
        component: CouponsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/tasks',
        component: TasksPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/documents',
        component: DocumentsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/settings',
        component: SettingsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/withdrawal-request',
        component: WithdrawalRequestPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/organization/referral-tree/:organizationId',
        component: OrganizationReferralTreePage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/organization/referral-tree/:organizationId',
        component: OrganizationReferralTreePage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/bank-payments',
        component: BankPaymentsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/sale-licenses',
        component: SaleLicensesPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/user-subscriptions',
        component: UserSubscriptionsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/tips',
        component: TipsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/change-history',
        component: ChangeHistoryPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/contacts',
        component: ContactsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/referral-change',
        component: ReferralChangePage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/push-notifications',
        component: PushNotificationsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/logging',
        component: LoggingPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/system-logging',
        component: SystemLoggingPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/logging-std-out',
        component: LoggingStdOutPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/question-answer',
        component: QuestionAnswerPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/referral-codes',
        component: ReferralCodesPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/language',
        component: LanguagePage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/organization-change-requests',
        component: OrganizationChangeRequestsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/accumulations',
        component: AccumulationsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/invitations',
        component: InvitationsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/invitations',
        component: InvitationsPage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/advantage',
        component: AdvantagePage,
        exact: true,
        layout: MainLayouts
    },
    {
        path: '/partner',
        component: PartnerPage,
        exact: true,
        layout: MainLayouts
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
