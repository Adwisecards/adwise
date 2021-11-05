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
    PlugsOrganizationBackground
} from '../../../../../icons';
import common from "../../../../../constants/common";
import {ImageUploadEdit} from "../../../../../components";

const ImagesUpload = (props) => {
    const {picture, products, onChangePicture} = props;
    const classes = useStyles();

    const handleOnChange = (file) => {
        onChangePicture(file);
    }

    const handleGetImage = () => {
        return URL.createObjectURL(picture);
    }

    return (
        <Box>
            <Box className={classes.box}>
                <Typography className={classes.description}>
                    Можно загрузить еще 5 фотографий JPG или PNG, минимальное разрешение 400*400рх, размер не более 3мб
                </Typography>

                <ImageUploadEdit
                    picture={(!!picture) ? handleGetImage() : products.picture}
                    onChange={handleOnChange}

                    initialAspect={4 / 4}
                >
                    {({
                          value,
                          onOpenModal
                      }) => (
                          <>
                              <Box my={2}>
                                  <div className={classes.conatainerButtonUpload}>
                                      <Button component={'span'} variant={"outlined"} className={classes.buttonUpload} onClick={onOpenModal}>
                                          Загрузить фото
                                      </Button>
                                  </div>
                              </Box>

                              <div className={classes.imageContainer}>
                                  {
                                      (value) ? (
                                          <img src={value}
                                               className={classes.image}/>
                                      ) : (
                                          <div className={classes.image} style={{ backgroundColor: '#8152E4' }}>
                                              <PlugsOrganizationBackground color={'#8152E4'}/>
                                          </div>
                                      )
                                  }
                              </div>
                          </>
                    )}
                </ImageUploadEdit>

            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {},

    box: {},

    imageContainer: {
        width: 230,
        height: 230,

        position: 'relative',

        marginRight: 16
    },
    image: {
        width: '100%',
        height: '100%',

        borderRadius: 5,

        objectFit: 'cover'
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
        fontSize: 16,

        textTransform: 'initial'
    },
}));

export default ImagesUpload
