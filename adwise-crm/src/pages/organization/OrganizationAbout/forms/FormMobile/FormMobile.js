import React, { useRef, useState } from "react";
import {
    Box,

    TextField,

    Typography,
} from '@material-ui/core';
import {
    makeStyles,
    useTheme
} from '@material-ui/styles';
import {
    UploadPicture,
    UploadMainPicture
} from '../../components';
import * as Yup from "yup";
import {Formik} from "formik";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const validationSchema = Yup.object().shape({});

const FormMobile = (props) => {
    const {
        setRef, organization, picture, mainPicture,
        onChangeMainPicture, onChangeOrganization,
        onChangePicture
    } = props;
    const classes = useStyles();
    const theme = useTheme();

    const handleSubmit = (form, event) => {}

    return (
        <Formik
            innerRef={setRef}

            initialValues={organization}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({
                  errors,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values
              }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Box mb={5}>
                            <Typography variant="formTitle" style={{ marginBottom: theme.spacing(2) }}>{allTranslations(localization.organizationAboutFormsLogo)}</Typography>

                            <UploadPicture
                                organization={organization}
                                picture={picture}
                                onChangePicture={onChangePicture}
                            />
                        </Box>

                        <Box mb={5}>
                            <Typography variant="formTitle" style={{ marginBottom: theme.spacing(2) }}>{allTranslations(localization.organizationAboutFormsBackground)}</Typography>

                            <UploadMainPicture
                                organization={organization}
                                mainPicture={mainPicture}
                                onChangeMainPicture={onChangeMainPicture}
                                onChangeOrganization={onChangeOrganization}
                            />
                        </Box>
                    </form>
                )
            }}
        </Formik>
    )
}

const useStyles = makeStyles((theme) => ({

}));

export default FormMobile
