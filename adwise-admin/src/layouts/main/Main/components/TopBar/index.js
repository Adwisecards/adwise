import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router';
import {
    Box,
    Grid,
    Typography,
    Button,
    Link,
    Menu,
    MenuItem,
    Tabs,
    Tab,
    Tooltip
} from '@material-ui/core';
import {
    ChevronDown as ChevronDownIcon
} from "react-feather";
import {useHistory} from 'react-router-dom';
import PopupState, {bindTrigger, bindMenu} from 'material-ui-popup-state';
import {makeStyles} from '@material-ui/styles';
import {compose} from "recompose";
import {connect} from "react-redux";
import clsx from "clsx";

const menuServices = [
    {
        title: 'Организации',
        path: '/organizations'
    },
    {
        title: 'Пользователь',
        path: '',
        isDropDown: true,
        items: [
            {
                title: 'Пользователи',
                path: '/users'
            },
            {
                title: 'Визитные карточки',
                path: '/contacts'
            },
            {
                title: 'Реферальные коды',
                path: '/referral-codes'
            }
        ]
    },
    {
        title: 'Транзакции',
        path: '/transactions'
    },
    {
        title: 'Покупки',
        path: '/purchases'
    },
    {
        title: 'Купоны',
        path: '/coupons'
    },
    {
        title: 'Запрос на вывод',
        path: '/withdrawal-request'
    },
    {
        title: 'Продажа лицензий',
        path: '/sale-licenses'
    },
    {
        title: 'Банковские платежи',
        path: '/bank-payments'
    },
    {
        title: 'Пользовательские подписки',
        path: '/user-subscriptions'
    },
    {
        title: 'Чаевые',
        path: '/tips'
    },
    {
        title: 'История изменения',
        path: '/change-history'
    },
    {
        title: 'Пуш уведомления',
        path: '/push-notifications'
    },
    {
        title: 'Изменении организации',
        path: '/organization-change-requests'
    },
    {
        title: 'Копилки организаций',
        path: '/accumulations'
    },
    {
        title: 'Логи',
        path: '',
        isDropDown: true,
        items: [
            {
                title: 'Пользовательские логи',
                path: '/logging'
            },
            {
                title: 'Системные логи',
                path: '/system-logging'
            }
        ]
    },
    {
        title: 'Настройки',
        path: '',
        isDropDown: true,
        items: [
            {
                title: 'Настройки системы',
                path: '/settings'
            },
            {
                title: 'Категории',
                path: '/categories'
            },
            {
                title: 'Вопрос/Ответ',
                path: '/question-answer'
            },
            {
                title: 'Тарифы',
                path: '/tariffs'
            },
            {
                title: 'Задачи',
                path: '/tasks'
            },
            {
                title: 'Документы',
                path: '/documents'
            },
            {
                title: 'Пользовательские приглашения',
                path: '/invitations'
            },
            {
                title: 'Переводы',
                path: '/language'
            },
            {
                title: 'WEB преимущества',
                path: '/advantage'
            },
            {
                title: 'WEB партнеры',
                path: '/partner'
            },
        ]
    },
];
const menuServicesGuest = [
    {
        title: 'Организации',
        path: '/organizations'
    },
    {
        title: 'Запрос на вывод',
        path: '/withdrawal-request'
    },
    {
        title: 'Изменении организации',
        path: '/organization-change-requests'
    },
    {
        title: 'Транзакции',
        path: '/transactions'
    },
    {
        title: 'Покупки',
        path: '/purchases'
    },
    {
        title: 'Банковские платежи',
        path: '/bank-payments'
    },
];

