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

const UploadPicture = (props) => {
    const {
        share, picture
    } = props;
    const classes = useStyles();

    const handleGetImage = () => {
        return URL.createObjectURL(picture);
    }

    return (
        <Box>
            <Box className={classes.box}>
                <div className={classes.imageContainer}>
                    {
                        (share.picture) ? (
                            <img src={(!!picture) ? handleGetImage() : share.picture} className={classes.image}/>
                        ) : (
                            <div className={classes.image}>
                                <PlugsOrganizationLogo/>
                            </div>
                        )
                    }
                </div>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},

    box: {
        marginTop: 16,

        display: 'flex',
        alignItems: 'center'
    },

    imageContainer: {
        width: 150,
        height: 100,

        position: 'relative',

        marginRight: 16
    },
    image: {
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
        position: 'absolute',
        right: -4,
        bottom: -4,
    },
    buttonUpload: {
        backgroundColor: 'white!important',
        boxShadow: '0 2px 3px rgba(0, 0, 0, 0.25)',

        width: 32,
        minWidth: 32,
        height: 32,

        borderRadius: '100%'
    },
}));

export default UploadPicture
