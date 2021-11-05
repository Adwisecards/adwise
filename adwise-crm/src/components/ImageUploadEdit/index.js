import React, {useState, useRef, useEffect, useCallback} from "react";
import {
    Box,

    Typography,

    Grid,

    Button,

    IconButton,

    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    RefreshCw as RefreshCwIcon
} from 'react-feather';
import ReactCrop from 'react-image-crop';
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const pixelRatio = window.devicePixelRatio || 1;

const ImageUploadEdit = (props) => {
    const {picture, onChange, initialAspect, labelKey} = props;


    // states component
    const [value, setValue] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isOpenModal, setOpenModal] = useState(false);
    const [crop, setCrop] = useState({
        aspect: initialAspect,
        width: 100
    });
    const [completedCrop, setCompletedCrop] = useState(null);

    // refs components
    const refUploadPicture = useRef();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    useEffect(() => {
        if (!completedCrop || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const crop = completedCrop;
        const canvas = previewCanvasRef.current;

        const cropWidth = (crop.width > 0) ? crop.width : 50;
        const cropHeight = (crop.height > 0) ? crop.height : 50;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");

        canvas.width = cropWidth * pixelRatio;
        canvas.height = cropHeight * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            cropWidth * scaleX,
            cropHeight * scaleY,
            0,
            0,
            cropWidth,
            cropHeight
        );
    }, [completedCrop]);

    const classes = useStyles();

    const handleUploadRefresh = () => {
        setCrop({
            aspect: initialAspect,
            width: 100
        });
        imgRef.current = null;
        setCompletedCrop(null);
        setImageFile(null);
        setValue(null);
    }


    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleOnSave = async () => {
        const blob = await generateFile(previewCanvasRef, completedCrop);
        const image = await generateFileImage(blob, 'image.jpg');

        onChange(image);
        setValue(null);
        setImageFile(null);
        setOpenModal(false);

        refUploadPicture.current.value = null;
    }

    const handleSetImages = ({target}) => {
        const {files} = target;
        const file = files[0];
        const url = URL.createObjectURL(file);

        setValue(url);
        setImageFile(file);
    }

    const handleLoadImage = useCallback((img) => {
        imgRef.current = img;
    }, []);

    return (
        <>
            <Box>
                {
                    props.children({
                        value: picture,
                        onOpenModal: handleOpenModal
                    })
                }
            </Box>

            <Dialog
                fullWidth
                maxWidth="lg"
                open={isOpenModal}
                onClose={() => setOpenModal(false)}
            >
                <DialogTitle>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Typography variant="h3">{allTranslations(localization['imageUploadEdit.title'])}</Typography>
                        </Grid>
                        <Grid item>
                            <Box>
                                <IconButton onClick={handleUploadRefresh}>
                                    <RefreshCwIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogTitle>

                <DialogContent className={classes.body}>

                    <Typography variant="subtitle1">{allTranslations(localization['imageUploadEdit.subtitle'])}</Typography>

                    {
                        (!value) ? (
                            <label>
                                <Box className={classes.bodyUploadBox}>
                                    <Button variant="text" component="span">{allTranslations(localization['imageUploadEdit.button'])}</Button>
                                </Box>

                                <input
                                    ref={refUploadPicture}
                                    accept="image/*"
                                    className={classes.input}
                                    type="file"

                                    onChange={handleSetImages}
                                />
                            </label>
                        ) : (
                            <Box className={classes.bodyReactCrop}>
                                <ReactCrop
                                    src={value}
                                    crop={crop}
                                    onImageLoaded={handleLoadImage}
                                    onChange={newCrop => setCrop(newCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                />
                            </Box>
                        )
                    }
                </DialogContent>

                <DialogContent>
                    <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                            <Button size="small" variant="contained" onClick={handleOnSave}>{allTranslations(localization['imageUploadEdit.buttonUpload'])}</Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" variant="outlined"
                                    onClick={() => setOpenModal(false)}>{allTranslations(localization['imageUploadEdit.buttonCancel'])}</Button>
                        </Grid>
                    </Grid>
                </DialogContent>

            </Dialog>

            <canvas
                ref={previewCanvasRef}

                style={{
                    width: 0,
                    height: 0,
                    opacity: 0
                }}
            />
        </>
    )
}

function generateFile(previewCanvas, crop) {
    if (!crop || !previewCanvas) {
        return;
    }

    const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            blob.name = 'image.jpg';
            resolve(blob);
        }, 'image/jpeg', 1);
    });
}
function generateFileImage(blob){
    blob.lastModifiedDate = new Date();
    blob.fileName = 'image.jpg';

    return new File([blob], 'image.jpg', {
        type: "image/png"
    })
}
function getResizedCanvas(canvas, newWidth, newHeight) {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = newWidth;
    tmpCanvas.height = newHeight;

    const ctx = tmpCanvas.getContext("2d");
    ctx.drawImage(
        canvas.current,
        0,
        0,
        canvas.current.width,
        canvas.current.height,
        0,
        0,
        newWidth,
        newHeight
    );

    return tmpCanvas;
}

const useStyles = makeStyles((theme) => ({
    body: {
        // pointerEvents: 'none'
    },

    input: {
        width: 0,
        opacity: 0
    },

    bodyUploadBox: {
        minHeight: 300,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(129, 82, 228, 0.1)',

        borderRadius: 10,
        border: '1px dashed #8152E4',
        cursor: 'pointer'
    },
    bodyReactCrop: {
        minHeight: 300,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(129, 82, 228, 0.1)',
        borderRadius: 10,
        border: '1px dashed #8152E4'
    },
}));

ImageUploadEdit.defaultProps = {
    initialAspect: 16 / 9
}

export default ImageUploadEdit
