import React, { useState, useRef } from "react";
import {
    Box,
    Grid, TextField,
    Typography,
    Button,
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {TextEditor} from "../../../../../components";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import getErrorMessage from "../../../../../helper/getErrorMessage";
import {
    store
} from "react-notifications-component";
import MaskedInput from "react-text-mask";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";
import alertNotification from "../../../../../common/alertNotification";

const NotManager = (props) => {
    const { organization, setOrganization } = props;
    const classes = useStyles();
    const [ isSubmit, setSubmit ] = useState(false);
    const [ codeManager, setCodeManager ] = useState('');
    const [ activeManager, setActiveManager ] = useState(false);

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
                title: allTranslations(localization.notificationSystemNotification),
                message: allTranslations(localization.notificationSuccessManagerInstalled),
                type: 'success',
            })

        });
    }

    return (
        <Box className={classes.box}>
            <Box className={classes.root}>
                <Typography className={classes.title}>{allTranslations(localization.tariffNotTariff)}</Typography>
                <Typography className={classes.description}>{allTranslations(localization.tariffMessageHowSetupManager)}</Typography>

                <Grid
                    container
                    spacing="1"
                    alignItems="flex-end"
                >
                    <Grid item>
                        <Box>
                            <Typography className={classes.titleEnter} variant="formTitle">{allTranslations(localization.tariffMessageCodeManager)}</Typography>

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
                    </Grid>
                    <Grid item>
                        <Button variant="contained" className={classes.button} onClick={handleSetManager}>
                            {allTranslations(localization.commonSave)}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
};

const useStyles = makeStyles((theme) => ({
    box: {
        maxWidth: 570,

        marginBottom: 40
    },

    root: {
        padding: '24px 32px',

        border: '1px solid rgba(255, 0, 0, 0.3)',
        borderRadius: 5,

        backgroundColor: 'rgba(255, 0, 0, 0.05)',

    },

    title: {
        fontSize: 20,
        lineHeight: '24px',
        color: '#25233E',
        marginBottom: 16
    },

    description: {
        fontSize: 14,
        lineHeight: '17px',
        color: '#999DB1',
        marginBottom: 32
    },


    header: {
        marginBottom: 32
    },
    logoContainer: {
        marginBottom: 18
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

        fontSize: 16,
        lineHeight: '19px',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#25233E',

        borderRadius: 5,

        backgroundColor: 'white',

        border: '1px solid rgba(168, 171, 184, 0.6)!important',

        '& .MuiInputBase-root:before': {
            content: 'none'
        },
        '& .MuiInputBase-root:after': {
            content: 'none'
        },
    },
    button: {
        minWidth: 90,
        padding: '6px 12px',
        backgroundColor: '#EADEFE',
        borderRadius: 3,

        fontSize: 14,
        lineHeight: '20px',
        color: '#966EEA',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    buttonSaveManager: {},
}));

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

export default NotManager
