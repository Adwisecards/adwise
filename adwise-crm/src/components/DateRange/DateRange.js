import React, { useState, useEffect } from "react";
import {
    Box,

    TextField
} from "@material-ui/core";
import {

} from "@material-ui/styles";

import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import moment from "moment";

const DateRange = (props) => {
    const { startDate, endDate } = props;

    const handleOnApply = (props) => {}

    return (
        <Box>

            <TextField
                variant="outlined"

                value={`${ moment(startDate).format("DD.MM.YYYY") } - ${ moment(endDate).format("DD.MM.YYYY") }`}

                fullWidth
            />

        </Box>
    )
}


DateRange.defaultProps = {
    startDate: moment(),
    endDate: moment().add(7, 'days'),
};

export default DateRange