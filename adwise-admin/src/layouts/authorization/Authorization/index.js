import React, {Component} from "react";
import {
    Box
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/styles";
import {
    Page
} from "../../../components";

class LayoutAuthorization extends Component {
    render() {
        const { classes } = this.props;

        return (
            <Page>

                <Box className={classes.root}>

                    <Box className={classes.container}>

                        <Box className={classes.logoContainer}>
                            <Box className={classes.logo}><img src="/source/svg/logos/logo-black.svg" /></Box>
                        </Box>

                        <Box className={ classes.content }>
                            { this.props.children }
                        </Box>

                        <Box className={ classes.containerPeople }>
                            <img src="/source/svg/people/people-login.svg" className="container-login__people"/>
                        </Box>

                    </Box>

                </Box>

            </Page>
        )
    }
}

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'center'
    },

    container: {
        display: 'flex',

        width: '100%',

        maxWidth: 1280,

        paddingTop: 40,
        paddingBottom: 40,

        position: 'relative',

        boxSizing: 'border-box'
    },

    logoContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'absolute',
        right: 'calc(100% + 24px)'
    },
    logo: {
        padding: 18,
        paddingLeft: 130,
        background: 'linear-gradient(270deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%)',
        borderRadius: 12
    },

    content: {
        maxWidth: 640,
        width: '100%',

        padding: 50,

        background: 'linear-gradient(180deg, #FFFFFF 7.52%, rgba(255, 255, 255, 0) 100%)',
        borderRadius: 12,

        overflow: 'hidden'
    },

    containerPeople: {
        marginLeft: -40
    },
    containerPeopleImage: {
        marginLeft: -24
    },
}

export default withStyles(styles)(LayoutAuthorization)