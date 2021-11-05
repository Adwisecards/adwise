import React, {useEffect, useState} from 'react';
import {
    Box,
    Drawer,
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Logo,
    Control,
    MyCompany
} from './components';
import {compose} from "recompose";
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import clsx from "clsx";
import {
    setAccount,
    setOrganization
} from "../../../../AppState";
import {
    YourManagerCode as YourManagerCodeComponent
} from "../../../../components";

const Sidebar = (props) => {
    const {
        organization, account, isOpen,
        onChangeVisibleDrawer, setAccount, setOrganization,
        managerOrganizations, totalCountsSidebar
    } = props;

    const [isScreenSmall, setScreenSmall] = useState(false);

    useEffect(() => {
        setScreenSmall(document.documentElement.clientWidth <= 1399);
    }, []);

    const history = useHistory();
    const classes = useStyles();

    window.onresize = (event) => {
        let newScreenSmall = document.documentElement.clientWidth <= 1399;

        if (isScreenSmall !== newScreenSmall) {
            setScreenSmall(document.documentElement.clientWidth <= 1399);
        }
    }

    return (
        <Drawer
            anchor="left"
            variant={isScreenSmall ? 'temporary' : 'persistent'}

            classes={{
                paper: clsx({
                    [classes.drawer]: true,
                    [classes.drawerIsSmall]: isScreenSmall,
                })
            }}

            open={isScreenSmall ? isOpen : true}

            onClose={onChangeVisibleDrawer}
        >
            <div className={clsx(classes.root)}>
                <Logo {...account} organization={organization} setAccount={setAccount} setOrganization={setOrganization} managerOrganizations={managerOrganizations}/>

                <MyCompany {...history}/>

                <Control {...account} totalCountsSidebar={totalCountsSidebar}/>

                <Box flex={1}/>

                <YourManagerCodeComponent/>

            </div>
        </Drawer>
    )
}

const useStyles = makeStyles(() => ({
    drawer: {
        width: 270,

        backgroundColor: 'transparent',

        padding: '16px',

        border: 'none',

        marginTop: 51,
        height: 'calc(100% - 51px)'
    },
    drawerIsSmall: {
        marginTop: 0,

        height: '100%',

        backgroundColor: 'white'
    },

    root: {
        display: "flex",
        flexDirection: "column",
        flex: 1
    }
}));

export default compose(
    connect(
        state => ({
            account: state.app.account,
            organization: state.app.organization,
            totalCountsSidebar: state.app.totalCountsSidebar,
            managerOrganizations: state.app.managerOrganizations
        }),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account)),
            setOrganization: (account) => dispatch(setOrganization(account))
        })
    ),
)(Sidebar);
