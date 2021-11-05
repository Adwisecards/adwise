import React from "react";
import {
    Box,
    Button,
    Tooltip,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    ImageUploadEdit,

} from "../../../../../components";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const DocumentsForm = (props) => {
    const {values, touched, errors, onChange} = props;
    const classes = useStyles();

    const handleOnChangeImage = (file, name) => {
        let newValues = {...values};
        newValues[name] = file;
        onChange(newValues);
    }

    const _getImage = (image) => {
        if (!image) {
            return null
        }

        return URL.createObjectURL(image)
    }

    return (
        <>

            <Box mb={4}>

                <Typography variant="formTitle">
                    {allTranslations(localization['coupons_create.documentsForm.picture'])}
                </Typography>
                <Typography className={classes.caption}>
                    {allTranslations(localization['coupons_create.documentsForm.pictureCaption'])}
                </Typography>

                <ImageUploadEdit
                    picture={_getImage(values.picture)}
                    onChange={(file) => handleOnChangeImage(file, 'picture')}

                    initialAspect={4 / 4}
                >
                    {(props) => {
                        const {onOpenModal} = props;
                        return (
                            <Button onClick={onOpenModal} variant="outlined" className={classes.button}>
                                {Boolean(values.picture) ? values.picture?.name : allTranslations(localization['coupons_create.documentsForm.pictureButton'])}
                            </Button>
                        )
                    }}
                </ImageUploadEdit>

            </Box>

            <Box>

                <Typography variant="formTitle">
                    {allTranslations(localization['coupons_create.documentsForm.termsDocument'])}
                </Typography>

                <label>

                    <input
                        accept=".doc, .docx, .pdf"
                        hidden
                        className={classes.input}
                        type="file"

                        onChange={({target:{ files }}) => handleOnChangeImage(files[0], 'termsDocumentMediaId')}
                    />

                    <Button component="span" variant="outlined" className={classes.button}>
                        {Boolean(values.termsDocumentMediaId) ? values.termsDocumentMediaId?.name : allTranslations(localization['coupons_create.documentsForm.termsDocumentButton'])}
                    </Button>

                </label>

            </Box>

        </>
    )
}

const useStyles = makeStyles(() => ({
    caption: {
        marginTop: 8,

        fontSize: 14,
        lineHeight: '17px',
        color: '#999DB1',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    button: {
        marginTop: 20,
        fontSize: 16,
        lineHeight: '16px',
        padding: '12px 24px',
        fontWeight: 'normal'
    },
    input: {
        position: ""
    }
}));

export default DocumentsForm
