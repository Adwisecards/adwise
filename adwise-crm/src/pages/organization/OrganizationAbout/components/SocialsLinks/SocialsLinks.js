import React from "react";
import {
    Box, Button,

    Grid,

    TextField,

    Typography,

    InputAdornment
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    VkIcon,
    FacebookIcon,
    IntsgramIcon
} from '../../../../../icons';
import {Minus as MinusIcon} from "react-feather";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const SocialsLinks = (props) => {
    const {organization, onChange} = props;
    const {socialNetworks} = organization;
    const classes = useStyles();

    const handleSocial = ({target}) => {
        let newOrganization = {...organization};
        const socialNetworks = newOrganization.socialNetworks;

        const name = target.name;
        const value = target.value;

        socialNetworks[name] = value;
        newOrganization['socialNetworks'] = socialNetworks;

        onChange(newOrganization)
    }
    const handleClearItem = (name) => {
        let newOrganization = {...organization};
        const socialNetworks = newOrganization.socialNetworks;

        const value = '';

        socialNetworks[name] = value;
        newOrganization['socialNetworks'] = socialNetworks;

        onChange(newOrganization)
    }

    return (
        <Box>
            <Box mb={1}>
                <Typography variant="formTitle">{allTranslations(localization.organizationAboutFormsSocialNetworks)}</Typography>
            </Box>
            <Grid container spacing={1}>
                <Grid container spacing={1} className={classes.root}>
                    <Grid item style={{flex: 1}}>
                        <label className={classes.tag}>
                            <div className={classes.iconSocial}>
                                <VkIcon/>
                            </div>

                            <TextField
                                name={'vk'}
                                placeholder={'...'}
                                value={socialNetworks.vk}
                                className={classes.input}
                                onChange={handleSocial}
                                fullWidth

                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography>vk.com/</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </label>
                    </Grid>

                    <Grid item>
                        <Button
                            variant={"outlined"}
                            className={classes.button}

                            disabled={!socialNetworks.vk}

                            onClick={() => handleClearItem('vk')}
                        >
                            <MinusIcon color={!socialNetworks.vk ? '#c0c0c0' : '#8152E4'}/>
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={1} className={classes.root}>
                    <Grid item style={{flex: 1}}>
                        <label className={classes.tag}>
                            <div className={classes.iconSocial}>
                                <FacebookIcon/>
                            </div>

                            <TextField
                                name={'fb'}
                                placeholder={'...'}
                                value={socialNetworks.fb}
                                className={classes.input}
                                onChange={handleSocial}
                                fullWidth

                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography>fb.com/</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </label>
                    </Grid>

                    <Grid item>
                        <Button
                            variant={"outlined"}
                            className={classes.button}

                            disabled={!socialNetworks.fb}

                            onClick={() => handleClearItem('fb')}
                        >
                            <MinusIcon color={!socialNetworks.vk ? '#c0c0c0' : '#8152E4'}/>
                        </Button>
                    </Grid>
                </Grid>

                <Grid container spacing={1} className={classes.root}>
                    <Grid item style={{flex: 1}}>
                        <label className={classes.tag}>
                            <div className={classes.iconSocial}>
                                <IntsgramIcon />
                            </div>

                            <TextField
                                name={'insta'}
                                placeholder={'...'}
                                value={socialNetworks.insta}
                                className={classes.input}
                                onChange={handleSocial}
                                fullWidth

                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography>instagram.com/</Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </label>
                    </Grid>

                    <Grid item>
                        <Button
                            variant={"outlined"}
                            className={classes.button}

                            disabled={!socialNetworks.insta}

                            onClick={() => handleClearItem('insta')}
                        >
                            <MinusIcon color={!socialNetworks.vk ? '#c0c0c0' : '#8152E4'}/>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    containerIconSocial: {
        width: 24
    },

    iconSocial: {
        width: 24,
        minWidth: 24,
        height: 24,

        boxSizing: 'border-box',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: '100%',

        fill: 'white',

        backgroundColor: '#8152E4'
    },

    root: {
        marginBottom: 8
    },

    tag: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',

        backgroundColor: 'white',

        padding: '10px 12px',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 5,

        fontSize: 16,
        fontFamily: 'Atyp Display',
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: theme.palette.text.primary,

        '& .MuiInputAdornment-root > .MuiTypography-body1': {
            color: '#25233E',
            padding: 0,
            fontSize: 16,
            lineHeight: '19px',
            letterSpacing: '0.02em',
            fontFeatureSettings: "'ss03' on, 'ss06' on",

            marginRight: -8
        }
    },
    tagLattice: {
        color: '#C4A2FC',

        marginRight: 8
    },

    input: {
        margin: '0 8px',

        '& .MuiInput-root': {
            border: 'none!important'
        },
        '& .MuiInput-root:before': {
            content: 'none!important'
        },
        '& .MuiInputBase-input': {
            padding: 0,

            fontSize: 16,
            lineHeight: '19px',
            letterSpacing: '0.02em',
            fontFeatureSettings: "'ss03' on, 'ss06' on",
            color: theme.palette.text.primary
        },
    },

    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        height: '100%',

        width: 44,
        minWidth: 44,

        padding: 0,

        borderColor: 'rgba(168, 171, 184, 0.6)'
    }
}));

export default SocialsLinks
