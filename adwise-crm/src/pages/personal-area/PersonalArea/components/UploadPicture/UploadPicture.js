import React from "react";
import {
    Box,
    Grid,

    Typography,

    Button
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Camera as CameraIcon
} from 'react-feather';
import {
    PlugsOrganizationLogo
} from '../../../../../icons';
import common from "../../../../../constants/common";
import {ImageUploadEdit} from "../../../../../components";

const UploadPicture = (props) => {
    const {
        account, onChangePicture, picture
    } = props;
    const classes = useStyles();

    const handleOnChange = (file) => {
        onChangePicture(file);
    }

    const handleGetImage = () => {
        return URL.createObjectURL(picture);
    }

    return (
        <Box>
            <ImageUploadEdit
                picture={(!!picture) ? handleGetImage() : account.picture}
                onChange={handleOnChange}

                initialAspect={4 / 4}
            >
                {({
                      value,
                      onOpenModal
                  }) => (
                    <Box className={classes.box}>
                        <div className={classes.conatainerButtonUpload}>
                            <div className={classes.imageContainer} onClick={onOpenModal}>
                                {
                                    (value) ? (
                                        <img src={value}
                                             className={classes.image}/>
                                    ) : (
                                        <div className={classes.image}>
                                            <PlugsOrganizationLogo/>
                                        </div>
                                    )
                                }
                                <Button className={classes.buttonUpload} component="span">
                                    <CameraIcon color={"#8152E4"}/>
                                </Button>
                            </div>
                        </div>

                        <Typography className={classes.description}>
                            Минимальное разрешение 200х200. Изображения из интернета и фотографии использовать не рекомендуется
                        </Typography>
                    </Box>
                )}
            </ImageUploadEdit>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},

    box: {
        display: 'flex',
        alignItems: 'center'
    },

    imageContainer: {
        width: 94,
        height: 94,

        position: 'relative',

        marginRight: 16
    },
    image: {
        borderRadius: '100%',

        objectFit: 'cover',

        width: '100%',
        height: '100%'
    },

    input: {
        display: 'none',
        width: 0,
        height: 0,
        opacity: 0
    },

    description: {
        flex: 1,

        fontFamily: 'Atyp Display',
        fontSize: 12,
        lineHeight: '14px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#9FA3B7'
    },

    conatainerButtonUpload: {
        position: 'relative',

        cursor: 'pointer'
    },
    buttonUpload: {
        position: 'absolute',
        right: -8,
        bottom: -8,

        backgroundColor: 'white!important',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.25)',

        width: 32,
        minWidth: 32,
        height: 32,

        borderRadius: '100%'
    },
}));

export default UploadPicture
