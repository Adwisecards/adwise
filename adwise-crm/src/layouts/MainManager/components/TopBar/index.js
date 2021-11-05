import React, {useState, useEffect} from 'react';
import {
    Box,
    Grid,
    Typography,

    Button,
    IconButton,

    Icon, Tooltip
} from '@material-ui/core';
import {
    ArrowRightCircle as ArrowRightCircleIcon,
    Clock as ClockIcon, MessageSquare as MessageSquareIcon
} from 'react-feather';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import {compose} from "recompose";
import {connect} from "react-redux";
import {
    setAccount,
    setOrganization,
    setGlobal
} from "../../../../AppState";
import {
    Menu as MenuIcon
} from 'react-feather';
import clsx from "clsx";
import moment from "moment";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";
import variables from "../../../../constants/varibles";
import {LanguageSelection} from "../../../../components";

const TopBar = (props) => {
    const {onChangeVisibleDrawer} = props;
    const [showButtonTop, setShowButtonTop] = useState(false);
    const [showBackgroundHeader, setShowBackgroundHeader] = useState(false);
    const [isScreenSmall, setScreenSmall] = useState(false);

    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        window.onscroll = handleEventScroll;
        setScreenSmall(document.documentElement.clientWidth <= 1399);
    }, []);

    const handleUserExit = () => {
        localStorage.removeItem('jwt');
        props.setAccount(null);
        props.setOrganization(null);
        props.setGlobal(null);

        history.replace('/')
    }
    const handleEventScroll = (event) => {
        if (window.pageYOffset > 50 && !showBackgroundHeader) {
            setShowBackgroundHeader(true)
        }
        if (window.pageYOffset < 50 && showBackgroundHeader) {
            setShowBackgroundHeader(false)
        }
    }
    const handleToRoute = (route) => {
        history.push(route)
    }
    const handleOpenTelegram = () => {
        window.open(`tg://resolve?domain=${variables["telegram-bot"]}&start=tgorg`);
    }

    const showIconOrganization = (!!props.account.picture) ? true : false;

    window.onresize = (event) => {
        let newScreenSmall = document.documentElement.clientWidth <= 1399;

        if (isScreenSmall !== newScreenSmall) {
            setScreenSmall(document.documentElement.clientWidth <= 1399);
        }
    }

    return (
        <Grid className={clsx({
            [classes.header]: true,
            [classes.headerBackground]: showBackgroundHeader
        })} container>
            <Grid className={clsx([classes.elementHeader, classes.logoContainer])} item>
                {
                    isScreenSmall && (
                        <IconButton onClick={onChangeVisibleDrawer}>
                            <MenuIcon/>
                        </IconButton>
                    )
                }

                <Button className={classes.logo} onClick={() => handleToRoute('/')}>
                    <img src="/source/svg/logos/logo_clear.svg"/>
                    <Typography className={classes.headerLogoTitle}>AdWise CRM</Typography>
                </Button>
            </Grid>

            <Grid className={clsx([classes.elementHeader])} item>
                <Tooltip title={(
                    <Typography dangerouslySetInnerHTML={{__html: allTranslations(localization.layoutsMainHeaderTelegramTooltip)}}/>
                )} arrow>
                    <Button className={clsx([classes.headerButton])} onClick={handleOpenTelegram}>
                        <MessageSquareIcon color="#8152E4"/>
                    </Button>
                </Tooltip>
            </Grid>

            <Grid className={clsx([classes.elementHeader])} item>
                <Button className={clsx([classes.headerButton])} onClick={() => handleToRoute('/personal-area')}>
                    {
                        showIconOrganization ? (
                            <img src={props.account.picture} className={classes.imageLogoOrganization}/>
                        ) : (
                            <img src="/source/svg/header/personal_area.svg"/>
                        )
                    }

                    <Typography className={classes.headerButtonTitle}>{props.account.email}</Typography>
                </Button>
            </Grid>

            <Grid className={clsx([classes.elementHeader])} item>
                <LanguageSelection/>
            </Grid>

            <Grid className={clsx([classes.elementHeader])} item>
                <Button className={clsx([classes.headerButton])} onClick={handleUserExit}>
                    <img src="/source/svg/header/exit.svg"/>

                    <Typography className={classes.headerButtonTitle}>{allTranslations(localization.layoutsMainHeaderButtonExit)}</Typography>
                </Button>
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
    }
}));

export default compose(
    connect(
        state => ({
            app: state.app,
            account: state.app.account,
            organization: state.app.organization
        }),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account)),
            setOrganization: (organization) => dispatch(setOrganization(organization)),
            setGlobal: (global) => dispatch(setGlobal(global)),

        }),
    ),
)(TopBar);
