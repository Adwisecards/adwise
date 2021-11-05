import React, {Component} from 'react';
import {
    Backdrop,
    Box,
    CircularProgress,
    Grid,
    IconButton,
    Typography,

    Tabs,
    Tab,
    InputAdornment,
    TextField,

    Button
} from '@material-ui/core';
import {ArrowLeftCircle as ArrowLeftCircleIcon, Search as SearchIcon} from "react-feather";
import {withStyles} from "@material-ui/styles";
import {
    TabPanel,
    TableClients
} from './components';
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {store} from "react-notifications-component";
import {getPageFromCount} from "../../../common/pagination";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";
import alertNotification from "../../../common/alertNotification";

class OrganizationEmployeesCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sectionView: 'list-clients',

            clientsList: [],

            filter: {
                search: "",

                page: 1,
                limit: 20
            },
            pagination: {
                pages: 1
            },

            isLoadClientsList: true,
            isSubmitForm: false
        }

        this.organizationId = this.props.organization._id;
        this.timeOutGetClients = null;
    }

    componentDidMount = () => {
        this.onLoadClientsList()
    }

    onLoadClientsList = () => {
        this.setState({isLoadClientsList: true});

        const filter = this.getFilter();

        axiosInstance.get(`${urls["get-clients"]}${this.organizationId}${filter}`).then((response) => {
            let pagination = {...this.state.pagination};
            pagination.pages = getPageFromCount(response.data.data.count, this.state.filter.limit);

            this.setState({
                clientsList: response.data.data.clients,
                pagination: pagination,

                isLoadClientsList: false
            });
        })
    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let filters = [];

        Object.keys(filter).map((key) => {
            if (filter[key]) {
                filters.push(`${key}=${filter[key]}`)
            }
        });

        return `?${filters.join('&')}`
    }
    onChangeFilter = (filter, isFastStart) => {
        clearTimeout(this.timeOutGetClients);

        this.setState({
            filter
        }, () => {
            if (isFastStart) {
                this.onLoadClientsList();

                return null
            }

            this.timeOutGetClients = setTimeout(() => {
                this.onLoadClientsList();
            }, 1000);
        })
    }

    onChangeSectionView = (event, sectionView) => {
        this.setState({sectionView})
    }
    onChangeListClients = (clientsList) => {
        this.setState({clientsList});
    }

    onCrateEmployeers = async () => {
        let users = [];
        let clientsList = this.state.clientsList;
        let countElements = 0;

        clientsList.map((client, idx) => {
            if (client.checked) {
                users.push(client)
            }
        });

        if (users.length <= 0){
            return null
        }

        users.map(async (user) => {
            this.setState({ isSubmitForm: true });
            const lastName = user.contact.lastName.value;
            const firstName = user.contact.firstName.value;

            countElements++

            await axiosInstance.post(urls["create-employee"], {
                organizationId: this.organizationId,
                contactId: user.contact._id,
                role: (user.role) ? user.role : 'cashier'
            }).then((response) => {

                alertNotification({
                    title: allTranslations(localization.notificationSuccessTitleSuccess),
                    message: allTranslations(localization.employeesCreateSuccessCreateEmploy, {
                        lastName,
                        firstName
                    }),
                    type: 'success',
                })

            }).catch(err => {
                const error = err.response.data.error;

                alertNotification({
                    title: allTranslations(localization.notificationErrorTitle),
                    message: (<span>{ allTranslations(localization.employeesCreateErrorCreateEmploy, {lastName, firstName}) }<br/>{ error.details }</span>),
                    type: 'danger',
                })

            })

            await this.onFinishCreate();
        })
    }
    onFinishCreate = async () => {
        this.setState({ isSubmitForm: false });
        await this.updateOrganization();
    }

    updateOrganization = async () => {
        const organization = await axiosInstance.get(urls["get-me-organization"]).then((response) => {
            return response.data.data.organization;
        })
        this.props.setOrganization(organization);
        this.props.history.push('/employees');
    }

    goBack = () => {
        this.props.history.goBack()
    }

    _onChangeSearch = ({target}) => {
        const { value } = target;
        let newFilter = {...this.state.filter};
        newFilter.page = 1;
        newFilter.search = value;

        this.onChangeFilter(newFilter)
    }

    _getDisabledButton = () => {
        let disabledButton = true;

        this.state.clientsList.map((item) => {
            if (item.checked) {
                disabledButton = false
            }
        })

        return disabledButton
    }

    render() {
        const {filter, pagination} = this.state;
        const {classes} = this.props;
        const disabledButton = this._getDisabledButton();

        return (
            <Box className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item>
                        <IconButton onClick={this.goBack}>
                            <ArrowLeftCircleIcon size={50} color={'rgba(255, 255, 255, 0.5)'} strokeWidth={1}/>
                        </IconButton>
                    </Grid>
                    <Grid item style={{flex: 1}}>
                        <Box className={classes.container}>

                            <Box mb={1}>
                                <Typography variant="h3">{allTranslations(localization.employeesCreateTitle)}</Typography>
                            </Box>
                            <Box mb={4}>
                                <Typography variant="caption">{allTranslations(localization.employeesCreateCaption)}</Typography>
                            </Box>

                            <Box mb={4}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Tabs value={this.state.sectionView} onChange={this.onChangeSectionView}>
                                            <Tab value={'list-clients'} label={allTranslations(localization.employeesCreateListClients)}/>
                                        </Tabs>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            value={filter.fullName}
                                            variant={'outlined'}
                                            className={classes.searchInput}
                                            placeholder={allTranslations(localization.commonSearch)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon color={'#966EEA'} width={20}/>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            onChange={this._onChangeSearch}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box mb={8}>
                                <TabPanel value={this.state.sectionView} index={'list-clients'}>
                                    <TableClients
                                        clientsList={this.state.clientsList}
                                        filter={filter}
                                        pagination={pagination}

                                        isLoad={this.state.isLoadClientsList}

                                        onChangeListClients={this.onChangeListClients}
                                        onChangeFilter={this.onChangeFilter}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.sectionView} index={'user-code'}>
                                    2
                                </TabPanel>
                            </Box>

                            <Button
                                variant={"contained"}

                                disabled={disabledButton}

                                onClick={this.onCrateEmployeers}
                            >{allTranslations(localization.commonSave)}</Button>
                        </Box>
                    </Grid>
                </Grid>

                <Backdrop open={this.state.isSubmitForm} invisible={this.state.isSubmitForm}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
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
        flex: 1,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 5,

        boxShadow: '0px 3px 4px rgba(168, 171, 184, 0.25)',

        backgroundColor: 'white',

        padding: '48px 65px'
    },

    searchInput: {
        '& input': {
            height: 32
        }
    },
};

export default withStyles(styles)(OrganizationEmployeesCreate)
