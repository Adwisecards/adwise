import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity, SafeAreaView, FlatList,
} from 'react-native';
import {HeaderAccounts, MyConnectionCard, OrganizationCard, Page} from "../../components";
import commonStyles from "../../theme/variables/commonStyles";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";


class BusinessCardAllRecommendation extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.subscriptions = [...this.props.navigation.state.params.subscriptions];
        this.userId = this.props.navigation.state.params.userId || '';
        this.followingUserId = this.props.navigation.state.params.followingUserId || '';
    }

    componentDidMount = () => {}

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts title={allTranslations(localization.businessCardAllRecommendationTitle)} styleRoot={{ marginBottom: 24 }} {...this.props}/>

                <SafeAreaView style={{ flex: 1 }}>

                    <FlatList
                        data={this.subscriptions}

                        contentContainerStyle={[commonStyles.container]}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                        renderItem={({ item }) => {
                            return (
                                <View style={styles.card}>
                                    <OrganizationCard
                                        key={'organization-' + item}
                                        organizationId={item}
                                        followingUserId={this.followingUserId}
                                        navigation={this.props.navigation}
                                    />
                                </View>
                            )
                        }}
                    />

                </SafeAreaView>

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

    card: {
        marginBottom: 4
    }
})

export default BusinessCardAllRecommendation
