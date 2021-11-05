import React, {useState} from 'react'
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import {DropzoneArea} from 'material-ui-dropzone'
import IconUplode from './IconUploade';
import {
    Box,
    Button,
    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const ImageUpload = (props) => {
    const [files, setFiles] = useState([]);
    const theme = createMuiTheme({
        overrides: {
            MuiDropzoneArea: {
                textContainer: {
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    height: '70%'
                },
                active: {
                    borderColor: '#C4A2FC',
                    backgroundImage: 'repeating-linear-gradient(-45deg, #fff, #fff 25px, rgba(196,162,252, 0.2) 25px, rgba(196,162,252, 0.2) 50px)',
                },
                root: {
                    maxWidth: '100%',
                    height: 603
                }
            }
        },
    });
    const useStyles = makeStyles((theme) => ({
        box: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            textTransform: 'none',
            width: 454,
        },
        h6: {
            fontWeight: '400',
            marginBottom: '16px'
        },
        body2: {
            color: '#9FA3B7',
            marginBottom: '20px'
        },
        button: {
            width: 170,
            height: 38,
            background: '#8152E4',
            fontSize: 16,
            color: 'white',
            textTransform: 'none',
            alignSelf: 'center',
            '&:hover': {
                color: '#8152E4',
            }
        },
    }));
    const classes = useStyles();

    return (
        <MuiThemeProvider theme={theme}>
            <DropzoneArea
                onChange={(files) => {
                    setFiles(files)
                }}
                dropzoneText={
                    (
                        <Box component="p" className={classes.box}>
                            <Typography variant="h6" className={classes.h6} gutterBottom>
                                {allTranslations(localization['imagesUpload.title'])}
                            </Typography>
                            <Typography variant="body2" className={classes.body2} gutterBottom>
                                {allTranslations(localization['imagesUpload.message'])}
                            </Typography>
                            <Button
                                className={classes.button}>{allTranslations(localization['imagesUpload.button'])}</Button>
                        </Box>
                    )}
                acceptedFiles={['image/jpeg', 'image/png']}
                maxFileSize={3000000} //размер в байтах
                filesLimit={10}
                showFileNames={true}
                Icon={IconUplode}
            />
        </MuiThemeProvider>
    )

}

export default ImageUpload;
