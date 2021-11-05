import React from 'react';
import {
    makeStyles
} from '@material-ui/styles';

import backgroundImage  from '../../assets/background.png';
import clsx from "clsx";

const Page = (props) => {
    const { className } = props;
    const classes = useStyles();

    return (
        <div className={clsx([classes.root, className])}>
            { props.children }
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1),

        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        backgroundImage: `url(${ backgroundImage })`,
        backgroundSize: 'cover',

        minHeight: '100vh'
    },
}));

export default Page
