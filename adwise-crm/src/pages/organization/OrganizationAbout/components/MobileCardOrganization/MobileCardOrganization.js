import React from 'react';
import {
    Box,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    PlugsOrganizationLogo,
    PlugsOrganizationBackground
} from '../../../../../icons';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const MobileCardOrganization = (props) => {
    const { organization, newPicture, newMainPicture } = props;
    const { colors, primaryColor } = organization;
    const classes = useStyle();

    const handleGetImage = (file) => {
        if (typeof file === 'object') {
            return URL.createObjectURL(file);
        }

        return file
    }

    const color = primaryColor;

    return (
        <Box className={classes.mobileCard}>
            <Box className={classes.mobileCardHeader}>
                {
                    (!!newMainPicture || organization.mainPicture) ? (
                        <img src={ handleGetImage(newMainPicture) } className={classes.mobileCardMainPicture}/>
                    ) : (
                        <div className={classes.mobileCardMainPicture} style={{ backgroundColor: color }}>
                            <PlugsOrganizationBackground />
                        </div>
                    )
                }

                {
                    (!!newPicture || organization.picture) ? (
                        <img src={ (!!newPicture) ? handleGetImage(newPicture) : organization.picture } className={classes.mobileCardPicture}/>
                    ) : (
                        <div className={classes.mobileCardPicture}>
                            <PlugsOrganizationLogo color={color}/>
                        </div>
                    )
                }
            </Box>
            <Box className={classes.mobileCardBody}>
                <Typography className={classes.mobileCardName}>{ organization.name }</Typography>
                <Typography className={classes.mobileCardBriefDescription}>{ organization.briefDescription }</Typography>
            </Box>
            <Box className={classes.mobileCardFooter}>
                <Typography className={classes.mobileCardSubscribe} style={{ backgroundColor: color }}>{allTranslations(localization.commonSubscribe)}</Typography>
            </Box>
        </Box>
    )
}

const useStyle = makeStyles((theme) => ({
    mobileCard: {
        maxWidth: 260,

        overflow: 'hidden',
        borderRadius: 10,
        padding: theme.spacing(1),
        backgroundColor: "rgb(243, 244, 247)"
    },

    mobileCardHeader: {
        position: 'relative',
        zIndex: 1,

        height: 160,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mobileCardBody: {
        backgroundColor: 'white',
        borderRadius: 8,

        padding: 12,

        marginBottom: theme.spacing(2)
    },
    mobileCardFooter: {},

    mobileCardMainPicture: {
        position: 'absolute',
        left: -10,
        top: -10,
        right: -10,
        bottom: -10,
        zIndex: -1,

        height: '100%',
        width: 'calc(100% + 20px)',

        objectFit: 'cover',

        borderRadius: 10,
    },
    mobileCardPicture: {
        width: 100,
        height: 100,

        objectFit: 'cover',

        borderRadius: '100%'
    },

    mobileCardName: {
        fontSize: 16,
        lineHeight: '18px',
        fontFamily: 'Atyp Text',

        marginBottom: 8
    },
    mobileCardBriefDescription: {
        fontSize: 12,
        lineHeight: '15px',
        fontFamily: 'Atyp Text',

        opacity: 0.6
    },

    mobileCardSubscribe: {
        width: '100%',
        padding: 6,

        backgroundColor: '#0085FF',
        borderRadius: 6,

        fontSize: 13,
        lineHeight: '15px',
        fontWeight: '500',
        fontFamily: 'Atyp Text',
        textAlign: 'center',
        color: 'white'
    },
}));

export default MobileCardOrganization
