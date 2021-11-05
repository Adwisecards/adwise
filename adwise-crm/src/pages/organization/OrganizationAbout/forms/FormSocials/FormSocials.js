import React, {useRef, useState, useEffect} from "react";
import {
    Box
} from '@material-ui/core';
import {} from '@material-ui/styles';
import {
    SocialsLinks
} from '../../components';
import * as Yup from "yup";
import {Formik} from "formik";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const validationSchema = Yup.object().shape({
    tags: Yup.array().min(1).of(Yup.string().required(allTranslations(localization.yupValidationRequired)))
});

const FormSocials = (props) => {
    const {setRef, organization, onChange} = props;

    const handleSubmit = () => {}

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
                    <form>
                        <Box>
                            <SocialsLinks
                                organization={organization}
                                onChange={onChange}
                            />
                        </Box>
                    </form>
                )
            }}
        </Formik>
    )
}

export default FormSocials
