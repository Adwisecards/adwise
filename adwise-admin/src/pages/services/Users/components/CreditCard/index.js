import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@material-ui/core";
import axiosInstance from "../../../../../agent/agent";
import apiUrls from "../../../../../constants/apiUrls";

const CreditCard = (props) => {
    const { isOpen, onClose } = props;

    const [creditCard, setCreditCard] = useState(null);

    useEffect(() => {
        handleGetUserCard();
    }, [isOpen]);

    const handleGetUserCard = () => {
        // axiosInstance.get(`${ apiUrls["get-user-card"]}/${  }`).then((response) => {
        //
        // });
    }

    return (
        <Dialog></Dialog>
    )
}

export default CreditCard
