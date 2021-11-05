import React, {useRef, useState, useEffect} from "react";
import {
    Box,

    Grid,

    TextField,
    InputAdornment,
    FormControlLabel,

    Typography,

    CircularProgress,

    Button,

    Switch
} from '@material-ui/core';
import {} from '@material-ui/styles';
import {
    Autocomplete
} from '@material-ui/lab';
import {
    ImagesUpload
} from '../../components';
import * as Yup from "yup";
import {Formik} from "formik";

const validationSchema = Yup.object().shape({
    name: Yup.string().max(100).required('Заполните поле'),
    description: Yup.string().max(100).required('Заполните поле'),
    code: Yup.string().max(100).required('Заполните поле')
});

const FormMain = (props) => {
    const {setRef, products, onChangePicture, picture, onSubmitForm, onChangeForm} = props;

    const handleSubmit = (form, event) => {
        onSubmitForm(form, event);
    }

    const handleOnChange = ({ target }) => {
        const name = target.name;
        const value = target.value;

        let newProducts = {...products};
        newProducts[name] = value;

        onChangeForm(newProducts)
    }
    const handleOnChangeSwitch = ({ target }, value) => {
        const name = target.name;

        let newProducts = {...products};
        newProducts[name] = !value;

        onChangeForm(newProducts)
    }

    return (
        <Formik
            innerRef={setRef}

            initialValues={products}
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
                    <Grid container spacing={8}>

                        <Grid item xs={6}>
                            <Box mb={5}>
                                <Typography variant={'formTitle'}>Наименование</Typography>

                                <TextField
                                    name={'name'}
                                    margin={"normal"}
                                    variant={"outlined"}
                                    placeholder={"Приточная вентиляция"}

                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}

                                    fullWidth

                                    onChange={handleOnChange}
                                />

                            </Box>

                            <Box mb={5}>
                                <Typography variant={'formTitle'}>Описание</Typography>

                                <TextField
                                    name={'description'}
                                    margin={"normal"}
                                    variant={"outlined"}
                                    placeholder={"Текстовое описание в пару слов и строк"}

                                    error={Boolean(touched.description && errors.description)}
                                    helperText={touched.description && errors.description}

                                    fullWidth
                                    multiline

                                    rows={3}
                                    rowsMax={5}

                                    onChange={handleOnChange}
                                />

                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mb={5}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Typography variant={'formTitle'}>Цена</Typography>

                                        <TextField
                                            name={'price'}
                                            margin={"normal"}
                                            variant={"outlined"}
                                            placeholder={"18 000"}

                                            type={'number'}

                                            style={{ maxWidth: 150 }}

                                            error={Boolean(touched.price && errors.price)}
                                            helperText={touched.price && errors.price}

                                            fullWidth

                                            onChange={handleOnChange}

                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        ₽
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                    </Grid>
                                    <Grid item>
                                        <Typography variant={'formTitle'}>Артикул</Typography>

                                        <TextField
                                            name={'code'}
                                            margin={"normal"}
                                            variant={"outlined"}
                                            placeholder={"650870168"}

                                            style={{ maxWidth: 150 }}

                                            error={Boolean(touched.code && errors.code)}
                                            helperText={touched.code && errors.code}

                                            fullWidth

                                            onChange={handleOnChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box>
                                <Typography variant={'formTitle'}>Фотографии</Typography>

                                <ImagesUpload
                                    products={products}

                                    picture={picture}
                                    onChangePicture={onChangePicture}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} alignItems={'center'}>
                            <Grid container spacing={4}>
                                <Grid item>
                                    <Button variant={"contained"} onClick={handleSubmit}>Сохранить</Button>
                                </Grid>
                                <Grid item>
                                    <FormControlLabel
                                        value="start"
                                        name={'disabled'}
                                        control={<Switch name={'disabled'} checked={!products.disabled} color="primary" onChange={handleOnChangeSwitch}/>}
                                        label="Включить сразу"
                                        labelPlacement="start"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                )
            }}
        </Formik>
    )
}

export default FormMain
