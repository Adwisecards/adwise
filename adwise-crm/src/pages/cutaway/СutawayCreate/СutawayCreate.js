import React, { Component } from 'react';
import {
    Box,
    Grid,
    IconButton,
    Typography,
    TextField,
    Button
} from '@material-ui/core';
import {withStyles} from "@material-ui/styles";
import {CutawayWork} from '../../../components'
import {ClientTabs} from './components'

import {ArrowLeftCircle as ArrowLeftCircleIcon} from "react-feather";

import PersonPhoto from '../../../assets/images/organization-clients/foto1.png'

class СutawayCreate extends Component {
    constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        disabledButton: true,
        tabsData: {
            tableData: {
                total: 6,
                list: [{
                    id: 1,
                    firstName: {
                        value: 'Александр',
                    },
                    lastName: {
                        value: 'Макаров',
                    },
                    picture: {
                        value: PersonPhoto,
                    },
                    phone: {
                        value: '+7 905 980-40-33'
                    },
                    email: {
                        value: 'Alexander@mail.ru'
                    },
                    role: ['Модератор','сотрудник'],
                },
                {
                    id: 2,
                    firstName: {
                        value: 'Григорий',
                    },
                    lastName: {
                        value: 'Шептунов',
                    },
                    picture: {
                        value: '',
                    },
                    phone: {
                        value: '+7 905 980-40-33'
                    },
                    email: {
                        value: 'Alexander@mail.ru'
                    },
                    role: ['сотрудник'],
                },
            ]
            }

        }
    }
    }

    componentDidMount = () => {}


    goBack = () => {
        this.props.history.goBack()
    }

    handleCreateСutaway = () => {
    }

    render() {
        const {classes} = this.props;
        const {isLoading, disabledButton, tabsData } = this.state;

        return (
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item>
                        <IconButton onClick={this.goBack}>
                            <ArrowLeftCircleIcon size={50} color={'rgba(255, 255, 255, 0.5)'} strokeWidth={1}/>
                        </IconButton>
                    </Grid>
                    <Grid item style={{flex: 1}}>
                        <Grid className={classes.container}>
                            <Box mb={4}>
                                <Typography variant="h2" component="h2">Новая визитка</Typography>
                            </Box>
                            {/*<Grid item xs={12}>*/}
                            {/*<Box mb={5}>*/}
                            {/*    <Typography variant="h5" component="h5" className={classes.pageTitle}>Название визитки</Typography>*/}
                            {/*    <TextField*/}
                            {/*        variant={'outlined'}*/}
                            {/*        className={classes.textField}*/}
                            {/*        placeholder={'Визитка для менеджеров'}*/}
                            {/*    />*/}
                            {/*</Box>*/}
                            {/*</Grid>*/}
                            <Grid container item xs={12}>
                                <Grid container item xs={6}>
                                    <Typography variant="h5" component="h5" className={classes.pageTitle}>Выбор цвета визитки</Typography>
                                </Grid>
                                <Grid container item xs={6}>
                                    <CutawayWork showBackSide={false}/>
                                </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" component="h5" className={classes.pageTitle}>Назначеначить сотрудников</Typography>
                                </Grid>
                                <ClientTabs tabsData={tabsData} isLoading={isLoading}/>
                            </Grid>

                            <Button variant="contained"
                                disabled={disabledButton}
                                onClick={this.handleCreateСutaway}
                                >
                                Сохранить
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

const styles = {
    root: {
        flex: 1,
        minHeight: 'calc(100vh - 60px)',
        borderRadius: '5px 5px 0 0',
        backgroundColor: '#9889ba',

        padding: 65,
        paddingLeft: 75
    },

    container: {
        width: '100%',
        maxWidth: 970,

        border: '1px solid rgba(168, 171, 184, 0.6)',
        borderRadius: '5px',
        boxShadow: '0px 3px 4px rgba(168, 171, 184, 0.25)',
        backgroundColor: 'white',
        padding: '48px 65px'
    },
    textField: {
        marginTop: '6px',
        minWidth: '360px',
    },
    pageTitle: {
        fontWeight: 'normal',
    }
};


export default withStyles(styles)(СutawayCreate)
