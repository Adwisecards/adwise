import React, {Component} from "react";
import {
    Page
} from "../../components";
import {
    TopBar,
    Drawer
} from './components';
import {
    Box,
    Grid,
} from '@material-ui/core';
import {
    makeStyles,
    withStyles
} from '@material-ui/styles';
import clsx from "clsx";

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpenDrawer: false
        };
    }

    onChangeVisibleDrawer = () => {
        this.setState({
            isOpenDrawer: !this.state.isOpenDrawer
        })
    }

    render() {
        const {classes, classNameMain, noPadding, dashboard} = this.props;
        const isScreenSmall = document.documentElement.clientWidth <= 1399;

        return (
            <Page className={classes.page}>
                <Box
                    className={clsx({
                        [classes.root]: true,
                        [classes.shiftContent]: true,

                        [classes.shiftContentSmallClose]: isScreenSmall
                    })}
                >
                    <TopBar
                        onChangeVisibleDrawer={this.onChangeVisibleDrawer}
                    />

                    <Drawer
                        isOpen={this.state.isOpenDrawer}
                        onChangeVisibleDrawer={this.onChangeVisibleDrawer}
                    />

                    <main className={clsx({
                        'main': true,
                        [classes.content]: true,
                        [classes.contentNoPadding]: noPadding,
                        [classes.contentDashboard]: dashboard,
                        [classNameMain]: true
                    })}>
                        {this.props.children}
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

        backgroundColor: 'white',

        borderRadius: '5px',

        padding: 40
    },
    contentNoPadding: {
        padding: 0
    },

    contentDashboard: {
        padding: 0,
        backgroundColor: 'transparent',

        'overflow-x': 'hidden'
    }
};

export default withStyles(styles)(Layout)
