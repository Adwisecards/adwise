import React, {Component} from 'react';
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography
} from "@material-ui/core";
import {
    TablePushNotifications as TablePushNotificationsComponent
} from "./components";
import allTranslations from "../../../../localization/allTranslations";
import localization from "../../../../localization/localization";
import axiosInstance from "../../../../agent/agent";
import urls from "../../../../constants/urls";
import parseSearchUrl from "../../../../common/url";
import moment from "moment";
import {getPageFromCount} from "../../../../common/pagination";

const initialFilter = {
    page: 1,
    limit: 20,
    search: ""
};

class OrganizationPushNotifications extends Component {
    constructor(props) {
        super(props);

        const filter = parseSearchUrl(this.props.history.location.search, initialFilter);

        this.state = {
            pushNotifications: [],
            samplings: [],

            pagination: {
                count: 1,
                total: 0
            },
            filter: filter,

            view: "push-notifications",

            isLoading: true,
        };

        this.timeoutSearch = null;
    }

    componentDidMount = async () => {
        await this.getPushNotification();
    }

    getPushNotification = async () => {
        const organizationId = this.props.global?.organization?._id;

        this.setState({ isLoading: true });

        const searchUrl = this.getFilter();

        window.history.replaceState(null,null, `/push-notifications${searchUrl}`);

        const { notifications, count } = await axiosInstance.get(`${ urls['get-notifications-send'] }/${ organizationId }${ searchUrl }`).then((res) => {
            return res.data.data
        }).catch((error) => {
            return {
                notifications: [],
                count: 0
            }
        });

        let pagination = {
            count: getPageFromCount(count, this.state.filter.limit),
            total: count
        };

        this.setState({
            isLoading: false,
            pagination,
            pushNotifications: notifications
        });

    }
    getFilter = () => {
        const {filter} = this.state;
        let data = [];

        Object.keys(filter).map((key) => {
            const value = filter[key];

            if ( Boolean(!!value) ) {
                data.push(`${key}=${value}`)
            }

        });

        return `?${data.join('&')}`
    }

    onChangeViewTable = (view) => {
        this.setState({ view });
        this.onChangeSearch("");
    }
    onChangeSearch = (search) => {

        clearTimeout(this.timeoutSearch);

        let newFilter = {...this.state.filter};
        newFilter.search = search;
        this.setState({ filter: newFilter },  async () => {

            this.timeoutSearch = setTimeout( async () => {
                await this.getPushNotification();
            }, 500);

        });
    }

    onChangeFilter = async (filter, isFastStart) => {

        await this.setState({ filter });

        if (isFastStart) {
            await this.getPushNotification();
        }

    }

    _routeCreatePushNotification = () => {
        this.props.history.push('/push-notifications/create')
    }

    render() {
        const {
            pushNotifications,

            view,
            filter,
            pagination,

            isLoading
        } = this.state;

        return (
            <>

                <Box mb={3}>
                    <Typography variant="h1">
                        {allTranslations(localization['push_notification.pushNotification.title'])}
                    </Typography>
                </Box>

                <Box mb={4}>

                    <Grid container spacing={3}>

                        <Grid item>
                            <Button variant="contained" onClick={this._routeCreatePushNotification}>
                                {allTranslations(localization['push_notification.pushNotification.buttonCreate'])}

                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 10 }}>
                                    <path d="M3.5 3.5H17.5C18.4625 3.5 19.25 4.2875 19.25 5.25V15.75C19.25 16.7125 18.4625 17.5 17.5 17.5H3.5C2.5375 17.5 1.75 16.7125 1.75 15.75V5.25C1.75 4.2875 2.5375 3.5 3.5 3.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M19.25 5.25L10.5 11.375L1.75 5.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Button>
                        </Grid>

                        <Grid item>
                            <TextField
                                placeholder={allTranslations(localization['push_notification.pushNotification.searchPlaceholder'])}
                                value={filter.search}
                                onChange={({target: {value: search}}) => this.onChangeSearch(search)}
                                variant="outlined"
                            />
                        </Grid>

                    </Grid>

                </Box>

                <Box>

                    <TablePushNotificationsComponent
                        rows={pushNotifications}
                        filter={filter}
                        pagination={pagination}
                        isLoading={isLoading}

                        onChangeFilter={this.onChangeFilter}
                    />

                </Box>

            </>
        );
    }
}

export default OrganizationPushNotifications
