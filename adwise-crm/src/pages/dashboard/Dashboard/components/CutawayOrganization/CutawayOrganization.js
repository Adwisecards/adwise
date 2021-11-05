import React from "react";
import {
    Box,

    Typography,

    Button,
    IconButton,

    Tooltip
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    ArrowIcon,

    CutawayVk,
    CutawayInsta,
    CutawayFacebook,

    PlugsOrganizationLogo
} from '../../../../../icons';
import {compose} from "recompose";
import {connect} from "react-redux";
import {setAccount, setOrganization} from "../../../../../AppState";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";


const CutawayOrganization = (props) => {
    const {organization} = props;
    const classes = useStyles();

    const showLogo = !!organization.picture;
    const {colors} = organization;
    const color = (!!colors) ? colors.primary : '';
    const socialNetworks = organization.socialNetworks;

    return (
        <Box className={classes.card} style={{backgroundColor: color}}>

            <Box className={classes.cardBody}>
                <Box className={classes.logoContainer}>
                    <Box className={classes.logo} style={
                        showLogo ? {padding: 0} : {}
                    }>
                        {
                            showLogo ? (
                                <img src={organization.picture}/>
                            ) : (
                                <PlugsOrganizationLogo/>
                            )
                        }
                    </Box>
                </Box>

                <Box>
                    <Typography className={classes.typographyName}>{organization.name}</Typography>
                    <Typography
                        className={classes.typographyDescription}
                        dangerouslySetInnerHTML={{__html: organization.briefDescription}}
                    />
                </Box>
            </Box>

            <Box className={classes.cardFooter}>
                <Box>
                    {organization && organization.emails.length > 0 && (
                        <Typography className={classes.typographyInfo}>{organization.emails[0]}</Typography>)}
                    {organization && organization.phones.length > 0 && (
                        <Typography className={classes.typographyInfo}>{organization.phones[0]}</Typography>)}
                </Box>

                <Box className={classes.socials}>

                    {
                        !!socialNetworks.vk && (
                            <Tooltip arrow title={allTranslations(localization.commonGoTo)}>
                                <IconButton href={socialNetworks.vk} target="_blank" className={classes.social} style={{backgroundColor: color}}><CutawayVk/></IconButton>
                            </Tooltip>
                        )
                    }

                    {
                        !!socialNetworks.fb && (
                            <Tooltip arrow title={allTranslations(localization.commonGoTo)}>
                                <IconButton href={socialNetworks.fb} target="_blank" className={classes.social}
                                     style={{backgroundColor: color}}><CutawayFacebook/></IconButton>
                            </Tooltip>
                        )
                    }

                    {
                        !!socialNetworks.insta && (
                            <Tooltip arrow title={allTranslations(localization.commonGoTo)}>
                                <IconButton href={socialNetworks.insta} target="_blank" className={classes.social} style={{backgroundColor: color}}><CutawayInsta/></IconButton>
                            </Tooltip>
                        )
                    }

                </Box>
            </Box>

        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 350,
        margin: '0 auto',

        borderRadius: 12,

        overflow: 'hidden',

        padding: 12,
        paddingTop: 20,

        position: 'relative',

        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)'
    },

    cardBody: {
        display: 'flex',

        paddingLeft: 18,
        paddingRight: 18,
    },

    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginTop: theme.spacing(2),

        padding: 12,

        borderRadius: 10,

        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))'
    },

    logoContainer: {
        marginRight: theme.spacing(3)
    },
    logo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        padding: 10,
        boxSizing: 'border-box',

        width: 70,
        height: 70,

        overflow: 'hidden',

        backgroundColor: 'white',

        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

        borderRadius: '100%',

        '& img': {
            width: '100%',
            height: '100%',

            objectFit: 'cover'
        }
    },

    socials: {
        display: 'flex',
        alignItems: 'center',

        marginLeft: -12
    },
    social: {
        width: 30,
        height: 30,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        marginLeft: 12,

        borderRadius: '100%',

        padding: 2,
        boxSizing: 'border-box',

        '& svg': {
            color: 'white',
            fill: 'white',
        }
    },

    containerButtonRevers: {
        position: 'absolute',

        top: 0,
        right: 0,

        width: 40,
        height: 40
    },
    buttonRevers: {
        marginTop: -30,
        marginLeft: 10,

        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(45deg, rgba(0, 0, 0, 0.1) 50%, rgba(255, 255, 255, 0) 58.33%)',
        backgroundBlendMode: 'normal, multiply, normal',
        mixBlendMode: 'normal',
        width: 60,
        height: 60,

        // cursor: 'pointer',

        transform: "rotate(45deg)",

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    buttonReversIcon: {
        transform: "rotate(-45deg)"
    },

    typographyName: {
        fontFamily: 'Atyp Text',
        fontSize: 18,
        lineHeight: '22px',
        color: 'white',
        fontWeight: '600',

        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',

        marginBottom: 6
    },
    typographyDescription: {
        fontFamily: 'Atyp Text',

        fontSize: 12,
        lineHeight: '14px',
        fontFeatureSettings: "'ss02' on",
        color: 'white',
        opacity: 0.8,

        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical'
    },
    typographyInfo: {
        fontFamily: 'Atyp Text',

        fontSize: 10,
        lineHeight: '13px',
        color: 'white',
        opacity: 0.8,
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
    },
}));

CutawayOrganization.defaultProps = {
    colors: '#0084FF',
};

export default compose(
    connect(
        state => ({
            app: state.app,
            organization: state.app.organization
        }),
        dispatch => ({
            setAccount: (account) => dispatch(setAccount(account)),
            setOrganization: (organization) => dispatch(setOrganization(organization))
        }),
    ),
)(CutawayOrganization);
