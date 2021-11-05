import React from "react";
import {
    Grid,
    Box,

    Select,
    MenuItem,
    FormControl
} from "@material-ui/core";
import {
    Pagination as PaginationDefault
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";

const Pagination = (props) => {

    const classes = useStyles();

    const handleChangeCount = ({ target }) => {
        const { value } = target;

        props.onChange(null, props.page, value)
    }

    return (

        <Grid container spacing={2}>

            <Grid item>
                <FormControl>
                    <Select
                        value={props.count}
                        variant="outlined"
                        className={classes.select}
                        onChange={handleChangeCount}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={60}>60</MenuItem>
                        <MenuItem value={80}>80</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item>
                <PaginationDefault
                    page={props.page}
                    count={props.pageCount}
                    onChange={props.onChange}
                />
            </Grid>

        </Grid>

    )
}

const useStyles = makeStyles(() => ({
    select: {
        height: 32,
        minHeight: 32,

        '& .MuiSelect-outlined.MuiSelect-outlined': {
            minHeight: 0,
            padding: '5px 30px 5px 10px'
        }
    },
}));

export default Pagination
