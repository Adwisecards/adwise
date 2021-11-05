import React from 'react';
import {
    Box,

    IconButton
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Filter as FilterIcon
} from '../../../../../icons';

const Filter = (props) => {
    const classes = useStyles();

    return (
        <Box>
            {/* <IconButton color="primary" className={classes.buttonFilter}>
                <FilterIcon />
            </IconButton> */}
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    buttonFilter: {
        backgroundColor: '#eee4fe',

        padding: 10
    }
}));

export default Filter
