import React, {Component} from 'react';
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography, InputAdornment, CircularProgress, Backdrop,
} from "@material-ui/core";
import {
    Filter as FilterComponent,
    Footer as FooterComponent,
    TableUsers as TableUsersComponent,
    DialogCreatedPushNotification as DialogCreatedPushNotificationComponent
} from "./components";
import {
    Search as SearchIcon
} from "react-feather";
import axiosInstance from "../../../../agent/agent";
import urls from "../../../../constants/urls";
import {getPageFromCount} from "../../../../common/pagination";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";

class OrganizationCreatePushNotification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clients: [],
            selectedClients: [],

            filter: {
                page: 1,
                limit: 20,
                search: "",

                order: -1,
                sortBy: 'user',
            },
            pagination: {
                count: 1
            },

            isLoading: true,
            isCreated: false,
            isShowBackdrop: false
        };

        this.timeoutSearch = null;
    }

    componentDidMount = async () => {

        await this.getUsers();

    }

    getUsers = async () => {
        const { organization } = this.props.global;

        await this.setState({ isLoading: true });

        const filter = this.getFilter();
        const { error, clients, count } = await axiosInstance.get(`${ urls["get-clients"] }${ organization._id }${ filter }`).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                error: error.response
            }
        });

        if (error) {
            return null
        }

        const pagination = {
            count: getPageFromCount(count, this.state.filter.limit)
        };

        await this.setState({
            clients,
            pagination,
            isLoading: false
        });

    }
    getFilter = () => {
        const filter = {...this.state.filter};
        let string = [];

        Object.keys(filter).map((key) => {
            const value = filter[key];

            if (Boolean(value)) {
                string.push(`${key}=${value}`);
            }
        })

        return `?${ string.join('&') }`
    }

    // Изменение фильтра
    onChangeFilter = (filter, isFastStart) => {
        this.setState({ filter }, async () => {

            if ( isFastStart ) {

                await this.getUsers();

            }

        })
    }
    onChangeFullName = (value) => {
        let newFilter = {...this.state.filter};
        newFilter.search = value;

        this.onChangeFilter(newFilter);

        clearTimeout(this.timeoutSearch);

        this.timeoutSearch = setTimeout( async () => {
            await this.getUsers()
        }, 500);
    }

    // Изменение выбранных пользователей
    onChangeClient = (client) => {
        let newSelectedClients = [...this.state.selectedClients];
        const clientsIndex = newSelectedClients.findIndex((t) => t._id === client._id);

        if (clientsIndex <= -1) {
            newSelectedClients.push(client);
        } else {
            newSelectedClients.splice(clientsIndex, 1);
        }

        this.setState({
            selectedClients: newSelectedClients
        })
    }

    // Отправка Push-notifications
    onSendPushNotifications = async (body) => {

        await this.setState({ isShowBackdrop: true });

        const response = await axiosInstance.post(`${ urls["push-notifications-send"] }`, body).then((response) => {
            return response.data.data
        }).catch((error) => {
            return {
                error: error.response
            }
        })

        await this.setState({ isShowBackdrop: false });

        this.props.history.goBack();

    }

    render() {
        const {
            clients,
            pagination,
            filter,
            selectedClients,

            isLoading,
            isCreated,
            isShowBackdrop
        } = this.state;

        return (
            <>

                <Box mb={3}>
                    <Typography variant="h1">{allTranslations(localization['push_notification.createPushNotification.headerTitle'])}</Typography>
                </Box>

                <Box mb={4}>
                    <Grid container spacing={2}>
                        {
                            false && (
                                <Grid item>
                                    <FilterComponent/>
                                </Grid>
                            )
                        }
                        <Grid item>
                            <TextField
                                value={filter.search}
                                variant="outlined"
                                placeholder={allTranslations(localization['push_notification.createPushNotification.searchClientPlaceholder'])}
                                onChange={({target}) => this.onChangeFullName(target.value)}
                                InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon size={20} color="#966EEA"/></InputAdornment>}}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box pb={10}>
                    <TableUsersComponent
                        rows={clients}
                        filter={filter}
                        pagination={pagination}
                        isLoading={isLoading}
                        onChangeClient={this.onChangeClient}
                        onChangeFilter={this.onChangeFilter}
                        selectedClients={selectedClients}
                    />
                </Box>

                <FooterComponent
                    countClients={selectedClients.length}
                    onCreate={() => this.setState({isCreated: true})}
                />

                <DialogCreatedPushNotificationComponent
                    open={isCreated}
                    initialClient={[...selectedClients]}
                    onCreate={this.onSendPushNotifications}
                    onClose={() => this.setState({isCreated: false})}
                />

                <Backdrop open={isShowBackdrop} invisible={isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default OrganizationCreatePushNotification
