import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Page,
    HeaderAccounts
} from "../../../components";
import {
    СutawayCard,
    FirstLevel,
    OtherLevel
} from './components';
import commonStyles from "../../../theme/variables/commonStyles";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class ReferralNetwork extends Component {
    constructor(props) {
        super(props);

        this.state = {
            organization: [],
            subscriptions: [],

            isLoading: true
        };

        this.headerTitle = this.props.navigation.state.params.headerTitle;
        this.organizationId = this.props.navigation.state.params.organization;
    }

    componentDidMount = () => {
        this.onLoadOrganization();
    }

    onLoadOrganization = () => {
        axios('get', `${ urls["get-organization"] }${ this.organizationId }`).then((response) => {
            this.setState({
                organization: response.data.data.organization,

                isLoading: false
            })

            this.onLoadSubscriptions(response.data.data.organization._id);
        }).catch((error) => {

        })
    }

    onLoadSubscriptions = (organizationId) => {
        axios('get', `${urls["get-level-subscriptions"]}${organizationId}`).then((response) => {


            this.setState({
                subscriptions: response.data.data.subscriptions
            })
        }).catch((error) => {
            console.log('error: ', error.response)
        });
    }

    render() {
        if (this.state.isLoading){
            return (
                <Page style={styles.page}>
                    <HeaderAccounts
                        title={ this.headerTitle }
                        styleRoot={{ marginBottom: 16 }}
                        {...this.props}
                    />

                    <View style={commonStyles.container}>
                        <Text>{allTranslations(localization.commonLoadingMessage)}</Text>
                    </View>

                </Page>
            )
        }

        return (
            <Page style={styles.page}>
                <HeaderAccounts
                    title={ this.headerTitle }
                    styleRoot={{ marginBottom: 16 }}
                    {...this.props}
                />

                <ScrollView
                    contentContainerStyle={[commonStyles.container]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ marginBottom: 40 }}>
                        <СutawayCard {...this.state.organization}/>
                    </View>

                    <View style={{ marginBottom: 40 }}>
                        <FirstLevel
                            organization={this.state.organization}
                            subscriptions={this.state.subscriptions}
                            {...this.props}
                        />
                    </View>

                    <View>
                        <OtherLevel
                            organization={this.state.organization}
                            subscriptions={this.state.subscriptions}
                        />
                    </View>

                </ScrollView>

            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: '',
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
})

export default ReferralNetwork