const TopBar = (props) => {
    const { isAdminGuest } = props;
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const isDevelop = process.env.REACT_APP_ENV === 'DEV';

    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        setActiveTab(location.pathname)
    }, []);

    const handleChangePage = (event, value) => {
        history.push(value);
    }

    const handleClickDropDownMenu = (props, onClose) => {
        history.push(props.path);
    }

    const menus = isAdminGuest ? menuServicesGuest : menuServices

    console.log('isAdminGuest: ', isAdminGuest);

    return (
        <Grid className={clsx({
            [classes.header]: true
        })} container>
            <Grid className={clsx([classes.elementHeader, classes.logoContainer])} item>

                <Grid container spacing={5} alignItems="center" wrap="nowrap">

                    <Grid item style={{minWidth: 220}}>
                        <Button className={classes.logo} onClick={() => handleChangePage(null, '/')}>
                            <img src="/source/svg/logos/logo_clear.svg"/>
                            <Typography className={classes.headerLogoTitle}>AdWise ADMIN</Typography>
                        </Button>
                    </Grid>

                    <Grid item style={{ flex: 1 }}>
                        <Box style={{maxWidth: "calc(100vw - 16px - 220px - 32px - 40px)"}}>
                            <Tabs
                                value={activeTab}
                                className={classes.tabs}
                                variant="scrollable"
                                scrollButtons="on"
                                onChange={handleChangePage}
                            >
                                {
                                    menus.map((item, idx) => {
                                        if (!item.isDropDown) {
                                            return (
                                                <Tab
                                                    className={classes.tab}
                                                    value={item.path}
                                                    label={item.title}
                                                    component={() => (
                                                        <Link className={clsx(['MuiButtonBase-root MuiTab-root MuiTab-textColorInherit', classes.tab])} href={item.path}>
                                                            <span className="MuiTab-wrapper">{item.title}</span>
                                                        </Link>
                                                    )}
                                                />
                                            )
                                        }

                                        return (
                                            <Tab
                                                className={classes.tab}
                                                value={item.path}
                                                label={item.title}
                                                component={(props) => {
                                                    return (
                                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                                            {(popupState) => (
                                                                <React.Fragment>
                                                                    <button
                                                                        {...props}
                                                                        className={clsx({
                                                                            [classes.tab]: true,
                                                                            [props.className]: true,
                                                                        })}
                                                                        {...bindTrigger(popupState)}
                                                                    >
                                                                        { props.children }

                                                                        <ChevronDownIcon color="#8152E4"/>
                                                                    </button>
                                                                    <Menu {...bindMenu(popupState)}>
                                                                        {
                                                                            item.items.map((item) => (
                                                                                <MenuItem href={item.path} onClick={() => handleClickDropDownMenu(item, popupState.close)}>{ item.title }</MenuItem>
                                                                            ))
                                                                        }
                                                                    </Menu>
                                                                </React.Fragment>
                                                            )}
                                                        </PopupState>
                                                    )
                                                }}
                                            />
                                        )
                                    })
                                }
                            </Tabs>
                        </Box>
                    </Grid>

                    {
                        isDevelop && (
                            <Grid item>
                                <Tooltip title={ `Вы используете ${ process.env.REACT_APP_ENV } режим` }>
                                    <Typography variant="h5" style={{ color: isDevelop ? '#93D36C' : '#8152E4' }}>{ process.env.REACT_APP_ENV }</Typography>
                                </Tooltip>
                            </Grid>
                        )
                    }

                </Grid>

            </Grid>
        </Grid>
    )
}

const useStyles = makeStyles((theme) => ({
    header: {
        zIndex: 888,
        position: 'fixed',
        left: 8,
        right: 8,
        top: 8,

        height: 35,
        width: 'auto',

        marginLeft: -6,

        '& > *': {
            marginLeft: 6,
            height: 35
        }
    },
    headerBackground: {},

    logo: {},

    elementHeader: {
        display: 'flex',

        borderRadius: 5,

        backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },

    logoContainer: {
        flex: 1,

        display: 'flex',
        alignItems: 'center',

        padding: 6
    },
    headerLogoTitle: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: '24px',
        letterSpacing: '0.02em',
        color: theme.palette.text.primary,

        marginLeft: 8
    },

    headerButton: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        padding: '6px 16px',

        '& p': {
            marginLeft: 8
        }
    },
    headerButtonTitle: {
        fontSize: 15,
        lineHeight: '15px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        letterSpacing: "0.02em",
        color: theme.palette.text.primary,

        opacity: 0.7
    },

    typographyBusiness: {
        fontSize: 15,
        lineHeight: '18px',
        color: '#25233E',
        opacity: 0.7,
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        '& span': {
            color: '#babdcc'
        }
    },

    imageLogoOrganization: {
        width: 20,
        height: 20,
        borderRadius: '100%',
        objectFit: 'cover'
    },


    buttonDropDown: {
        padding: '0 24px',
        lineHeight: '26px'
    },


    tabs: {
        width: '100%',
        backgroundColor: 'transparent'
    },
    tab: {
        minWidth: 0,
        minHeight: 0,
        textTransform: 'none',
        padding: '4px 12px',

        display: 'flex',
        alignItems: 'center',
        color: "#25233E!important",
        textDecoration: "none!important"
    },
}));

export default compose(
    connect(
        state => ({}),
        dispatch => ({}),
    ),
)(TopBar);
