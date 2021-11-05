import React from "react";
import {
    Box,
    Grid,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {
    Copy as CopyIcon
} from "react-feather";
import {compose} from "recompose";
import {connect} from "react-redux";
import alertNotification from "../../common/alertNotification";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const YourManagerCode = (props) => {
    const { app } = props;

    if (!app?.account?.wisewinId) {
        return null
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(app.account.ref.code).then(() => {

            alertNotification({
                title: allTranslations(localization['yourManagerCode.notificationSuccess']),
                message: allTranslations(localization['yourManagerCode.notificationSuccessMessage']),
                type: 'success',
            })

        });
    }

    let match = app.account.ref.code.match(/^(\d{3})(\d{2})(\d{3})$/);
    const code = [match[1], '-', match[2], '-', match[3]].join('')

    return (
        <Box>

            <Box mb={1}>
                <Typography variant="h6">{allTranslations(localization['yourManagerCode.title'])}</Typography>
            </Box>

            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"

                bgcolor="rgba(255, 255, 255, 0.2)"
                border="0.5px solid rgba(168, 171, 184, 0.6)"
                borderRadius={5}
                px={2}
                py={1}
            >

                <Typography variant="h6">{code}</Typography>

                <Tooltip title={allTranslations(localization['yourManagerCode.buttonCopy'])} arrow>
                    <CopyIcon
                        color="#8152E4"
                        size="20"
                        onClick={handleCopyCode}
                        style={{cursor: "pointer"}}
                    />
                </Tooltip>

            </Box>

        </Box>
    )
}

export default compose(
    connect(
        state => ({
            app: state.app
        })
    ),
)(YourManagerCode);
