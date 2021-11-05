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
    Camera as CameraIcon,
    X as XIcon
} from 'react-feather';
import {
    PlugsOrganizationBackground
} from '../../../../../icons';
import common from "../../../../../constants/common";
import {ImageUploadEdit} from "../../../../../components";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const UploadMainPicture = (props) => {
    const {organization, mainPicture, onChangeMainPicture, onChangeOrganization} = props;
    const {colors, primaryColor} = organization;
    const classes = useStyles();

    const handleOnChange = (file) => {
        onChangeMainPicture(file);
    }

    const handleGetImage = () => {
        if (typeof mainPicture === 'object') {
            return URL.createObjectURL(mainPicture);
        }

        return mainPicture
    }

    const handleRemoveImage = () => {
        let newOrganization = {...organization};

        newOrganization['mainPicture'] = '';

        onChangeOrganization(newOrganization);
    }

    return (
        <Box>
            <ImageUploadEdit
                labelKey={'organization-about-main-picture'}
                picture={handleGetImage()}
                onChange={handleOnChange}

                initialAspect={16 / 9}
            >
                {({
                      value,
                      onOpenModal
                  }) => (
                    <Box className={classes.box}>
                        <div className={classes.conatainerButtonUpload}>
                            <div className={classes.imageContainer} onClick={onOpenModal}>
                                {
                                    (!!value || organization.mainPicture) ? (
                                        <img src={value} className={classes.image}/>
                                    ) : (
                                        <div className={classes.image} style={{backgroundColor: primaryColor}}>
                                            <PlugsOrganizationBackground/>
                                        </div>
                                    )
                                }
                                <Button className={classes.buttonUpload} component="div">
                                    <CameraIcon color={primaryColor}/>
                                </Button>
                            </div>

                            <Button className={classes.buttonRemove} onClick={handleRemoveImage}>
                                <XIcon color={primaryColor}/>
                            </Button>
                        </div>

                        <Typography
                            className={classes.description}
                            dangerouslySetInnerHTML={{ __html: allTranslations(localization.organizationAboutImageMinimal375x242) }}
                        />
                    </Box>
                )}
            </ImageUploadEdit>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},

    imageContainer: {
        position: 'relative',
        height: 240
    },
    image: {
        width: '100%',
        height: '100%',

        objectFit: 'cover',

        borderRadius: 5
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

        color: '#9FA3B7',

        marginTop: 8
    },

    conatainerButtonUpload: {
        position: 'relative',
        cursor: 'pointer'
    },
    buttonUpload: {
        position: 'absolute',
        right: 16,
        bottom: 16,

        backgroundColor: 'white!important',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.25)',

        width: 32,
        minWidth: 32,
        height: 32,

        borderRadius: '100%'
    },
    buttonRemove: {
        position: 'absolute',
        right: 64,
        bottom: 16,

        backgroundColor: 'white!important',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.25)',

        width: 32,
        minWidth: 32,
        height: 32,

        borderRadius: '100%'
    },
}));

export default UploadMainPicture
