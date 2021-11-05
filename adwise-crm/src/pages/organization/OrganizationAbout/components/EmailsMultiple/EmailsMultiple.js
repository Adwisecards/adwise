import React, {useState, useEffect} from 'react';
import {
    Box,

    Grid,

    Typography,

    Button,
    IconButton,

    TextField,
    FormHelperText
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Minus as MinusIcon,
    Plus as PlusIcon,
    PlusCircle as PlusCircleIcon
} from 'react-feather';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";


const EmailsMultiple = (props) => {
    const {organization, onChange, error} = props;
    const {emails} = organization;
    const [newEmail, setNewEmail] = useState('');
    const [isShowNew, setIsShowNew] = useState(false);

    useEffect(() => {
        if (emails.length <= 0) {
            setIsShowNew(true)
        }
    }, []);

    const classes = useStyles();

    if (!emails) {
        return null
    }

    const handleRemoveEmail = (idx) => {
        let newEmail = [...emails];

        newEmail.splice(idx, 1);

        onChange(newEmail)
    }
    const handleAddEmail = () => {
        if (!newEmail) {
            return null
        }

        let newEmails = [...emails];
        newEmails.push(newEmail);

        setNewEmail('');
        onChange(newEmails);
        setIsShowNew(false);
    }
    const handleChangeNewemail = (event) => {
        const target = event.target;
        const value = target.value;

        setNewEmail(value);
    }

    const handleAddNew = () => {
        setIsShowNew(true)
    }
    const handleEventEnterForm = ({charCode}) => {
        if (charCode === 13) {
            handleAddEmail()
        }
    }
    const handleChaneCurrentItem = ({target}, idx) => {
        const value = target.value;

        if (!value) {
            handleRemoveEmail(idx);

            return null
        }

        let newEmails = [...emails];
        newEmails[idx] = value;

        onChange(newEmails)
    }

    const handleCloseAdd = () => {
        setNewEmail('');
        setIsShowNew(false);
    }



    return (
        <>
            <Grid container justify={"space-between"} alignItems={'center'}>
                <Grid item>
                    <Typography variant="formTitle" style={{margin: 0}}>E-mail</Typography>
                </Grid>
            </Grid>
            <Box mt={2} mb={1}>
                {
                    emails.map((email, idx) => (
                        <Grid
                            key={`organization-email-${idx}`}
                            container
                            spacing={1}
                            className={classes.root}
                            wrap={"nowrap"}
                        >
                            <Grid item style={{flex: 1}}>
                                <label className={classes.tag}>
                                    <TextField
                                        value={email}
                                        className={classes.input}

                                        placeholder={'info@wise.cards'}

                                        onChange={(event) => handleChaneCurrentItem(event, idx)}
                                        onBlur={handleAddEmail}

                                        fullWidth
                                    />
                                </label>
                            </Grid>

                            {
                                (!isShowNew && idx === emails.length - 1) ? (
                                    <Grid item>
                                        <Button
                                            variant={"outlined"}
                                            className={classes.button}

                                            onClick={handleAddNew}
                                        >
                                            <PlusIcon color={'#8152E4'}/>
                                        </Button>
                                    </Grid>
                                ) : (
                                    <Grid item>
                                        <Button
                                            variant={"outlined"}
                                            className={classes.button}

                                            onClick={() => handleRemoveEmail(idx)}
                                        >
                                            <MinusIcon color={'#8152E4'}/>
                                        </Button>
                                    </Grid>
                                )
                            }
                        </Grid>
                    ))
                }

                {
                    (isShowNew || emails.length <= 0) && (
                        <Grid container spacing={1} className={classes.root}>
                            <Grid item style={{flex: 1}}>
                                <label className={classes.tag}>
                                    <TextField
                                        value={newEmail}
                                        className={classes.input}

                                        placeholder={'info@wise.cards'}

                                        onChange={handleChangeNewemail}
                                        onBlur={handleAddEmail}
                                        onKeyPress={handleEventEnterForm}

                                        fullWidth
                                    />
                                </label>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant={"outlined"}
                                    className={classes.button}

                                    onClick={handleCloseAdd}
                                >
                                    <PlusIcon color={'#8152E4'}/>
                                </Button>
                            </Grid>
                        </Grid>
                    )
                }

                {
                    !!error ? (
                        <FormHelperText className={classes.formHelperText} error>{allTranslations(localization.yupValidationEmail)}</FormHelperText>
                    ) : (
                        <FormHelperText className={classes.formHelperText}>{allTranslations(localization.organizationAboutOrganizationEmail)}</FormHelperText>
                    )
                }

            </Box>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 8
    },

    tag: {
        flex: 1,
        display: 'flex',

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
    },

    formHelperText: {
        marginTop: -8
    },
}));

export default EmailsMultiple
