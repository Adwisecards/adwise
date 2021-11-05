import React, {Component} from "react";
import {
    Page
} from '../../../components';
import {
    makeStyles
} from '@material-ui/styles';

const DocumentLayout = (props) => {
    const classes = useStyles();

    return (
        <Page className={classes.root}>
            <div className={classes.container}>
                { props.children }
            </div>
        </Page>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {},

    container: {
        backgroundColor: 'white',
        width: '100%',
        padding: 20,
        borderRadius: 10,

        maxWidth: 1200,

        margin: '0 auto',
        position: 'relative'
    }
}));

export default DocumentLayout
