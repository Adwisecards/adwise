import React from "react";
import {
    Box,
    Grid,
    Button,
    Popover,
    MenuItem,
    Typography,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import clsx from "clsx";
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import i18n from "i18n-js";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const languageList = {
  "ru": {
      image: "/language/russia.svg",
      name: allTranslations(localization['languageSelection.ru'])
  },
  "en": {
      image: "/language/english.svg",
      name: allTranslations(localization['languageSelection.en'])
  },
};

const LanguageSelection = (props) => {
    const classes = useStyles();
    const locale = i18n?.locale || 'ru';

    const handleChangeLanguage = (key) => {
        localStorage.setItem('language', key);
        i18n.locale = key;

        document.location.reload();
    }

    return (

        <>

            <PopupState variant="popover" popupId="demo-popup-popover">
                {(popupState) => (
                    <>

                        <Button className={clsx([classes.headerButton])} {...bindTrigger(popupState)}>
                            <img src={languageList[locale]['image']}/>

                            <Typography className={classes.headerButtonTitle}>{languageList[locale]['name']}</Typography>
                        </Button>

                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            elevation={1}
                        >
                            {
                                Object.keys(languageList).map((key) => {
                                    const language = languageList[key];

                                    return (
                                        <MenuItem onClick={() => handleChangeLanguage(key)}>
                                            <Grid container spacing={1} alignItems="center">
                                                <Grid item>
                                                    <img src={language.image}/>
                                                </Grid>
                                                <Grid item>
                                                    <Typography className={classes.headerButtonTitle}>{language.name}</Typography>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                    )
                                })
                            }
                        </Popover>
                    </>
                )}
            </PopupState>

        </>
    )
}

const useStyles = makeStyles((theme) => ({
    headerButton: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        padding: '6px 16px',

        '& p': {
            marginLeft: 8
        }
    },
    headerButtonTitle: {
        fontSize: 15,
        lineHeight: '15px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        letterSpacing: "0.02em",
        color: theme.palette.text.primary,

        opacity: 0.7
    },
}));

export default LanguageSelection
