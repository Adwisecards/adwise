import React, {useRef, useState, useEffect} from "react";
import {
    Box,

    TextField,

    Typography,

    FormControl,
    FormHelperText,

    Select,
    MenuItem
} from '@material-ui/core';
import {} from '@material-ui/styles';
import {
    TagsMultiple
} from '../../components';
import * as Yup from "yup";
import {Formik} from "formik";
import axiosInstance from "../../../../../agent/agent";
import urls from "../../../../../constants/urls";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const validationSchema = Yup.object().shape({
    tags: Yup.array().min(1).of(Yup.string().required(allTranslations(localization.yupValidationRequired))),
    category: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)).nullable(allTranslations(localization.organizationAboutErrorsPlaceId)),
});

const FormSecondary = (props) => {
    const {setRef, organization, onChangeOrganization, isGlobalDisabled} = props;
    const [optionsCategories, setOptionsCategories] = useState([]);

    useEffect(() => {
        (async () => {
            await onLoadCategoriesList();
        })();
    }, []);

    const onLoadCategoriesList = async () => {
        const response = await axiosInstance.get(urls["get-categories"]).then((response) => {
            return response.data.data.categories
        });

        setOptionsCategories(response);
    }

    const handleOnChangeSelect = ({target}) => {
        let newOrganization = {...organization};
        newOrganization['category'] = {
            _id: target.value
        };

        onChangeOrganization(newOrganization)
    }
    const handleOnChangeTags = (tags) => {
        let newOrganization = {...organization};

        newOrganization['tags'] = tags;

        onChangeOrganization(newOrganization)
    }

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
                        <Box mb={5}>
                            <Typography variant="formTitle">{allTranslations(localization.organizationAboutFormsCategory)}</Typography>

                            <FormControl
                                fullWidth
                                variant={"outlined"}
                                name={'category'}
                                placeholder={allTranslations(localization.organizationAboutPlaceholdersPleaseIndicate)}
                                disabled={isGlobalDisabled}
                                error={Boolean(touched.category && errors.category)}
                                helperText={touched.category && errors.category}

                                margin="normal"
                            >
                                <Select
                                    value={organization.category ? organization.category._id : null}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    placeholder={allTranslations(localization.organizationAboutPlaceholdersPleaseIndicate)}
                                    onChange={handleOnChangeSelect}
                                >
                                    {
                                        optionsCategories.map((category, idx) => (
                                            <MenuItem
                                                idx={`category-${idx}`}
                                                value={category._id}
                                            >{category.name}</MenuItem>
                                        ))
                                    }
                                </Select>

                                {
                                    (Boolean(touched.category && errors.category)) ? ( <FormHelperText>{ errors.category }</FormHelperText> ) : (
                                        <FormHelperText>{allTranslations(localization.organizationAboutIndicateMainTypeActivity)}</FormHelperText>
                                    )
                                }
                            </FormControl>
                        </Box>

                        <Box mb={5}>
                            <TagsMultiple
                                organization={organization}
                                onChange={handleOnChangeTags}

                                error={touched.tags && errors.tags}
                            />
                        </Box>
                    </form>
                )
            }}
        </Formik>
    )
}

export default FormSecondary
