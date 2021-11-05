import React, {useEffect, useState} from 'react';
import {
    Drawer,
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {compose} from "recompose";
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import clsx from "clsx";

const Sidebar = (props) => {
    const {
        organization, account, isOpen,
        onChangeVisibleDrawer, setAccount, setOrganization,
        managerOrganizations
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
            </div>
        </Drawer>
    )
}

const useStyles = makeStyles((theme) => ({
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
        flex: 1
    }
}));

export default compose(
    connect(
        state => ({}),
        dispatch => ({})
    ),
)(Sidebar);
