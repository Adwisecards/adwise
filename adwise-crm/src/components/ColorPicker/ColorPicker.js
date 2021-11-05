import React, { useState, useEffect } from "react";
import {
    Box,

    Typography,

    Grid,

    Button
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Check
} from 'react-feather';
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const palette = [
    {
        header: "#0085FF",
        items: ['#082467', '#110a8e', '#08467f', '#0000FF', '#0a0080', '#0b47ab', '#4169e2', '#0085FF']
    },
    {
        header: "#FF0000",
        items: ['#800000', '#8B0000', '#B22222', '#FF0000', '#FA8072', '#FF6347', '#FF7F50', '#FF4500']
    },
    {
        header: "#FF9900",
        items: ['#FFD591', '#FFC069', '#FFA940', '#FA8C16', '#D46B08', '#AD4E00', '#893D08', '#612500']
    },
    {
        header: "#F3F300",
        items: ['#ee9c0d', '#fed800', '#feee76', '#feb900', '#fdff00', '#fedf00', '#fef67c', '#febe00']
    },
    {
        header: "#00FF00",
        items: ['#adff31', '#64fd04', '#60a02f', '#36c822', '#00FF00', '#4fc879', '#00a869', '#157347']
    },
    {
        header: "#14EDED",
        items: ['#45c3fe', '#41d2fe', '#41a7ff', '#14EDED', '#078cee', '#137dff', '#6396ea', '#1e90fc']
    },
    {
        header: "#5c030f",
        items: ['#a60d0f', '#810800', '#5c030f', '#500216', '#7a061e', '#450206', '#65061f', '#8e302f']
    },
];

const ColorPicker = (props) => {
    const [indexActivePalette, setIndexActivePalette] = useState(0);
    const classes = useStyles();

    const activePalette = palette[indexActivePalette];

    useEffect(() => {
        const indexActive = palette.findIndex((palette) => palette.items.join(',').indexOf(props.color) > -1);
        if (indexActive > -1){
            setIndexActivePalette(indexActive)
        }
    }, [props.color]);

    const handleChangeActive = (index) => {
        setIndexActivePalette(index)
    }
    const handleChangeColor = (color) => {
        props.onChangeColor(color)
    }

    return (
        <Box>
            <Box mb={1}>
                <Typography variant="subtitle1">{allTranslations(localization['colorPicker.title'])}</Typography>
            </Box>

            <Box mb={3}>
                <Typography variant="body2">{allTranslations(localization['colorPicker.message'])}</Typography>
            </Box>

            <Box mb={2}>
                <Grid container spacing={1}>
                    {
                        palette.map((palette, idx) => {
                            const isActive = idx === indexActivePalette;

                            return (
                                <Grid item xs="auto">
                                    <Button
                                        className={classes.buttonColor}
                                        style={{ backgroundColor: palette.header }}

                                        onClick={() => handleChangeActive(idx)}
                                    >
                                        { isActive && (<SvgArrowHeader color={palette.header}/>) }
                                    </Button>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Box>
            <Box>
                <Grid container spacing={1}>
                    {
                        activePalette.items.map((color, idx) => {
                            const isActive = props.color === color;

                            return (
                                <Grid item xs={3}>
                                    <Button className={classes.colorBox} style={{ backgroundColor: color }} onClick={() => handleChangeColor(color)}>
                                        { isActive && (<Check style={{ color: 'white' }} width={30} height={30}/>) }
                                    </Button>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Box>
        </Box>
    )
}

const SvgArrowHeader = (props) => {
    return (
        <svg width="32" height="41" viewBox="0 0 32 41" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: -10 }}>
            <path d="M0 5C0 2.23857 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V28.792C32 30.5701 31.0557 32.2144 29.52 33.1105L18.52 39.5295C16.9629 40.4381 15.0371 40.4381 13.48 39.5295L2.47998 33.1105C0.944268 32.2144 0 30.5701 0 28.792V5Z" fill={ props.color }/>
        </svg>
    )
}

const useStyles = makeStyles((theme) => ({
    colorBox: {
        display: 'flex',

        borderRadius: 5,

        height: 50,
        width: '100%',
    },

    buttonColor: {
        padding: 0,
        width: 32,
        minWidth: 32,
        height: 32
    },
}));

export default ColorPicker
