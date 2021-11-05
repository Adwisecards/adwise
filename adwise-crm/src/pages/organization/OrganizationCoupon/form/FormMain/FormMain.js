import React, {useRef, useState, useEffect} from "react";
import {
    Box,

    InputAdornment,
    FormControl,
    MenuItem,
    Select,
    FormHelperText,

    TextField,

    Typography,

    Button
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    DateRange,
    UploadPicture
} from '../../components';
import * as Yup from "yup";
import {Formik} from "formik";
import MyRegexp from "myregexp";


const FormMain = (props) => {
    const {share} = props;
    const classes = useStyles();

    return (
        <>
            <Box mb={5}>
                <Typography variant="formTitle">Название</Typography>

                <TextField
                    fullWidth
                    placeholder={"Контурная пластика губ"}
                    margin="normal"
                    name="name"
                    value={share.name}
                    variant="outlined"
                    disabled
                />
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle">Описание</Typography>

                <TextField
                    fullWidth
                    placeholder={"Описание акции"}
                    margin="normal"
                    name="description"
                    value={share.description}
                    variant="outlined"

                    rows={5}
                    rowsMax={8}
                    multiline
                    disabled
                />
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle">Количество использований акции</Typography>

                <TextField
                    fullWidth
                    placeholder={"20"}
                    margin="normal"
                    name="quantity"
                    type={'number'}
                    value={share.quantity}
                    variant="outlined"
                    disabled
                />
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle">Период проведения акции</Typography>

                <Box mt={2}>
                    <DateRange share={share}/>
                </Box>
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle">Стоимость акции</Typography>

                <TextField
                    fullWidth
                    placeholder={"Не задано"}
                    margin="normal"
                    name="price"
                    type={'number'}
                    value={share.price}
                    variant="outlined"
                    disabled
                />
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle">Изображения</Typography>

                <UploadPicture
                    share={share}
                />
            </Box>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {}
}));

export default FormMain
