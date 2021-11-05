import React from "react";
import {
    Box, Button,

    Grid,

    TextField,

    Typography
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

const SocialsLinks = (props) => {
    const {account, onChange} = props;
    let {socialNetworks} = account;
    const classes = useStyles();

    if (!socialNetworks){
        socialNetworks = {}
    }

    const handleSocial = ({target}) => {
        let newOrganization = {...account};
        const socialNetworks = (newOrganization.socialNetworks) ? newOrganization.socialNetworks : {};

        const name = target.name;
        const value = target.value;

        socialNetworks[name] = value;
        newOrganization['socialNetworks'] = socialNetworks;

        onChange(newOrganization)
    }
    const handleClearItem = (name) => {
        let newOrganization = {...account};
        const socialNetworks = (newOrganization.socialNetworks) ? newOrganization.socialNetworks : {};

        const value = '';

        socialNetworks[name] = value;
        newOrganization['socialNetworks'] = socialNetworks;

        onChange(newOrganization)
    }

    return (
        <Box>
            <Grid container spacing={1}>
                <Grid container spacing={1} className={classes.root}>
                    <Grid item style={{flex: 1}}>
                        <label className={classes.tag}>
                            <div className={classes.iconSocial}>
                                <VkIcon/>
                            </div>

                            <TextField
                                name={'vk'}
                                placeholder={'https://vk.com/adwise'}
                                value={socialNetworks.vk}
                                className={classes.input}
                                onChange={handleSocial}
                                fullWidth
                            />
                        </label>
                    </Grid>

                    <Grid item>
                        <Button
                            variant={"outlined"}
                            className={classes.button}

                            onClick={() => handleClearItem('vk')}
                        >
                            <MinusIcon color={'#C4A2FC'}/>
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
                                placeholder={'https://fb.com/adwise'}
                                value={socialNetworks.fb}
                                className={classes.input}
                                onChange={handleSocial}
                                fullWidth
                            />
                        </label>
                    </Grid>

                    <Grid item>
                        <Button
                            variant={"outlined"}
                            className={classes.button}

                            onClick={() => handleClearItem('fb')}
                        >
                            <MinusIcon color={'#C4A2FC'}/>
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
                                placeholder={'https://instagram.com/adwise'}
                                value={socialNetworks.insta}
                                className={classes.input}
                                onChange={handleSocial}
                                fullWidth
                            />
                        </label>
                    </Grid>

                    <Grid item>
                        <Button
                            variant={"outlined"}
                            className={classes.button}

                            onClick={() => handleClearItem('insta')}
                        >
                            <MinusIcon color={'#C4A2FC'}/>
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
        color: theme.palette.text.primary
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
