import React, { Component } from "react";
import {
    LoadingStartSystem,
    DialogWelcomeWindow,
    EngineeringWorksSystem
} from '../components';
import {compose} from "recompose";
import {connect} from "react-redux";
import {
    setAccount,
    setCountNotification,
    setGlobal,
    setOrganization,
    setShowRegistrationOrganization,
    setTotalCountsSidebar
} from "../AppState";
import {getLegalOrganization} from "../common/organizationLegal";
import {getFormFromBody} from "../legalForms/helpers";
import MainRoutes from "./MainRoutes";
import SettingsRoutes from "./SettingsRoutes";
import MainManagerRoutes from "./MainManagerRoutes";
import AuthorizationRoutes from "./AuthorizationRoutes";
import MainOrganizationRoutes from "./MainOrganizationRoutes";
import axiosInstance from "../agent/agent";
import queryString from "query-string";
import urls from "../constants/urls";

class Routes extends Component{
    constructor(props) {
        super(props);

        this.state = {

            isLoading: true,
            isTechnicalWorks: false


        };
    }

    componentDidMount = async () => {

        if ( process.env.REACT_APP_DEMO === "true" ) {
            await this.initStateDemo();

            return null
        }
        if ( window.location.pathname === '/auth_admin' ) {
            const searchString = window.location.search;
            const searchParams = queryString.parse(searchString);
            const authSessionUser = searchParams.auth_session_user;

            localStorage.setItem('jwt', authSessionUser);
            axiosInstance.defaults.headers['authentication'] = authSessionUser;

            window.location.href = '/';
        }

        await this.initState();
        await this.startBackgroundTask();

    }

    initState = async () => {

        const jwt = localStorage.getItem('jwt');
        if ( !jwt ) {

            await this.setState({ isLoading: false });

            return null
        }

        const account = await axiosInstance.get(urls["get-me"]).then((res) => {
            return res.data.data.user;
        }).catch((err) => {
            return null
        });
        if (!account) {

            await this.setState({ isLoading: false });

            return null
        }

        await this.props.setAccount(account);
        if (!account?.organization?._id) {

            await this.setState({ isLoading: false });

            return null
        }

        const initOrganization = await axiosInstance.get(urls["get-me-organization"]).then((res) => {
            return res.data.data.organization
        }).catch((err) => {
            return null
        });
        if (!initOrganization) {

            await this.setState({ isLoading: false });

            return null
        }

        const initLegal = await getLegalOrganization(initOrganization._id);
        const legal = {
            ...initLegal,
            info: getFormFromBody(initOrganization, initLegal)
        };

        const organization = {
            ...initOrganization,
            legal
        };
        await this.props.setOrganization(organization);

        await this.setState({ isLoading: false });

    }
    initStateDemo = async () => {
        const jwtInit = localStorage.getItem('jwt');
        if (Boolean(jwtInit)) {
            await this.initState();

            return null
        }

        const jwt = await axiosInstance.get(urls["get-demo-jwt"]).then((res) => {
            return res.data.data.jwt;
        });
        axiosInstance.defaults.headers['authentication'] = jwt;
        localStorage.setItem('jwt', jwt);

        await this.initState();
    }

    startBackgroundTask = async () => {
        await this.getGlobal();
        await this.getCountNotification();
        await this.getCountSidebar();
    }
    getGlobal = async () => {

        const global = await axiosInstance.get(urls["get-global"]).then((response) => {
            return  response.data.data.global;
        }).catch(() => {
            return null
        });

        this.props.setGlobal(global);

    }
    getCountNotification = async () => {
        const count = await axiosInstance.get(`${urls["get-notifications-count"]}/${ this.props?.global?.organization?._id }`).then((res) => {
            return res.data.data.count
        });
        this.props.setCountNotification(count);
    }
    getCountSidebar = async () => {
        const countClients = await axiosInstance.get(`${urls["get-clients"]}${this.props?.global?.organization?._id}?limit=1`).then((res) => {
            return res.data.data.count
        });
        const countPurchases = await axiosInstance.get(`${urls["get-purchases"]}${this.props?.global?.organization?._id}?limit=1`).then((res) => {
            return res.data.data.count
        });
        const countCoupons = await axiosInstance.get(`${urls["get-coupons"]}${this.props?.global?.organization?._id}?limit=1&all=1`).then((res) => {
            return res.data.data.count
        });

        const totalCountsSidebar = {
            countClients,
            countPurchases,
            countCoupons,
        };

        this.props.setTotalCountsSidebar(totalCountsSidebar);
    }

    _getComponent = () => {
        const { global } = this.props;
        const { isLoading, isTechnicalWorks } = this.state;

        if (isTechnicalWorks) {
            return EngineeringWorksSystem
        }
        if (isLoading) {
            return LoadingStartSystem
        }
        if (!isLoading && !global?.account?._id) {
            return AuthorizationRoutes
        }
        if (!isLoading && !global?.account?.role) {
            return SettingsRoutes
        }
        if (!isLoading && global?.account?.role === 'business') {
            return MainOrganizationRoutes
        }
        if (!isLoading && global?.account?.role === 'manager') {
            return MainManagerRoutes
        }

        return MainRoutes;
    }

    onCloseDialogWelcomeWindow = () => {
        this.props.setShowRegistrationOrganization(false);
    }

    render() {
        const { isShowRegistrationOrganization } = this.props.global;
        const Component = this._getComponent();

        return (
            <>

                <Component/>

                <DialogWelcomeWindow
                    isOpen={isShowRegistrationOrganization}
                    onClose={this.onCloseDialogWelcomeWindow}
                />

            </>
        )
    }
}

export default compose(
    connect(
        state => ({
            global: state.app
        }),
        dispatch => ({
            setGlobal: (global) => dispatch(setGlobal(global)),
            setAccount: (account) => dispatch(setAccount(account)),
            setCountNotification: (count) => dispatch(setCountNotification(count)),
            setOrganization: (organization) => dispatch(setOrganization(organization)),
            setTotalCountsSidebar: (totalCountsSidebar) => dispatch(setTotalCountsSidebar(totalCountsSidebar)),
            setShowRegistrationOrganization: (isShowRegistrationOrganization) => dispatch(setShowRegistrationOrganization(isShowRegistrationOrganization))
        }),
    ),
)(Routes);
