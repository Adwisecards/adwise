import React, {useState, useEffect} from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {LoadingStartSystem} from '../components';
import {setAccount, setIsAdminGuest} from '../globalStore';

import Authorization from './Authorization';
import Main from './Main';

const Routes = (props) => {
    useEffect(() => {
        if (props.account) {
            props.setAccount(props.account);
            props.setIsAdminGuest(props.account.adminGuest);
        }
    }, [props.account]);

    if (props.isLoading) {
        return <LoadingStartSystem/>
    }

    if (!!props.global.account) {
        return <Main/>
    }

    return <Authorization/>
};

export default compose(
    connect(
        state => ({
            global: state.global
        }),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account)),
            setIsAdminGuest: (isAdminGuest) => dispatch(setIsAdminGuest(isAdminGuest))
        }),
    ),
)(Routes);
