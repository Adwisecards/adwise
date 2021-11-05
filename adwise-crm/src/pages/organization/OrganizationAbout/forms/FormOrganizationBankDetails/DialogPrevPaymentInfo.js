import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Button,
    TextField,
    Typography,
} from "@material-ui/core";

import individual from "../../../../../legalForms/forms/individual";
import ip from "../../../../../legalForms/forms/ip";
import ooo from "../../../../../legalForms/forms/ooo";
import {formNameRussiaIndividual} from "../../../../../legalForms/helpers/russia/individual";
import {formNameRussiaOoo} from "../../../../../legalForms/helpers/russia/ooo";
import {formNameRussiaIp} from "../../../../../legalForms/helpers/russia/ip";

const legals = {
    individual,
    ip,
    ooo
}

const DialogPrevPaymentInfo = (props) => {
    const { data, isOpen, onClose } = props;

    return (
        <Dialog
            maxWidth="md"
            fullWidth
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle>
                <Typography variant="h3">История банковской точки "<span style={{color: "#8152E4"}}>{data.paymentShopId}</span>"</Typography>
            </DialogTitle>

            <DialogContent>

                {

                    Object.keys(data.info || {}).map((key) => {

                        return (
                            <DescriptionJson
                                level={0}
                                keyName={key}
                                formName={data.form}
                                item={data.info[key]}
                            />
                        )
                    })

                }

            </DialogContent>

            <DialogActions>
                <Box px={2} width="100%">
                    <Button size="small" variant="contained" onClick={onClose}>Закрыть</Button>
                </Box>
            </DialogActions>

        </Dialog>
    )
}

const DescriptionJson = (props) => {
    const { item, level, keyName, formName } = props;

    if ( typeof item === 'object') {
        return (
            <>

                {

                    Object.keys(item).map((key) => {
                        return (
                            <DescriptionJson
                                item={item[key]}
                                keyName={`${keyName}.${key}`}
                                level={level + 1}
                            />
                        )
                    })

                }

            </>
        )
    }

    const objectNames = Boolean(formName === 'individual') ? formNameRussiaIndividual : formNameRussiaOoo;

    return (
        <Box>

            <Typography variant="subtitle1">{objectNames[keyName]} — {item}</Typography>

        </Box>
    )
}

export default DialogPrevPaymentInfo
