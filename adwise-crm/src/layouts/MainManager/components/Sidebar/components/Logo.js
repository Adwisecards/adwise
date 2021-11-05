import React, {useState, useEffect} from 'react';
import {
    Typography,
    Popover, CircularProgress, Backdrop
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    PlugsOrganizationLogo
} from '../../../../../icons';
import {
    ChevronDown,
    ChevronUp
} from 'react-feather';
import clsx from "clsx";
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {useHistory} from "react-router-dom";

const Logo = (props) => {
    const { firstName, lastName, picture } = props;
    const classes = useStyles();

    return (
        <div className={classes.logoContainer}>
            {
                !!picture ? (
                    <img src={picture} className={classes.logo}/>
                ) : (
                    <div className={classes.logo}>
                        <PlugsOrganizationLogo/>
                    </div>
                )
            }

            <Typography className={classes.organizationTitle}>
                { firstName } { lastName }
            </Typography>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    logoContainer: {
        display: 'flex',
        alignItems: 'center',

        marginBottom: theme.spacing(3)
    },

    logoContainerManager: {
        zIndex: 1,
        position: 'relative',
        cursor: 'pointer',

        '&::after': {
            position: 'absolute',
            zIndex: -1,

            backgroundColor: 'rgba(255, 255, 255, 0.5)',

            borderRadius: 5,

            top: -8,
            left: -8,
            right: -8,
            bottom: -8
        },
        '&:hover': {
            '&::after': {
                content: "''",
            }
        }
    },
    logoContainerManagerActive: {},

    logo: {
        width: 50,
        height: 50,

        borderRadius: '100%'
    },
    logoList: {
        width: 40,
        height: 40
    },
    logoListContainer: {
        width: 50,
        height: 50,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    organizationTitle: {
        marginLeft: 12,

        fontSize: 20,
        fontWeight: '500',
        lineHeight: '24px',

        letterSpacing: '0.02em',

        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    organizationTitleList: {
        fontSize: 15,
        fontWeight: 'normal',
        lineHeight: '18px',
    },


    managerCompanyList: {
        width: 254,

        backgroundColor: 'white',

        borderRadius: 5,

        padding: 2
    },
    managerCompanyItem: {
        padding: 6,
        zIndex: 1,

        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',

        '&::after': {
            position: 'absolute',
            zIndex: -1,

            backgroundColor: '#F2F3F9',

            borderRadius: 5,

            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        '&:hover': {
            '&::after': {
                content: "''",
            }
        }
    },

    popover: {
        '& .MuiPopover-paper': {
            boxShadow: 'none!important'
        }
    }
}));

export default Logo;
