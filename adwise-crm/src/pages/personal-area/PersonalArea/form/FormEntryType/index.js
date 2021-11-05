import React from "react";
import {
    Grid,
    Box,
    Button,
    Radio,
    Typography
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";

const FormEntryType = (props) => {
    const { role, onChange, onSave } = props;

    const classes = useStyles();

    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <Button variant="outlined" className={classes.card} fullWidth onClick={() => onChange('manager')}>
                    <Box className={classes.cardLeft}>
                        <Radio checked={role === 'manager'} color="primary"/>
                    </Box>
                    <Box className={classes.cardBody}>
                        <Typography variant="h5">Менеджер</Typography>
                    </Box>
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Button variant="outlined" className={classes.card} fullWidth onClick={() => onChange('business')}>
                    <Box className={classes.cardLeft}>
                        <Radio checked={role === 'business'} color="primary"/>
                    </Box>
                    <Box className={classes.cardBody}>
                        <Typography variant="h5">Бизнес</Typography>
                    </Box>
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Button variant="outlined" className={classes.card} fullWidth onClick={() => onChange('common')}>
                    <Box className={classes.cardLeft}>
                        <Radio checked={role === 'common'} color="primary"/>
                    </Box>
                    <Box className={classes.cardBody}>
                        <Typography variant="h5">Общее</Typography>
                    </Box>
                </Button>
            </Grid>

            <Grid item>
                <Button variant="outlined" onClick={onSave} size="small">Изменить роль</Button>
            </Grid>

        </Grid>
    )
};

const useStyles = makeStyles((theme) => ({

    card: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#CBCCD4',
        borderRadius: 10,

        padding: 16,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left'
    },
    cardLeft: {
        width: 40,
        height: 40,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 16
    }

}));

export default FormEntryType
