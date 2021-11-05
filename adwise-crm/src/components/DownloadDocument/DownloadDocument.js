import React from 'react';
import {
    Box,
    Button,
    Typography,
    Link
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {} from 'react-feather';
import {FileText} from 'react-feather'

const useStyles = makeStyles((theme) => ({
    box: {
        border: '1px solid #cbccd4',
        borderRadius: '5px',
        background: 'white',
        width: '670px',
        minHeight: '75px',
        padding: '16px 22px',
        marginBottom: '12px',
        justifyContent: 'left',
        textAlign: 'left',
        textTransform: 'none'
    },
    h6: {
        fontSize: '18px',
        marginBottom: '0'
    },
    body1: {
        fontSize: '16px',
        marginBottom: '0'
    },
    icon: {
        marginRight: '18px',
        minWidth: 32
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: 'rgba(37, 35, 62, 0.04)',
        }
    }
}));

const DownloadDocument = (props) => {
    const {title, text, onClick, link} = props;
    const classes = useStyles();

    if (link){
        return (
            <Link href={link} target="_blank" className={classes.box + ' ' + classes.link} download>
                <FileText color="#ED8E00" size={32} className={classes.icon}/>
                <Box>
                    <Typography className={classes.h6} variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <Typography className={classes.body1} variant="body1" gutterBottom>
                        {text}
                    </Typography>
                </Box>
            </Link>
        )
    }

    return (
        <Button className={classes.box} onClick={onClick}>
            <FileText color="#ED8E00" size={32} className={classes.icon}/>
            <Box>
                <Typography className={classes.h6} variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Typography className={classes.body1} variant="body1" gutterBottom>
                    {text}
                </Typography>
            </Box>
        </Button>
    )
}


export default DownloadDocument
