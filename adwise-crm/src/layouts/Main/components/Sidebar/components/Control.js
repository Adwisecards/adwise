import React from 'react';
import {
    Box,
    Typography,

    Link,

    Grid, IconButton
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {useHistory} from 'react-router-dom';
import {useLocation} from 'react-router';
import clsx from "clsx";
import {PlusCircle as PlusCircleIcon} from "react-feather";
import {compose} from "recompose";
import {connect} from "react-redux";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const CounterActionButton = (props) => {
    const {
        isActive, title, count, isDisabled,
        onClick, onClickAdd, hideAdd, hideCount
    } = props;
    const classes = useStyles();

    const handleClick = ({ target }) => {
        const isActive = target.closest('#button-plus');

        if (isActive){
            onClickAdd()
        }else {
            onClick()
        }
    }

    return (
        <Grid
            container
            spacing={1}
            alignItems={'center'}
            className={clsx({
                [classes.counterActionButton]: true,
                [classes.counterActionButtonActive]: isActive,
                [classes.counterActionButtonDisabled]: isDisabled
            })}

            onClick={handleClick}
        >
            { (!hideAdd) && (
                <Grid
                    className={clsx({
                        [classes.counterActionButtonLeft]: true,
                        [classes.counterActionButtonLeftActive]: isActive
                    })}
                >{ count }</Grid>
            ) }
            <Grid className={classes.counterActionButtonCenter}>
                <Typography
                    className={clsx({
                        [classes.counterActionButtonTitle]: true,
                        [classes.counterActionButtonTitleActive]: isActive
                    })}
                >{ title }</Typography>
            </Grid>

            {
                (!hideCount) && (
                    <Grid className={classes.counterActionButtonRight}>
                        <IconButton id={'button-plus'} style={{ padding: 0 }} onClick={handleClick}>
                            <PlusCircleIcon color={ isActive ? 'white' : '#8152E4' } fontSize={20}/>
                        </IconButton>
                    </Grid>
                )
            }
        </Grid>
    )
}
const ButtonControl = (props) => {
    const { organization } = props;
    const classes = useStyles();
    return (
        <Typography
            className={clsx({
                [classes.link]: true,
                [classes.linkActive]: props.isActive,
                [classes.linkDisabled]: props.isDisabled
            })}

            onClick={props.onClick}
        >
            { props.title }
        </Typography>
    )
}

const Control = (props) => {
    const {wisewinId, organization} = props;
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const handleIsOpenMultiple = (hrefs) => {
        let isOpen = false;
        let isHomePage = '/' === location.pathname;

        if (isHomePage){
            hrefs.map((href) => {
                if (href === '/') {
                    isOpen = true
                }
            })
        }else{
            hrefs.map((href) => {
                if (href.length > 2 && location.pathname.indexOf(href) > -1) {
                    isOpen = true;
                }
            })
        }

        return isOpen
    }
    const handleIsOpen = (href) => {
        return href === location.pathname
    }
    const handleOpen = (href) => {
        history.push(href);
    }

    const isOrganizationSigned = Boolean(organization?.signed || false);
    const isUserManager = Boolean(wisewinId || false);


    let countProducts = 0;
    if (organization && organization.products){
        countProducts = organization.products.length
    }

    return (
        <Box>
            <Box mb={2}>
                <Typography className={classes.sectionTitle}>Управление</Typography>
            </Box>

            <CounterActionButton title={allTranslations(localization.layoutsMainSidebarControlCoupons)} isDisabled={!Boolean(organization?._id)} count={props.totalCountsSidebar?.countCoupons || 0} isActive={handleIsOpenMultiple(['/coupons', '/shares/create', '/coupons/'])} onClick={() => handleOpen('/coupons')} onClickAdd={() => handleOpen('/shares/create')}/>
            <CounterActionButton title={allTranslations(localization.layoutsMainSidebarControlClients)} isDisabled={!isOrganizationSigned} count={props.totalCountsSidebar?.countClients || 0} isActive={handleIsOpen('/clients')} onClick={() => handleOpen('/clients')} hideCount/>
            <CounterActionButton title={allTranslations(localization.layoutsMainSidebarControlBills)} isDisabled={!isOrganizationSigned} count={props.totalCountsSidebar?.countPurchases || 0} isActive={handleIsOpen('/bills')} onClick={() => handleOpen('/bills')} onClickAdd={() => handleOpen('/bill/create')}/>
            <CounterActionButton title={allTranslations(localization.layoutsMainSidebarControlProducts)} isDisabled={true} count={countProducts} isActive={handleIsOpen('/products')} onClick={() => handleOpen('/products')} onClickAdd={() => handleOpen('/products/create')}/>

            {
                !isOrganizationSigned && (
                    <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlApplicationForm)} isDisabled={false} isActive={handleIsOpen('/application-form')} onClick={() => handleOpen('/application-form')}/>
                )
            }
            <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlOperations)} isDisabled={!isOrganizationSigned} isActive={handleIsOpen('/operations')} onClick={() => handleOpen('/operations')}/>
            <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlTariffs)} isDisabled={!Boolean(organization?._id)} isActive={handleIsOpen('/tariffs')} onClick={() => handleOpen('/tariffs')}/>
            <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlAdwiseBusiness)} isActive={handleIsOpen('/adwise-business')} onClick={() => handleOpen('/adwise-business')}/>
            <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlMaterials)} isDisabled={false} isActive={handleIsOpen('/materials')} onClick={() => handleOpen('/materials')}/>
            <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlFeedback)} isDisabled={false} isActive={handleIsOpen('/feedback')} onClick={() => handleOpen('/feedback')}/>
            {/*<ButtonControl title="Push-notification" isDisabled={!Boolean(organization?._id)} isActive={handleIsOpen('/push-notifications')} onClick={() => handleOpen('/push-notifications')}/>*/}

            {isUserManager && <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlManager)} isDisabled={false} isActive={handleIsOpen('/manager')} onClick={() => handleOpen('/manager')}/>}
            <ButtonControl title={"Акты"} isDisabled={false} isActive={handleIsOpen('/acts')} onClick={() => handleOpen('/acts')}/>
            <ButtonControl title={allTranslations(localization.layoutsMainSidebarControlQuestionAnswer)} isDisabled={false} isActive={handleIsOpen('/question-answer')} onClick={() => handleOpen('/question-answer')}/>
        </Box>
    )
}
const useStyles = makeStyles((theme) => ({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: '19px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#9FA3B7'
    },

    link: {
        cursor: 'pointer',

        width: '100%',
        padding: 8,

        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        color: '#000000',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        '&:hover': {
            color: '#8152E4'
        }
    },
    linkActive: {
        backgroundColor: '#8152E4',
        borderRadius: 5,

        color: 'white!important'
    },
    linkDisabled: {
        color: '#25233E',
        opacity: 0.2,
        pointerEvents: 'none'
    },

    counterActionButton: {
        borderRadius: 21,

        marginLeft: -8,
        marginBottom: 8,

        padding: 8,

        cursor: 'pointer'
    },
    counterActionButtonActive: {
        backgroundColor: '#8152E4'
    },
    counterActionButtonDisabled: {
        pointerEvents: 'none',
        opacity: '0.2'
    },
    counterActionButtonLeft: {
        width: 24,
        height: 24,

        backgroundColor: '#966fe7',
        borderRadius: '100%',

        fontSize: 13,
        lineHeight: '24px',
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    counterActionButtonLeftActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        color: '#8152E4'
    },
    counterActionButtonTitle: {
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    counterActionButtonTitleActive: {
        color: 'white'
    },
    counterActionButtonCenter: {
        flex: 1,

        margin: '0 8px'
    },
    counterActionButtonRight: {
        width: 24,
        height: 24,

        position: 'relative',
        zIndex: 10
    },
}));


export default compose(
    connect(
        state => ({
            organization: state.app.organization
        }),
        dispatch => ({}),
    ),
)(Control);
