import React, {
    useRef,
    useState,
    useEffect
} from "react";
import {
    Box,

    TextField,

    Typography,

    CircularProgress,

    IconButton
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    SocialsLinks,
    UploadPicture
} from '../../components';
import * as Yup from "yup";
import {Formik} from "formik";
import {
    Copy as CopyIcon
} from '../../../../../icons';
import {store} from "react-notifications-component";
import alertNotification from "../../../../../common/alertNotification";

const validationSchema = Yup.object().shape({});

const FormSecondary = (props) => {
    const {setRef, account, onChange, picture, onChangePicture} = props;

    const classes = useStyles();
    const codeInviteText = '';

    const handleSubmit = () => {}

    const handleOnChange = ({ target }) => {
        const name = target.name;
        const value = target.value;

        let newAccount = {...account};
        newAccount[name] = value;

        onChange(newAccount)
    }
    const handleCopyCode = () => {
        navigator.clipboard.writeText(account.ref.code).then(() => {

            alertNotification({
                title: 'Успешно',
                message: 'Код пользователя добавлен в буфер обмена',
                type: 'success',
            })

        });
    }

    const _getInviteCode = () => {
        if (!account.ref || !account.ref.code){
            return null
        }

        let match = account.ref.code.match(/^(\d{3})(\d{3})(\d{2})$/);

        return [match[1], '-', match[2], '-', match[3]].join('')
    }

    return (
        <Formik
            innerRef={setRef}

            initialValues={account}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({
                  errors,
                  handleSubmit,
                  isSubmitting,
                  handleBlur,
                  touched,
                  values
              }) => {
                return (
                    <>
                        {
                            false && (
                                <Box mb={4}>
                                    <Box mb={2}>
                                        <Typography variant="formTitle">Код пользователя</Typography>
                                    </Box>

                                    <Box className={classes.boxCodeInvite}>
                                        { _getInviteCode() }

                                        <IconButton onClick={handleCopyCode}>
                                            <CopyIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            )
                        }

                        <Box mb={4}>
                            <Box mb={2}>
                                <Typography variant="formTitle">Аватар</Typography>
                            </Box>

                            <UploadPicture
                                picture={picture}
                                account={account}

                                onChangePicture={onChangePicture}
                            />
                        </Box>

                        {
                            (false) && (
                                <Box mb={4}>
                                    <Box mb={2}>
                                        <Typography variant="formTitle">Социальные сети</Typography>
                                    </Box>

                                    <SocialsLinks
                                        account={account}
                                        onChange={onChange}
                                    />
                                </Box>
                            )
                        }
                    </>
                )
            }}
        </Formik>
    )
}

const useStyles = makeStyles((theme) => ({
    boxCodeInvite: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        width: '100%',

        padding: '2px 16px 2px',

        backgroundColor: 'rgba(168, 171, 184, 0.05)',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.3)',
        borderRadius: 5,

        fontSize: 16,
        lineHeight: '19px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        '& svg': {
            width: 15
        }
    }
}));

export default FormSecondary
