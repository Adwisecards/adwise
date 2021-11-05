import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Box,
    Grid,
    Typography,
    Button,
    IconButton,
    Avatar
} from "@material-ui/core";
import {
    X as XIcon
} from "react-feather";
import currency from "../../../../../constants/currency";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const DialogCoupons = (props) => {
    const { purchase, isOpen, onClose } = props;

    useEffect(() => {
        if (!isOpen) {
            return null
        }

        let coupons = [];
        purchase.coupons.map((coupon) => {
            if (!Boolean(coupons.find((t) => t._id === coupon._id))){
                coupons.push({...coupon, count: 0})
            }

            coupons.find((t) => t._id === coupon._id).count++
        });

        setCoupons(coupons);
    }, [isOpen]);

    const [coupons, setCoupons] = useState([]);

    return (
        <Dialog
            open={isOpen}
            maxWidth="sm"
            fullWidth
            onClose={onClose}
        >
            <DialogTitle>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                        <Typography variant="h3">{allTranslations(localization.billsDialogCouponsTitle)}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={onClose}>
                            <XIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent>
                <Box mb={2}>
                    <Grid container spacing={2}>
                        {
                            coupons.map((coupon, idx) => {
                                return (
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item>
                                                <Avatar sizes="big" src={coupon?.picture || ''}/>
                                            </Grid>
                                            <Grid item>
                                                <Box maxWidth={300}>
                                                    <Typography variant="subtitle1">{coupon?.name}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body2">{coupon?.count || 1} {allTranslations(localization.commonPiecesMini)}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1">{coupon.price * coupon.count} {currency.rub}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>
            </DialogContent>

        </Dialog>
    )
}

export default DialogCoupons
