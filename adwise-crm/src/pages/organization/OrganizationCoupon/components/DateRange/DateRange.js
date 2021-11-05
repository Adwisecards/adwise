import React, {useState} from "react";
import {
    Box,

    Grid,

    TextField,

    Typography
} from '@material-ui/core';
import { DateRangePicker, DateRangeDelimiter } from "@material-ui/pickers";

const DateRangeComponent = (props) => {
    const {share, onChange} = props;

    const value = [share.startDate, share.endDate];

    const handleOnChange = (dates) => {
        let newShare = {...share};

        newShare.startDate = dates[0];
        newShare.endDate = dates[1];

        onChange(newShare);
    }

    return (
        <Box>

            <DateRangePicker
                calendars={3}
                value={value}
                disabled
                onChange={handleOnChange}
                renderInput={(startProps, endProps) => (
                    <React.Fragment>
                        <TextField {...startProps} label="" helperText="" placeholder="01.01.2020" fullWidth/>
                        <DateRangeDelimiter> По </DateRangeDelimiter>
                        <TextField {...endProps} label="" helperText="" placeholder="01.01.2020" fullWidth/>
                    </React.Fragment>
                )}
            />

        </Box>
    )
}

export default DateRangeComponent
