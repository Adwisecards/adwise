import React from 'react';
import {
    Box,
    Typography,
    Button,

    Grid,

    IconButton
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    PlusCircle as PlusCircleIcon
} from 'react-feather';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import clsx from "clsx";
import {compose} from "recompose";
import {connect} from "react-redux";
import OrganizationShares from "../../../../../pages/organization/OrganizationCoupons/OrganizationCoupons";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const CounterActionButton = (props) => {
    const {
        isActive, title, count, isDisabledSidebar,
        onClick, onClickAdd, hideAdd, hideCount
    } = props;
    const classes = useStyles();



    const handleClick = ({ target }) => {
        if (isDisabledSidebar){
            return null
        }

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
              [classes.counterActionButtonDisabled]: isDisabledSidebar,
            })}

            onClick={handleClick}
        >
            { (!hideAdd) && ( <Grid className={clsx({[classes.counterActionButtonLeft]: true, [classes.counterActionButtonLeftActive]: isActive})}>{ count }</Grid> ) }
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

const MyCompany = (props) => {
    const { push, href, organization } = props;
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    const handleIsOpen = (hrefs) => {
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
    const handleChangePage = (url) => {
        push(url)
    }

    const isOrganization = Boolean(organization && organization._id);
    const isDisabledSidebar = !Boolean(isOrganization);

    let clientsCount = 0;
    let employeesCount = 0;
    let countCutawaysCards = 0;

    if (organization && organization.clients){
        clientsCount = organization.clients.length;
    }
    if (organization && organization.employees){
        employeesCount = organization.employees.length;
    }

    return (
        <Box mb={5}>
            <CounterActionButton
                title={allTranslations(localization.layoutsMainSidebarMyCompanyOverview)}
                isActive={handleIsOpen(['/'])}

                onClick={() => handleChangePage('/')}

                hideCount
                hideAdd
            />

            <CounterActionButton
                title={allTranslations(localization.layoutsMainSidebarMyCompanyOrganization)}
                isActive={handleIsOpen(['/organization'])}

                onClick={() => handleChangePage('/organization')}

                hideCount
                hideAdd
            />
            <CounterActionButton
                title={allTranslations(localization.layoutsMainSidebarMyCompanyEmployees)}
                count={employeesCount}
                isActive={handleIsOpen(['/employees'])}

                onClick={() => handleChangePage('/employees')}
                onClickAdd={() => handleChangePage('/employees/create')}
                isDisabledSidebar={isDisabledSidebar}
            />
            <CounterActionButton
                title={allTranslations(localization.layoutsMainSidebarMyCompanyCutaways)}
                count={countCutawaysCards}

                isActive={handleIsOpen(['/cutaways', '/cutaways/create'])}

                onClick={() => handleChangePage('/cutaways')}
                onClickAdd={() => handleChangePage('/cutaways/create')}
                isDisabledSidebar={isDisabledSidebar}
            />
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

    button: {
        width: '100%',
        padding: '8px 8px 6px 8px',
        marginLeft: -8,
        marginBottom: 8,
        justifyContent: 'flex-start',
        textTransform: 'initial',

        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: '16px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        "&:hover": {
            backgroundColor: 'transparent'
        },
        "&:active": {
            backgroundColor: 'transparent'
        },
    },
    buttonActive: {
        backgroundColor: "rgba(129, 82, 228, 0.7)",

        color: 'white',

        "&:hover": {
            backgroundColor: 'rgba(129, 82, 228, 0.7)'
        },
        "&:active": {
            backgroundColor: 'rgba(129, 82, 228, 0.7)'
        },
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
)(MyCompany);
