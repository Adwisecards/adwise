import React, {useEffect, useState} from 'react';
import {
    Box,

    Grid,

    Typography,

    Button,

    TextField,
    FormHelperText, IconButton
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Minus as MinusIcon,
    Plus as PlusIcon, PlusCircle as PlusCircleIcon
} from 'react-feather';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";


const PhoneMultiple = (props) => {
    const { organization, onChange, error } = props;
    const { phones } = organization;
    const [ newPhone, setNewPhone ] = useState('');
    const [ isShowNew, setIsShowNew ] = useState(false);

    useEffect(() => {
        if (phones.length <= 0){
            setIsShowNew(true)
        }
    }, []);

    const classes = useStyles();

    if (!phones) {
        return null
    }

    const handleRemovePhone = (idx) => {
        let newPhone = [...phones];

        newPhone.splice(idx, 1);

        onChange(newPhone)
    }
    const handleAddPhone = () => {
        if (!newPhone){
            return null
        }

        let newPhones = [...phones];
        newPhones.push(newPhone);

        setNewPhone('');
        setIsShowNew(false);
        onChange(newPhones);
    }
    const handleChangeNewPhone = (event) => {
        const target = event.target;
        const value = target.value;

        setNewPhone(value);
    }
    const handleEventEnterForm = ({ charCode }) => {
        if(charCode === 13){
            handleAddPhone()
        }
    }
    const handleChaneCurrentItem = ({ target }, idx) => {
        const value = target.value;

        if (!value){
            handleRemovePhone(idx);

            return null
        }

        let newEmails = [...phones];
        newEmails[idx] = value;

        onChange(newEmails)
    }
    const handleAddNew = () => {
        setIsShowNew(true)
    }

    const handleCloseAdd = () => {

        setNewPhone('');
        setIsShowNew(false);
    }

    return (
        <>
            <Grid container justify={"space-between"} alignItems={'center'}>
                <Grid item>
                    <Typography variant="formTitle" style={{margin: 0}}>{allTranslations(localization.organizationAboutFormsPhone)}</Typography>
                </Grid>
            </Grid>
            <Box mt={2} mb={1}>
                {
                    phones.map((phone, idx) => (
                        <Grid
                            key={`organization-phone-${idx}`}
                            container
                            spacing={1}
                            className={classes.root}
                            wrap={"nowrap"}
                        >
                            <Grid item style={{flex: 1}}>
                                <label className={classes.tag}>
                                    +
                                    <TextField
                                        value={phone}
                                        className={classes.input}

                                        placeholder={'79876543210'}
                                        type="number"

                                        onChange={(event) => handleChaneCurrentItem(event, idx)}
                                        onBlur={handleAddPhone}

                                        fullWidth
                                    />
                                </label>
                            </Grid>

                            {
                                (!isShowNew && idx === phones.length - 1) ? (
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

                                            onClick={() => handleRemovePhone(idx)}
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
                    (isShowNew || phones.length <= 0) && (
                        <Grid container spacing={1} className={classes.root}>
                            <Grid item style={{flex: 1}}>
                                <label className={classes.tag}>
                                    +
                                    <TextField
                                        value={newPhone}
                                        className={classes.input}

                                        placeholder={'79876543210'}
                                        type="number"

                                        onChange={handleChangeNewPhone}
                                        onBlur={handleAddPhone}
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
                        <FormHelperText className={classes.formHelperText} error>{allTranslations(localization.yupValidationPhone)}</FormHelperText>
                    ) : (
                        <FormHelperText className={classes.formHelperText}>{allTranslations(localization.organizationAboutPhoneOrganization)}</FormHelperText>
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

export default PhoneMultiple
