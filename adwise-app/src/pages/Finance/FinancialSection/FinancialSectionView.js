import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import {
    RefreshControl,
    DropDownHolder
} from "../../../components";
import {
    History,
    MyFinances
} from './components';
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import * as Linking from "expo-linking";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Amplitude";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class FinancialSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            information: {},

            userCreditCard: null,

            isRefreshing: true,
            isOpenLoading: false,
            isLoadingCreditCard: true,
            isLoadingUserCreditCard: false
        };

        this.updateHistoryInterval = null;
    }

    componentDidMount = () => {
        this.onRefresh();
    }

    componentWillUnmount = () => {
        clearImmediate(this.updateHistoryInterval);
    }

    onRefresh = (isRefreshing = true) => {
        this.setState({isRefreshing});

        this.getUserWallet();
        this.onGetHistory();
    }

    onGetHistory = () => {
        axios('get', `${urls["get-user-financial-statistics"]}?optimized=1`).then((response) => {
            this.setState({
                information: response.data.data,
                isRefreshing: false
            })
        }).catch((error) => {
            console.log(error.response)
        })
    }

    onCreateWithdrawalFunds = async () => {
        this.setState({
            isOpenLoading: true
        });

        const withdrawalRequestToken = await axios('get', urls['get-withdrawal-request-token']).then((response) => {
            return response.data.data.withdrawalRequestToken;
        }).catch((error) => {
            return null
        })

        if (!withdrawalRequestToken) {
            DropDownHolder.alert(
                'error',
                allTranslations(localization.notificationTitleError),
                allTranslations(localization.financeErrorCreateWithdrawal)
            );

            this.setState({
                isOpenLoading: false
            })

            return null
        }

        await amplitudeLogEventWithPropertiesAsync('user-created-withdrawal-request', {})

        const url = `${urls['url-page-withdrawal-funds']}?token=${withdrawalRequestToken}`;

        Linking.openURL(url);

        this.setState({
            isOpenLoading: false
        })
    }

    getUserWallet = () => {
        axios('get', urls["user-get-wallet"]).then((response) => {
            const {wallet} = response.data.data;
            this.props.updateWallet(wallet);
        })
    }


    render() {
        return (
            <ScrollView
                contentContainerStyle={[commonStyles.container]}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}

                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >

                <View style={{marginBottom: 40}}>
                    <MyFinances
                        {...this.state.information}
                        {...this.props}

                        onCreateWithdrawalFunds={this.onCreateWithdrawalFunds}
                    />
                </View>

                <History
                    items={this.state.information.operations}

                    {...this.props}
                />



            </ScrollView>
        );
    };
}

export default FinancialSection
