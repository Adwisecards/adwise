import React from 'react'
import {Switch, Redirect} from 'react-router-dom'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import { useLocation } from 'react-router-dom';

import {RouteWithLayout} from '../components'
import {
    NotFound as NotFoundView,
    RegistrationEntryType as RegistrationEntryTypeView
} from '../pages'
import {DocumentLayout, Main, NotFoundLayout, MainLayout} from '../layouts'

const pagesMain = [
    {
        path: '/not-found',
        component: NotFoundView,
        exact: true,
        layout: NotFoundLayout,
    },
    {
        path: '/',
        component: RegistrationEntryTypeView,
        exact: true,
        layout: MainLayout,

        props: {
            dashboard: true
        }
    },
]

const MainRoutes = (props) => {
    const location = useLocation();

    return (
        <Switch>
            {pagesMain.map((page, idx) => (
                <RouteWithLayout key={'page-' + idx} {...page} />
            ))}

            <Redirect to="/"/>
        </Switch>
    )
}

export default compose(
    connect(
        (state) => ({}),
        (dispatch) => ({})
    )
)(MainRoutes)
