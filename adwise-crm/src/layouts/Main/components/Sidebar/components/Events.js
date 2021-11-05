import React from 'react';
import {
    Box,
    Typography,

    Button,

    Grid
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    PlusCircle as PlusCircleIcon
} from 'react-feather';
import {useLocation, matchPath} from 'react-router';
import {useHistory} from 'react-router-dom';
import clsx from "clsx";

const EventItem = (props) => {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    const handleIsOpen = (href) => {
        return href === location.pathname
    }
    const handleOpen = (href) => {
        history.push(href);
    }

    return (
        <Grid
            container
            spacing={1}
            wrap={'nowrap'}
            alignItems={'center'}
            className={clsx({
                [classes.item]: true,
                [classes.itemActive]: handleIsOpen(props.to),
            })}

            onClick={() => handleOpen(props.to)}
        >
            <Grid item className={classes.itemIconContainer}>
                <PlusCircleIcon className={classes.itemIcon}/>
            </Grid>
            <Grid item>
                <Typography className={classes.itemTitle}>{props.title}</Typography>
            </Grid>
        </Grid>
    )
}

const Events = (props) => {
    const { organization } = props;

    const isDisabledSidebar = (!organization || !organization._id) ? true : false;
    const classes = useStyles();


    return (
        <Box mb={5}>
            <Box mb={2}>
                <Typography className={classes.sectionTitle}>Создать</Typography>
            </Box>

            <EventItem title={"Акции компании"} to={'/shares/create'}/>
            <EventItem title={"Сотрудники"}/>
            <EventItem title={"Визитки сотрудников"}/>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: '19px',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        color: '#9FA3B7'
    },

    item: {
        borderRadius: 21,

        cursor: 'pointer',

        marginBottom: 12,

        '&:hover': {
            '& p': {
                color: '#8152E4'
            }
        }
    },
    itemActive: {
        color: 'white',
        backgroundColor: '#a280ea',

        '& svg': {
            color: 'white'
        },
        '& .MuiTypography-root': {
            color: 'white!important',
            fontWeight: '500'
        },
    },
    itemIconContainer: {
        display: 'flex'
    },
    itemIcon: {
        color: '#8152E4'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: '19px',

        letterSpacing: '0.02em',

        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    link: {
        cursor: 'pointer',

        width: '100%',
        padding: 8,

        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        color: '#000000',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        '&:hover': {
            color: '#8152E4'
        }
    },
    linkActive: {
        backgroundColor: '#8152E4',
        borderRadius: 5,

        color: 'white!important'
    },
    linkDisabled: {
        color: '#25233E',
        opacity: 0.2,
        pointerEvents: 'none'
    }
}));

export default Events
