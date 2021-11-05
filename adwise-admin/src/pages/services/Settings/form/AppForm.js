import React from "react";
import {
    Box,
    Grid,
    Button,
    Switch,
    TextField,
    Typography, Link
} from "@material-ui/core";
import {

} from "@material-ui/styles";
import {Formik} from "formik";
import {
    X as XIcon
} from "react-feather";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    "app.cards.android.versions.deprecated": Yup.string().required('Обязательно к заполнению'),
    "app.cards.android.versions.latest": Yup.string().required('Обязательно к заполнению'),
    "app.cards.android.versions.stable": Yup.string().required('Обязательно к заполнению'),
    "app.cards.ios.versions.deprecated": Yup.string().required('Обязательно к заполнению'),
    "app.cards.ios.versions.latest": Yup.string().required('Обязательно к заполнению'),
    "app.cards.ios.versions.stable": Yup.string().required('Обязательно к заполнению'),

    "app.business.android.versions.deprecated": Yup.string().required('Обязательно к заполнению'),
    "app.business.android.versions.latest": Yup.string().required('Обязательно к заполнению'),
    "app.business.android.versions.stable": Yup.string().required('Обязательно к заполнению'),
    "app.business.ios.versions.deprecated": Yup.string().required('Обязательно к заполнению'),
    "app.business.ios.versions.latest": Yup.string().required('Обязательно к заполнению'),
    "app.business.ios.versions.stable": Yup.string().required('Обязательно к заполнению'),
});

const SettingsForm = (props) => {
    const { innerRef, initialForm, onChangeForm, onSaveSettings } = props;

    const handleOnChangeForm = ({ target }) => {
        const { name, value } = target;

        let newForm = initialForm;

        newForm[name] = value;

        onChangeForm(newForm);
    }

    return (
        <>

            <Formik
                innerRef={innerRef}
                initialValues={initialForm}
                validationSchema={validationSchema}
                onSubmit={onSaveSettings}
            >
                {(props) => {
                    const { errors, isSubmitting, touched, values, handleSubmit } = props;

                    return (
                        <>

                            <Grid container spacing={2}>

                                <Grid item xs={6}>

                                    <Box mb={3}>
                                        <Typography variant="h4">IOS</Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="h5">AdWise Cards</Typography>
                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Cтабильная</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.cards.ios.versions.stable'] && errors['app.cards.ios.versions.stable'])}
                                            helperText={touched['app.cards.ios.versions.stable'] && errors['app.cards.ios.versions.stable']}
                                            margin="normal"
                                            name="app.cards.ios.versions.stable"
                                            placeholder="..."
                                            value={values['app.cards.ios.versions.stable']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Последняя</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.cards.ios.versions.latest'] && errors['app.cards.ios.versions.latest'])}
                                            helperText={touched['app.cards.ios.versions.latest'] && errors['app.cards.ios.versions.latest']}
                                            margin="normal"
                                            name="app.cards.ios.versions.latest"
                                            placeholder="..."
                                            value={values['app.cards.ios.versions.latest']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Не поддерживается</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.cards.ios.versions.deprecated'] && errors['app.cards.ios.versions.deprecated'])}
                                            helperText={touched['app.cards.ios.versions.deprecated'] && errors['app.cards.ios.versions.deprecated']}
                                            margin="normal"
                                            name="app.cards.ios.versions.deprecated"
                                            placeholder="..."
                                            value={values['app.cards.ios.versions.deprecated']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>

                                    <hr/>


                                    <Box mt={2} mb={2}>
                                        <Typography variant="h5">AdWise Business</Typography>
                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Cтабильная</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.business.ios.versions.stable'] && errors['app.business.ios.versions.stable'])}
                                            helperText={touched['app.business.ios.versions.stable'] && errors['app.business.ios.versions.stable']}
                                            margin="normal"
                                            name="app.business.ios.versions.stable"
                                            placeholder="..."
                                            value={values['app.business.ios.versions.stable']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Последняя</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.business.ios.versions.latest'] && errors['app.business.ios.versions.latest'])}
                                            helperText={touched['app.business.ios.versions.latest'] && errors['app.business.ios.versions.latest']}
                                            margin="normal"
                                            name="app.business.ios.versions.latest"
                                            placeholder="..."
                                            value={values['app.business.ios.versions.latest']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Не поддерживается</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.business.ios.versions.deprecated'] && errors['app.business.ios.versions.deprecated'])}
                                            helperText={touched['app.business.ios.versions.deprecated'] && errors['app.business.ios.versions.deprecated']}
                                            margin="normal"
                                            name="app.business.ios.versions.deprecated"
                                            placeholder="..."
                                            value={values['app.business.ios.versions.deprecated']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>

                                </Grid>

                                <Grid item xs={6}>

                                    <Box mb={3}>
                                        <Typography variant="h4">Android</Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="h5">AdWise Cards</Typography>
                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Cтабильная</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.cards.android.versions.stable'] && errors['app.cards.android.versions.stable'])}
                                            helperText={touched['app.cards.android.versions.stable'] && errors['app.cards.android.versions.stable']}
                                            margin="normal"
                                            name="app.cards.android.versions.stable"
                                            placeholder="..."
                                            value={values['app.cards.android.versions.stable']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Последняя</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.cards.android.versions.latest'] && errors['app.cards.android.versions.latest'])}
                                            helperText={touched['app.cards.android.versions.latest'] && errors['app.cards.android.versions.latest']}
                                            margin="normal"
                                            name="app.cards.android.versions.latest"
                                            placeholder="..."
                                            value={values['app.cards.android.versions.latest']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Не поддерживается</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.cards.android.versions.deprecated'] && errors['app.cards.android.versions.deprecated'])}
                                            helperText={touched['app.cards.android.versions.deprecated'] && errors['app.cards.android.versions.deprecated']}
                                            margin="normal"
                                            name="app.cards.android.versions.deprecated"
                                            placeholder="..."
                                            value={values['app.cards.android.versions.deprecated']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>

                                    <hr/>


                                    <Box mt={2} mb={2}>
                                        <Typography variant="h5">AdWise Business</Typography>
                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Cтабильная</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.business.android.versions.stable'] && errors['app.business.android.versions.stable'])}
                                            helperText={touched['app.business.android.versions.stable'] && errors['app.business.android.versions.stable']}
                                            margin="normal"
                                            name="app.business.android.versions.stable"
                                            placeholder="..."
                                            value={values['app.business.android.versions.stable']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Последняя</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.business.android.versions.latest'] && errors['app.business.android.versions.latest'])}
                                            helperText={touched['app.business.android.versions.latest'] && errors['app.business.android.versions.latest']}
                                            margin="normal"
                                            name="app.business.android.versions.latest"
                                            placeholder="..."
                                            value={values['app.business.android.versions.latest']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>
                                    <Box mb={2}>

                                        <Typography variant="formTitle">Не поддерживается</Typography>

                                        <TextField
                                            fullWidth
                                            error={Boolean(touched['app.business.android.versions.deprecated'] && errors['app.business.android.versions.deprecated'])}
                                            helperText={touched['app.business.android.versions.deprecated'] && errors['app.business.android.versions.deprecated']}
                                            margin="normal"
                                            name="app.business.android.versions.deprecated"
                                            placeholder="..."
                                            value={values['app.business.android.versions.deprecated']}
                                            variant="outlined"
                                            onChange={handleOnChangeForm}
                                        />

                                    </Box>

                                </Grid>

                            </Grid>

                        </>
                    )
                }}
            </Formik>

        </>
    )
};

export default SettingsForm
