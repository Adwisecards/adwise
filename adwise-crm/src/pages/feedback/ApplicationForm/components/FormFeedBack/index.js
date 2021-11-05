import React, {useState, useRef} from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    TextField,
    Typography,
    FormHelperText,
    FormControl,
    Select,
    MenuItem, FormControlLabel, Checkbox
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    X as XIcon
} from "react-feather";
import {Formik} from "formik";
import * as Yup from "yup";
import MyRegexp from "myregexp";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const FormFeedBack = (props) => {
    const {innerRef, form, onChange, packets, onSubmit} = props;

    const classes = useStyles();
    const refImageUpload = useRef();

    const handleChange = ({ target }) => {
        const { value, name } = target;

        let newForm = {...innerRef.current.values};
        newForm[name] = value;

        onChange(newForm)
    }
    const handleChangeImages = ({ target }) => {
        const { files } = target;

        let newForm = {...innerRef.current.values};
        newForm.files.push(...files);

        refImageUpload.current.value = null;

        onChange(newForm);
    }
    const handleRemoveFile = (idx) => {
        let newForm = {...innerRef.current.values};
        newForm.files.splice(idx, 1);

        onChange(newForm)
    }

    const handleSubmit = (form, events) => {
        onSubmit(form)
    }

    return (
        <>

            <Formik
                innerRef={innerRef}
                initialValues={form}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(props) => {
                    const { values, errors, touched, handleSubmit } = props;

                    return (
                        <>

                            <Box mb={2}>
                                <Typography variant="formTitle">{allTranslations(localization.applicationFormFormMessageTitle)}</Typography>

                                <TextField
                                    fullWidth
                                    value={values.message}
                                    error={Boolean(touched.message && errors.message)}
                                    helperText={touched.message && errors.message}
                                    placeholder={allTranslations(localization.applicationFormFormMessagePlaceholder)}
                                    margin="normal"
                                    name="message"
                                    variant="outlined"

                                    multiline
                                    rows={4}
                                    rowsMax={7}

                                    onChange={handleChange}
                                />
                            </Box>

                            <Box mb={2}>
                                <Typography variant="formTitle">{allTranslations(localization.applicationFormFormPacketTitle)}</Typography>

                                <FormControl margin="normal" fullWidth>
                                    <Select
                                        name="packet"
                                        variant="outlined"
                                        error={Boolean(touched.packet && errors.packet)}
                                        helperText={touched.packet && errors.packet}
                                        value={values.packet}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">{allTranslations(localization.commonReset)}</MenuItem>
                                        {
                                            packets.map((packet, idx) => (
                                                <MenuItem key={`packet-${ idx }`} value={ packet._id }>{ packet.name } { formatMoney(packet.price) }{ currency[packet.currency] }</MenuItem>
                                            ))
                                        }
                                    </Select>
                                    {
                                        Boolean(touched.packet && errors.packet) && (
                                            <FormHelperText error>{ touched.packet && errors.packet }</FormHelperText>
                                        )
                                    }
                                </FormControl>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="formTitle">{allTranslations(localization.applicationFormFormEmailTitle)}</Typography>

                                <TextField
                                    fullWidth
                                    value={values.email}
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email && errors.email}
                                    placeholder={allTranslations(localization.applicationFormFormEmailPlaceholder)}
                                    margin="normal"
                                    name="email"
                                    variant="outlined"

                                    onChange={handleChange}
                                />
                            </Box>

                            <Box mb={2}>
                                <Typography variant="formTitle">{allTranslations(localization.applicationFormFormFilesTitle)}</Typography>

                                {
                                    Boolean(values.files.length > 0) && (
                                        <Box mt={2}>
                                            <Grid container spacing={1}>
                                                {
                                                    values.files.map((file, idx) => {

                                                        return (
                                                            <Grid item>
                                                                <Box className={classes.file}>
                                                                    <Typography className={classes.fileName}>{ file.name }</Typography>
                                                                    <Tooltip arrow title={allTranslations(localization.commonDelete)}>
                                                                        <Button className={classes.fileButtonRemove} onClick={() => handleRemoveFile(idx)}>
                                                                            <XIcon size={20}/>
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        </Box>
                                    )
                                }

                                <Box mt={2}>
                                    <label>

                                        <Tooltip arrow title={allTranslations(localization.feedbackFormUploadDocument)}>
                                            <Button variant="outlined" className={classes.buttonUploadFile} component="span">{allTranslations(localization.feedbackFormUploadDocument)}</Button>
                                        </Tooltip>

                                        <input
                                            ref={refImageUpload}

                                            type="file"
                                            multiple
                                            maxLength={10}
                                            accept=".doc, .docx, .pdf, image/x-png,image/gif,image/jpeg"

                                            style={{opacity: 0, width: 0, height: 0}}

                                            onChange={handleChangeImages}
                                        />

                                    </label>
                                </Box>



                                {
                                    Boolean(touched.files && errors.files) && (
                                        <FormHelperText error>{ touched.files && errors.files }</FormHelperText>
                                    )
                                }
                            </Box>

                            {
                                false && (
                                    <Box mb={2}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={values.iNeedManager}
                                                    onChange={({target}) => handleChange({ target: { name: target.name, value: !values.iNeedManager } })}
                                                    name="iNeedManager"
                                                />
                                            }
                                            label={allTranslations(localization.applicationFormNeedManager)}
                                        />
                                    </Box>
                                )
                            }

                            <Box mt={6}>
                                <Button
                                    style={{ padding: '4px 24px' }}
                                    variant="contained"
                                    onClick={handleSubmit}
                                >{allTranslations(localization.applicationFormSendApplication)}</Button>
                            </Box>

                        </>
                    )
                }}
            </Formik>
        </>
    )
};

const validationSchema = Yup.object().shape({
    message: Yup.string().max(255).required(allTranslations(localization.yupValidationRequired)),
    files: Yup.array().min(1, allTranslations(localization.yupValidationMin, {count: 1})),
    email: Yup.string().email(allTranslations(localization.yupValidationEmail)),
    packet: Yup.string().nullable().required(allTranslations(localization.applicationFormErrorEmptyPaket))
});

const useStyles = makeStyles((theme) => ({
    root: {},

    file: {
        border: '1px solid rgba(168, 171, 184, 0.6)',
        borderRadius: 6,
        padding: '10px 12px',

        display: 'flex',
        alignItems: 'center'
    },
    fileName: {
        fontSize: 14,
        lineHeight: '17px'
    },
    fileButtonRemove: {
        padding: 0,
        width: 20,
        minWidth: 20,
        height: 20,
        marginLeft: 8
    },

    buttonUploadFile: {
        fontSize: 16,
        fontWeight: 'normal',
        textTransform: 'initial',
        padding: '0px 24px'
    },
    buttonSend: {
        fontSize: 18,
        fontWeight: '500',
        textTransform: 'initial',
        padding: '4px 24px'
    },
}));

export default FormFeedBack
