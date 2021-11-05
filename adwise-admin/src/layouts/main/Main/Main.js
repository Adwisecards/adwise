import React, {Component} from "react";
import {
    Page,
    NotPermission
} from "../../../components";
import {
    TopBar
} from './components';
import {
    Box,
    Fab
} from '@material-ui/core';
import {
    withStyles
} from '@material-ui/styles';
import {
    ChevronUp as ChevronUpIcon
} from "react-feather";
import clsx from "clsx";
import { withRouter } from "react-router";
import {compose} from "recompose";
import {connect} from "react-redux";

const menuServicesGuest = [
    "/organizations",
    "/withdrawal-request",
    "/organization-change-requests",
    "/purchases",
    "/transactions",
    "/bank-payments",
];

class Layout extends Component {
    constructor(props) {
        super(props);

        const settings = localStorage.getItem('settings_system');

        this.state = {
            settingsSystem: !!settings ? JSON.parse(settings) : null,
            isShowButtonTop: false,
            isPermission: true
        };

        this.refMain = React.createRef();
    }

    componentDidMount = () => {
        this.onCheckRoute();
    }

    onCheckRoute = () => {
        if (!this.props.global.isAdminGuest) {
            return null
        }

        const currentPath = this.props.history.location.pathname;
        const isPermission = menuServicesGuest.filter((item) => {
           return item.indexOf(currentPath) > -1
        }).length > 0;

        this.setState({
            isPermission
        })
    }

    onScroll = ({ target }) => {
        if (target.scrollTop >= 3000 && !this.state.isShowButtonTop){
            this.setState({ isShowButtonTop: true })

            return null
        }
        if (target.scrollTop < 3000 && this.state.isShowButtonTop){
            this.setState({ isShowButtonTop: false })
        }
    }
    onScrollTop = () => {
        this.refMain.current.scrollTo(0, 0)
    }

    render() {
        const {classes, global} = this.props;
        const {isAdminGuest} = global;
        const {isPermission, settingsSystem, isShowButtonTop} = this.state;

        const isMinimalDisplay = (settingsSystem) ? settingsSystem.display === 'min' : true;

        return (
            <Page className={classes.page}>
                <Box
                    className={clsx({
                        [classes.root]: true,
                        [classes.shiftContent]: false
                    })}
                >
                    <TopBar
                        isAdminGuest={isAdminGuest}
                        onChangeVisibleDrawer={this.onChangeVisibleDrawer}
                    />

                    <main
                        ref={this.refMain}
                        className={clsx({
                            'main': true,
                            [classes.content]: true,
                            [classes.contentMinimal]: isMinimalDisplay,
                        })}

                        onScroll={this.onScroll}
                    >

                        {
                            isPermission ? (
                                <>{this.props.children}</>
                            ) : (
                                <NotPermission/>
                            )
                        }

                        {
                            isShowButtonTop && (
                                <Fab className={classes.fab} color="#8152E4" onClick={this.onScrollTop}>
                                    <ChevronUpIcon color="white"/>
                                </Fab>
                            )
                        }
                    </main>

                </Box>
            </Page>
        );
    }
}

const styles = {
    root: {
        flex: 1,
        paddingTop: 43,
        position: 'relative',
        maxWidth: 'calc(100vw - 8px)',

        marginBottom: -8
    },

    page: {
        display: 'flex',
    },

    shiftContent: {
        paddingLeft: 270
    },
    shiftContentSmallClose: {
        paddingLeft: 0
    },

    content: {
        overflow: 'auto',
        maxHeight: 'calc(100vh - 60px)',

        flex: 1,
        height: '100%',
        boxSizing: 'border-box',

        backgroundColor: 'white',

        borderRadius: '5px',

        padding: 40
    },
    contentMinimal: {
        padding: 20,

        '& .MuiTableCell-root': {
            padding: '4px 12px'
        },
        '& .MuiTableCell-body': {
            lineHeight: '14px'
        }
    },
    contentNoPadding: {
        padding: 0
    },

    contentDashboard: {
        padding: 0,
        backgroundColor: 'transparent',

        'overflow-x': 'hidden'
    },

    fab: {
        position: 'fixed',
        bottom: 48,
        right: 48,
        backgroundColor: '#8152E4'
    }
};

const AuthorizationStyles = withStyles(styles)(Layout);
const AuthorizationStylesHistory = withRouter(AuthorizationStyles);

export default compose(
    connect(
        state => ({
            global: state.global
        }),
        dispatch => ({}),
    ),
)(AuthorizationStylesHistory);
