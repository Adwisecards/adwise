import React, {useState} from "react";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Grid,
    TextField,
    Tooltip,

    Typography,
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    PlugsOrganizationDefaultUser
} from '../../../../../icons';
import {

} from "react-feather";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import {store} from "react-notifications-component";
import getErrorMessage from "../../../../../helper/getErrorMessage";
import MaskedInput from 'react-text-mask';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import alertNotification from "../../../../../common/alertNotification";

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
            placeholderChar={'_'}
            showMask
        />
    );
}

const PersonalManager = (props) => {
    const { organization, setOrganization } = props;
    const { manager } = organization;
    const [ isSubmit, setSubmit ] = useState(false);
    const [ codeManager, setCodeManager ] = useState('');
    const [ activeManager, setActiveManager ] = useState(false);
    const classes = useStyles();

    const showUserImage = Boolean(manager && manager.picture);

    const handleSetManager = () => {
        setSubmit( true );

        axiosInstance.put(`${ urls["set-manager"] }${ props.organization._id }`, {
            userManagerRefCode: codeManager.replace(/\D+/g,"")
        }).then((response) => {
            handleUpdateOrganization();
        }).catch((error) => {
            setSubmit(false);
            const errorMessage = getErrorMessage(error);

            alertNotification({
                title: errorMessage.title,
                message: errorMessage.message,
                type: 'danger',
            })

        });
    }
    const handleOnChange = ({ target }) => {
        setCodeManager(target.value)
    }
    const handleUpdateOrganization = () => {

        axiosInstance.get(urls["get-me-organization"]).then((response) => {
            setOrganization(response.data.data.organization);
            setSubmit(false);

            alertNotification({
                title: allTranslations(localization.notificationSuccessTitleSuccess),
                message: allTranslations(localization.notificationSuccessManagerInstalled),
                type: 'success',
            })

        });
    }

    if (!manager || !manager._id){
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" flex="1" height="100%">

                <Box mb={1}>
                    <Grid container spacing={1} alignItems="flex-end" wrap="nowrap">
                        <Grid item>
                            <Typography className={classes.titleNotManager} dangerouslySetInnerHTML={{__html: allTranslations(localization.dashboardEnterYourManagerCode)}}/>
                        </Grid>
                        <Grid item>
                            <Tooltip arrow title={allTranslations(localization.dashboardManagerNeededSuperviseWorkSystem)}>
                                <Box className={classes.iconQustion}>
                                    ?
                                </Box>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={1}>
                    <TextField
                        value={codeManager}
                        placeholder={'111-22-333'}
                        className={classes.input}

                        disabled={activeManager}

                        onChange={handleOnChange}

                        InputProps={{
                            inputComponent: TextMaskCustom,
                        }}
                    />
                </Box>

                <Box mb={3}>
                    <Button variant="contained" className={classes.button} onClick={handleSetManager}>{allTranslations(localization.commonSave)}</Button>
                </Box>

                <Backdrop open={isSubmit} invisible={isSubmit}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </Box>
        )
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.header}>
                <Typography className={classes.title} dangerouslySetInnerHTML={{ __html: allTranslations(localization.dashboardPersonalManager) }}/>
            </Box>

            <Box className={classes.logoContainer}>
                {
                    showUserImage ? (
                        <Box className={classes.imageUser}>
                            <img src={ manager.picture } style={{ width: '100%', height: '100%' }}/>
                        </Box>
                    ) : (
                        <Box className={classes.imageUser}>
                            <PlugsOrganizationDefaultUser />
                        </Box>
                    )
                }
            </Box>

            <Box className={classes.mainInformation}>
                <Typography className={classes.typographyName}>{ manager.firstName }</Typography>
                <Typography className={classes.typographyName}>{ manager.lastName }</Typography>
            </Box>

            <Box>
                <Typography className={classes.typographyDescription}>{ manager.phone }</Typography>
                <Typography className={classes.typographyDescription}>{ manager.email }</Typography>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},

    header: {
        marginBottom: 32
    },

    logoContainer: {
        marginBottom: 18
    },

    title: {
        fontSize: 16,
        lineHeight: '19px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    mainInformation: {
        marginBottom: 12
    },

    imageUser: {
        width: 70,
        height: 70,
        borderRadius: '100%',
        backgroundColor: 'white',
        overflow: 'hidden'
    },

    typographyName: {
        fontSize: 15,
        lineHeight: '19px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    typographyDescription: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#9FA3B7',
        opacity: 0.7,
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    titleEnter: {
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#25233E',

        marginBottom: 8
    },

    container: {
        display: 'flex',
        alignItems: 'center',

        backgroundColor: 'rgba(255, 255, 255, 0.2)',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 6,

        padding: '2px 6px',
    },

    input: {
        padding: '0px 12px',

        minWidth: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(168, 171, 184, 0.6)',
        borderRadius: 5,

        fontSize: 16,
        lineHeight: '19px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#25233E',

        '& .MuiInputBase-root:before': {
            content: 'none'
        },
        '& .MuiInputBase-root:after': {
            content: 'none'
        },
    },

    button: {
        width: '100%',
        padding: '6px 12px',
        backgroundColor: '#966EEA',
        borderRadius: 3,

        fontSize: 14,
        lineHeight: '16px',
        color: 'white',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    buttonNotManager: {
        width: '100%',
        padding: '6px 12px',
        backgroundColor: '#EADEFE',
        borderRadius: 3,

        fontSize: 12,
        lineHeight: '14px',
        color: '#966EEA',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    titleNotManager: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: '19px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: '#25233E',
    },
    iconQustion: {
        width: 18,
        height: 18,
        borderRadius: "100%",
        backgroundColor: "#F2F3F9",

        fontSize: 12,
        lineHeight: '18px',
        textAlign: 'center',
        color: '#CBCCD4'
    }
}));

export default PersonalManager
