import React from 'react';
import {Switch, Redirect} from 'react-router-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';

import {
    Authorization as AuthorizationLayouts
} from '../layouts';

import {
    RouteWithLayout
} from '../components';

import {
    Authorization as AuthorizationPage
} from '../pages';

const pagesMain = [
    {
        path: '/',
        component: AuthorizationPage,
        exact: true,
        layout: AuthorizationLayouts,

        props: {
            title: "Войти в аккаунт"
        }
    }
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

export default AuthorizationRoutes;
