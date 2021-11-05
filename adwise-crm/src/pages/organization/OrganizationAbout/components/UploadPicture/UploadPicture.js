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
import {
    ImageUploadEdit
} from '../../../../../components';
import common from "../../../../../constants/common";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const UploadPicture = (props) => {
    const { organization, onChangePicture, picture } = props;
    const { primaryColor } = organization || {};
    const classes = useStyles();

    const handleOnChange = (file) => {
        onChangePicture(file);
    }

    const handleGetImage = () => {
        if (typeof picture === 'object') {
            return URL.createObjectURL(picture);
        }

        return picture
    }

    return (
        <ImageUploadEdit
            picture={handleGetImage()}
            onChange={handleOnChange}

            initialAspect={4/4}
        >
            {({
                  value,
                  onOpenModal
              }) => (
                <Box className={classes.box}>
                    <div className={classes.conatainerButtonUpload} onClick={onOpenModal}>
                        <div className={classes.imageContainer}>
                            {
                                (value) ? (
                                    <img src={value}
                                         className={classes.image}/>
                                ) : (
                                    <div className={classes.image}>
                                        <PlugsOrganizationLogo color={primaryColor}/>
                                    </div>
                                )
                            }
                            <Button className={classes.buttonUpload} component="span">
                                <CameraIcon color={primaryColor}/>
                            </Button>
                        </div>
                    </div>

                    <Typography
                        className={classes.description}
                        dangerouslySetInnerHTML={{ __html: allTranslations(localization.organizationAboutImageMinimal200x200) }}
                    />
                </Box>
            )}
        </ImageUploadEdit>
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
