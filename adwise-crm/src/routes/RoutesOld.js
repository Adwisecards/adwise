import React, {useState, useEffect} from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';

import MainRoutes from './MainRoutes';
import MainManagerRoutes from './MainManagerRoutes';
import MainOrganizationRoutes from './MainOrganizationRoutes';
import AuthorizationRoutes from './AuthorizationRoutes';
import SettingsRoutes from "./SettingsRoutes";

import {
    setAccount,
    setOrganization,
    setGlobal,
    setManagerOrganizations,
    setTotalCountsSidebar,
    setShowRegistrationOrganization, setCountNotification
} from '../AppState';
import {
    LoadingStartSystem,
    EngineeringWorksSystem, DialogWelcomeWindow, DialogUpdateRequisites
} from '../components';
import axiosInstance from "../agent/agent";
import urls from "../constants/urls";
import queryString from "query-string";
import {useHistory} from "react-router-dom";
import {getLegalOrganization} from "../common/organizationLegal";
import {
    getBodyFromForm, getFormFromBody

} from "../legalForms/helpers";

const Routes = (props) => {
    const {app, setOrganization, setAccount, setGlobal, setShowRegistrationOrganization} = props;
    const { isShowRegistrationOrganization } = app;

    const [isLoading, setIsLoading] = useState(true);
    const [isEngineeringWorks, setEngineeringWorks] = useState(false);
    const [isShowDialogUpdateRequisites, setShowDialogUpdateRequisites] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (process.env.REACT_APP_DEMO === "true") {
            (async () => {
                await handleStartDemo();
            })();

            return null
        }

        const pathname = window.location.pathname;
        if (pathname === "/auth_admin") {
            handleAuthUserFromAdmin();

            return null
        }
        handleCheckUser()
    }, []);

    const handleStartDemo = async () => {
        const jwtInit = localStorage.getItem('jwt');
        if (Boolean(jwtInit)) {
            handleCheckUser();

            return null
        }

        const jwt = await axiosInstance.get(urls["get-demo-jwt"]).then((res) => {
            return res.data.data.jwt;
        });
        axiosInstance.defaults.headers['authentication'] = jwt;
        localStorage.setItem('jwt', jwt);
        handleCheckUser();
    }

    const handleAuthUserFromAdmin = () => {
        const searchString = history.location.search;
        const searchParams = queryString.parse(searchString);
        const authSessionUser = searchParams.auth_session_user;

        localStorage.setItem('jwt', authSessionUser);
        axiosInstance.defaults.headers['authentication'] = authSessionUser;

        history.replace('/')

        handleGetMe();
    }

    const handleCheckUser = () => {
        const jwt = localStorage.getItem('jwt');

        if (!jwt) {
            setIsLoading(false);

            return null
        }

        handleGetMe();

        handleUpdateGlobal()
    }
    const handleGetMe = () => {
        axiosInstance.get(urls["get-me"]).then((response) => {
            const user = response.data.data.user;

            setAccount(user);

            if (!!user.organization) {
                (async () => {
                    await handleSetCountSidebar(user.organization._id);
                    await handleLoadOrganizatino(user)
                })();
            } else {
                setIsLoading(false);
            }
        }).catch((error) => {
            setIsLoading(false);
            localStorage.removeItem('jwt');
        })
    }
    const handleLoadOrganizatino = async () => {

        let organization = await axiosInstance.get(urls["get-me-organization"]).then((res) => {
            return res.data.data.organization
        }).catch(() => {
            return null
        })

        if (!organization) {
            setIsLoading(false);

            return null
        }

        const legal = await getLegalOrganization(organization?._id);
        organization.legal = {
            ...legal,
            info: getFormFromBody(organization, legal)
        };

        setOrganization(organization);

        await handleCheckOldOrganization(organization);
        await handleGetNotificationCount(organization._id);

        setIsLoading(false);
    }
    const handleSetCountSidebar = async (organizationId) => {
        const countClients = await axiosInstance.get(`${urls["get-clients"]}${organizationId}?limit=1`).then((res) => {
            return res.data.data.count
        });
        const countPurchases = await axiosInstance.get(`${urls["get-purchases"]}${organizationId}?limit=1`).then((res) => {
            return res.data.data.count
        });
        const countCoupons = await axiosInstance.get(`${urls["get-coupons"]}${organizationId}?limit=1&all=1`).then((res) => {
            return res.data.data.count
        });

        const totalCountsSidebar = {
            countClients,
            countPurchases,
            countCoupons,
        };

        props.setTotalCountsSidebar(totalCountsSidebar);
    }
    const handleCheckOldOrganization = async (organization) => {
        const isShowDialogChangeRequisites = localStorage.getItem('show_dialog_change_requisites');

        if (!!isShowDialogChangeRequisites) {
            return null
        }

        const isDocument = Boolean(organization?.application || false);
        const isActive = Boolean(organization?.disabled || true);
        const isShopId = Boolean(organization?.paymentShopId || false);

        const isShowInformation = Boolean(isDocument && isActive && isShopId);

        localStorage.setItem('show_dialog_change_requisites', 'true');


        setShowDialogUpdateRequisites(isShowInformation)
    }
    const handleGetNotificationCount = async (organizationId) => {
        const count = await axiosInstance.get(`${urls["get-notifications-count"]}/${ organizationId }`).then((res) => {
            return res.data.data.count
        });
        props.setCountNotification(count);
    }

    const handleUpdateGlobal = () => {
        axiosInstance.get(urls["get-global"]).then((response) => {
            const global = response.data.data.global;

            setGlobal(global);
            setEngineeringWorks(global.technicalWorks);
        }).catch(() => {
            setIsLoading(false);
        })
    }

    const isAccount = (!!app.account) ? !!app.account._id : false;
    const isAccountRole = (!!app.account) ? !!app.account.role : false;
    const accountRole = (!!app.account) ? app.account.role || '' : '';
    const isCompany = (!!isAccount) ? (!!app.account.organization) ? !!app.organization._id : true : false;

    let Routes = MainRoutes;

    if (isEngineeringWorks) {
        return (
            <>
                <EngineeringWorksSystem/>
            </>
        )
    }

    if (isLoading) {
        return (
            <>
                <LoadingStartSystem/>
            </>
        )
    }

    if (!isAccount || !isCompany) {
        return <AuthorizationRoutes/>
    }
    if (!isAccountRole) {
        return (
            <SettingsRoutes/>
        )
    }
    if (accountRole === 'business') {
        Routes =  MainOrganizationRoutes;
    }
    if (accountRole === 'manager') {
        Routes = MainManagerRoutes
    }

    return (
        <>
            <Routes/>

            <DialogWelcomeWindow
                isOpen={isShowRegistrationOrganization}
                onClose={() => setShowRegistrationOrganization(false)}
            />
        </>
    )
};

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account)),
            setOrganization: (organization) => dispatch(setOrganization(organization)),
            setCountNotification: (count) => dispatch(setCountNotification(count)),
            setGlobal: (global) => dispatch(setGlobal(global)),
            setManagerOrganizations: (managerOrganizations) => dispatch(setManagerOrganizations(managerOrganizations)),
            setTotalCountsSidebar: (totalCountsSidebar) => dispatch(setTotalCountsSidebar(totalCountsSidebar)),
            setShowRegistrationOrganization: (isShowRegistrationOrganization) => dispatch(setShowRegistrationOrganization(isShowRegistrationOrganization))
        }),
    ),
)(Routes);
