import React from "react";
import {
    Box,
    Grid,
    Button,
    Popover,
    IconButton,
    Typography,
} from "@material-ui/core";
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import {
    makeStyles
} from "@material-ui/styles";
import {
    RotateCcw as RotateCcwIcon
} from "react-feather";
import allTranslations from "../../../../../../localization/allTranslations";
import localization from "../../../../../../localization/localization";

const Filter = (props) => {
    const {  } = props;
    const classes = useStyles();

    return (
        <>

            <Grid container>

                <Grid item>

                    <PopupState variant="popover" popupId="demo-popup-popover">
                        {(popupState) => (
                            <div>
                                <Button variant="contained" {...bindTrigger(popupState)}>
                                    {allTranslations(localization['push_notification.createPushNotification.filter.buttonFilter'])}

                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: 10}}>
                                        <path d="M2.75 16.5C2.75 17.0042 3.1625 17.4167 3.66667 17.4167H8.25V15.5833H3.66667C3.1625 15.5833 2.75 15.9958 2.75 16.5ZM2.75 5.5C2.75 6.00417 3.1625 6.41667 3.66667 6.41667H11.9167V4.58333H3.66667C3.1625 4.58333 2.75 4.99583 2.75 5.5ZM11.9167 18.3333V17.4167H18.3333C18.8375 17.4167 19.25 17.0042 19.25 16.5C19.25 15.9958 18.8375 15.5833 18.3333 15.5833H11.9167V14.6667C11.9167 14.1625 11.5042 13.75 11 13.75C10.4958 13.75 10.0833 14.1625 10.0833 14.6667V18.3333C10.0833 18.8375 10.4958 19.25 11 19.25C11.5042 19.25 11.9167 18.8375 11.9167 18.3333ZM6.41667 9.16667V10.0833H3.66667C3.1625 10.0833 2.75 10.4958 2.75 11C2.75 11.5042 3.1625 11.9167 3.66667 11.9167H6.41667V12.8333C6.41667 13.3375 6.82917 13.75 7.33333 13.75C7.8375 13.75 8.25 13.3375 8.25 12.8333V9.16667C8.25 8.6625 7.8375 8.25 7.33333 8.25C6.82917 8.25 6.41667 8.6625 6.41667 9.16667ZM19.25 11C19.25 10.4958 18.8375 10.0833 18.3333 10.0833H10.0833V11.9167H18.3333C18.8375 11.9167 19.25 11.5042 19.25 11ZM14.6667 8.25C15.1708 8.25 15.5833 7.8375 15.5833 7.33333V6.41667H18.3333C18.8375 6.41667 19.25 6.00417 19.25 5.5C19.25 4.99583 18.8375 4.58333 18.3333 4.58333H15.5833V3.66667C15.5833 3.1625 15.1708 2.75 14.6667 2.75C14.1625 2.75 13.75 3.1625 13.75 3.66667V7.33333C13.75 7.8375 14.1625 8.25 14.6667 8.25Z" fill="white"/>
                                    </svg>
                                </Button>

                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    transformOrigin={{ vertical: -8, horizontal: 'left' }}
                                    elevation={0}
                                >
                                    <Box
                                        p={4}
                                        minWidth={360}
                                        border="0.5px solid rgba(168, 171, 184, 0.6)"
                                        borderRadius={5}
                                    >

                                        <Box mb={4}>
                                            <Grid container justify="space-between" alignItems="center">
                                                <Grid item>
                                                    <Typography className={classes.headerTitle}>{allTranslations(localization['push_notification.createPushNotification.filter.clientFiltering'])}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Button className={classes.headerClear}>
                                                        {allTranslations(localization['push_notification.createPushNotification.filter.buttonReset'])}

                                                        <RotateCcwIcon color="#EE6A6A" size={15}/>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                    </Box>
                                </Popover>
                            </div>
                        )}
                    </PopupState>
                </Grid>

            </Grid>

        </>
    )
}

const useStyles = makeStyles((theme) => ({
    headerTitle: {
        fontFamily: 15,
        lineHeight: '18px',
        fontWeight: '500',
        color: '#25233E'
    },
    headerClear: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#EE6A6A',

        '& svg': {
            marginLeft: 8
        }
    }
}));

export default Filter
