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
import axiosInstance from "../../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {useHistory} from "react-router-dom";

const Logo = (props) => {
    const {wisewinId, organization, managerOrganizations} = props;
    const {name, picture} = organization;
    const [isOpenSelect, setOpenSelect] = useState(false);
    const [isUpdateOrganization, setUpdateOrganization] = useState(false);
    const [organizationList, setOrganizationList] = useState([]);
    const classes = useStyles();
    const history = useHistory();

    const sessionJWT = sessionStorage.getItem('jwt');

    const isUserManager = !!wisewinId || sessionJWT;

    if (!isUserManager) {
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
                    {name ? name : 'AdWise'}
                </Typography>
            </div>
        )
    }

    const handleEnterOrganization = (item, onClose) => {
        setUpdateOrganization(true);

        sessionStorage.setItem('jwt', localStorage.getItem('jwt'));

        axiosInstance.defaults.headers['authentication'] = item.jwt;

        onClose();

        handleUpdateAccount();
    }
    const handleUpdateAccount = () => {
        axiosInstance.get(urls["get-me"]).then((response) => {
            history.replace('/')

            const user = response.data.data.user;

            props.setAccount(user);

            if (!user.organization) {
                setUpdateOrganization(false)

                return null
            }

            handleUpdateOrganization();
        }).catch((error) => {
            setUpdateOrganization(false)
        })
    }
    const handleUpdateOrganization = () => {
        axiosInstance.get(urls["get-me-organization"]).then((response) => {
            props.setOrganization(response.data.data.organization);
            setUpdateOrganization(false)
        }).catch((error) => {
            setUpdateOrganization(false)
        })
    }

    const hideOrganizationId = organization._id;

    return (
        <>
            <PopupState variant="popover" popupId="demo-popup-popover">
                {(popupState) => (
                    <div>
                        <div
                            className={clsx({
                                [classes.logoContainer]: true,
                                [classes.logoContainerManager]: true,
                            })}
                            {...bindTrigger(popupState)}
                        >
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
                                {name ? name : 'AdWise'}
                            </Typography>

                            <ChevronDown
                                style={{marginLeft: 'auto'}}
                                color="#8152E4"
                            />
                        </div>
                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: -8,
                                horizontal: 'center'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            style={{left: -8}}
                            className={classes.popover}
                        >
                            <div className={classes.managerCompanyList}>
                                <div className={classes.managerCompanyItem} onClick={popupState.close}>
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
                                        {name ? name : 'AdWise'}
                                    </Typography>

                                    <ChevronUp
                                        style={{marginLeft: 'auto'}}
                                        color="#8152E4"
                                    />
                                </div>
                                {
                                    managerOrganizations.map((item, idx) => {
                                        const {organization, jwt} = item;
                                        const {picture, name} = organization;

                                        if (hideOrganizationId === organization._id) {
                                            return null
                                        }

                                        return (
                                            <div
                                                className={classes.managerCompanyItem}
                                                onClick={() => handleEnterOrganization(item, popupState.close)}
                                            >
                                                <div className={classes.logoListContainer}>
                                                    {
                                                        !!picture ? (
                                                            <img src={picture} className={clsx([classes.logo, classes.logoList])}/>
                                                        ) : (
                                                            <div className={clsx([classes.logo, classes.logoList])}>
                                                                <PlugsOrganizationLogo/>
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                                <Typography className={clsx([classes.organizationTitle, classes.organizationTitleList])}>
                                                    {name ? name : 'AdWise'}
                                                </Typography>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </Popover>
                    </div>
                )}
            </PopupState>

            <Backdrop open={isUpdateOrganization} invisible={isUpdateOrganization}>
                <CircularProgress size={80} style={{color: 'white'}}/>
            </Backdrop>
        </>
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
