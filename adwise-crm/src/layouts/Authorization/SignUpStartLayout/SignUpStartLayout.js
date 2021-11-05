import React, {Component} from "react";
import {
    Page
} from '../../../components';
import {
    withStyles
} from '@material-ui/styles';

import './index.scss';

class SignUpStartLayout extends Component {
    render() {
        const {classes} = this.props;

        return (
            <Page className={classes.root}>
                <div className="container">
                    <div className='container-login container-relative'>

                        <div className="container-login__content-logo">
                            <div className="container-login__logo">
                                <img src="/source/svg/logos/logo-black.svg" />
                            </div>
                        </div>

                        <div className="container-login__content">
                            { this.props.children }
                        </div>

                        <div className="container-login__container-people">
                            <img src="/source/svg/people/people-login.svg" className="container-login__people"/>
                        </div>

                    </div>
                </div>
            </Page>
        );
    }
}

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'center'
    }
}

export default withStyles(styles)(SignUpStartLayout)
