import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Grid,
    Button,
    Typography,
    TextField,
    FormHelperText
} from "@material-ui/core";
import * as Yup from "yup";
import {Formik} from "formik";
import {
    OrganizationAutocomplete
} from "../../../../../components";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";
import axios from "axios";

const initialForm = {
    file: null,
    name: "",
    description: "",
    presentationUrl: "",
    index: ""
};

const DialogCreated = (props) => {
    const { isOpen, onClose, onCreate } = props;
    const formRef = useRef();

    const [form, setForm] = useState({...initialForm});
    const [organization, setOrganization] = useState("");

    useEffect(() => {
        setForm({...initialForm});
    }, [isOpen]);


    const handleOnSubmit = (form) => {
        onCreate(form);
    }
    const handleOnChangeForm = ({target}) => {
        const { name, value } = target;

        let newForm = {...form};
        newForm[name] = value;

        setForm(newForm);
        formRef.current.setValues(newForm);
    }
    const handleOnChangeFormFile = ({target}) => {
        const { name, files } = target;

        let newForm = {...form};
        newForm[name] = files[0];

        setForm(newForm);
        formRef.current.setValues(newForm);
    }

    const handleOnChangeOrganization = async (organizationId) => {
        setOrganization(organizationId);

        if (!organizationId) {
            return null
        }

        const data = await axiosInstance.get(`${apiUrls["get-organization"]}/${organizationId}`).then((res) => {
            return res.data.data.organization
        });
        let newForm = {...form};
        newForm.name = data.name;
        newForm.description = data.briefDescription;
        newForm.file = await axios.get(data.picture).then(res => {
            return res.data
        });

        console.log('newForm: ', newForm)

        setForm(newForm);
        formRef.current.setValues(newForm);
    }

    return (
        <Dialog
            open={isOpen}
            fullWidth
            maxWidth="md"
            onClose={onClose}
        >

            <DialogTitle>
                <Typography variant="h3">???????????????? ????????????????</Typography>
            </DialogTitle>

            <DialogContent>

                <Box mb={2}>
                    <Typography variant="formTitle">??????????????????????</Typography>

                    <OrganizationAutocomplete
                        name="organization"
                        placeholder="..."
                        value={organization}
                        initialValue={organization}

                        onChange={(event) => handleOnChangeOrganization(event.target.value)}
                    />
                </Box>

                <Formik
                    innerRef={formRef}
                    initialValues={form}
                    validationSchema={validationSchema}
                    onSubmit={handleOnSubmit}
                >
                    {({
                          errors,
                          handleSubmit,
                          isSubmitting,
                          touched,
                          values
                      }) => {
                        return (
                            <>
                                <Box mb={2}>
                                    <Typography variant="formTitle">????????????????</Typography>
                                    <TextField
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="??????????????"
                                        name="description"
                                        value={values.description}
                                        error={Boolean(touched.description && errors.description)}
                                        helperText={touched.description && errors.description}
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">???????????? ???? ?????????? ?? ??????????</Typography>
                                    <TextField
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="??????????????"
                                        name="presentationUrl"
                                        value={values.presentationUrl}
                                        error={Boolean(touched.presentationUrl && errors.presentationUrl)}
                                        helperText={touched.presentationUrl && errors.presentationUrl}
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">?????????????????????????? ??????????</Typography>
                                    <TextField
                                        margin="normal"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="??????????????"
                                        name="index"
                                        type="number"
                                        value={values.index}
                                        error={Boolean(touched.index && errors.index)}
                                        helperText={touched.index && errors.index}
                                        onChange={handleOnChangeForm}
                                    />
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="formTitle">??????????????????????</Typography>

                                    <label>

                                        {
                                            Boolean(!values.file) ? (
                                                <>
                                                    <Button component="span">?????????????????? ????????????</Button>
                                                </>
                                            ) : (
                                                <Grid container>
                                                    <Grid item>
                                                        <Box bgcolor="#ED8E00" px={2} py={1} borderRadius={4} style={{cursor: 'pointer'}}>
                                                            <Typography variant="h4">{values.file?.name}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            )
                                        }

                                        <input
                                            hidden
                                            name="file"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleOnChangeFormFile}
                                        />
                                    </label>

                                    {
                                        Boolean(touched.file && errors.file) && (
                                            <Typography variant="caption" color="error">{touched.file && errors.file}</Typography>
                                        )
                                    }

                                </Box>

                                <Box mt={4} mb={2}>
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid item>
                                            <Button variant="contained" size="small" onClick={handleSubmit}>??????????????</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="outlined" size="small" onClick={onClose}>????????????</Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                            </>
                        )
                    }}
                </Formik>
            </DialogContent>

        </Dialog>
    )
}

const validationSchema = Yup.object().shape({
    presentationUrl: Yup.string().max(999),
    description: Yup.string().max(999).required('?????????????????? ????????'),
    name: Yup.string().max(255).required('?????????????????? ????????'),
    file: Yup.mixed().required('????????????????').nullable(true),
});

export default DialogCreated
