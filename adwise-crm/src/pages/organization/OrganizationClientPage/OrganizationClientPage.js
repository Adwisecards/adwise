import React, {Component} from 'react';
import {
    Box,
    Button,
    Typography,
    Tabs,
    Tab
} from "@material-ui/core";
import {
    ArrowLeft as ArrowLeftIcon
} from "react-feather";
import {
    User as UserComponent,
    Rewards as RewardsComponent,
    Operations as OperationsComponent,
    Informations as InformationsComponent
} from "./components";


import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import alertNotification from "../../../common/alertNotification";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class OrganizationClientPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            client: {},
            user: {},

            operations: [],
            rewards: [],

            tab: "operations",

            isLoadingUser: true
        }

        this.userId = props.match.params.id;
    }

    componentDidMount = async () => {
        await this.getUser();
    }

    getUser = async () => {
        const client = await axiosInstance.get(`${urls["get-client-page"]}${this.userId}`).then((res) => {
            return res.data.data.client
        });
        const user = await axiosInstance.get(`${urls["get-user"]}${client.user}`).then((res) => {
            return res.data.data.user
        });

        this.setState({
            client,
            user,
            isLoadingUser: false
        })
    }

    _routeGoBack = () => {
        this.props.history.goBack();
    }

    render() {
        const {
            user, client, tab, operations, rewards,
            isLoadingUser
        } = this.state;

        return (
            <>

                <Box mb={4}>
                    <Button variant="text" style={{ marginLeft: -8 }} onClick={this._routeGoBack}>
                        <ArrowLeftIcon color="#8152E4"/>
                        <Typography variant="h4" style={{ marginLeft: 8 }}>{allTranslations(localization.clientsTitle)}</Typography>
                    </Button>
                </Box>

                <Box mb={3}>
                    <UserComponent
                        user={user}
                        isLoading={isLoadingUser}
                    />
                </Box>

                <Box mb={5}>
                    <InformationsComponent
                        client={client}
                        isLoading={isLoadingUser}
                    />
                </Box>

                <Box mb={5}>
                    <Tabs value={tab} onChange={(event, tab) => this.setState({ tab })}>
                        <Tab label={allTranslations(localization.clientTabsOperations)} value="operations"/>
                        <Tab label={allTranslations(localization.clientTabsRewards)} value="rewards"/>
                    </Tabs>
                </Box>

                <Box maxWidth={1200}>
                    { tab === "operations" && (
                        <OperationsComponent
                            operations={client?.stats?.purchases || []}
                            isLoading={isLoadingUser}
                        />
                    ) }

                    {
                        tab === "rewards" && (
                            <RewardsComponent
                                rewards={client?.stats?.operations || []}
                                isLoading={isLoadingUser}
                            />
                        )
                    }
                </Box>

            </>
        );
    }
}



export default OrganizationClientPage
