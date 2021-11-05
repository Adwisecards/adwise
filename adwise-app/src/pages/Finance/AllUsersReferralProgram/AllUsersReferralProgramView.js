import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import {
    Page,

    HeaderAccounts
} from "../../../components";
import FounderCard from "../ReferralProgram/components/Founder/Card";
import axios from "../../../plugins/axios";
import commonStyles from "../../../theme/variables/commonStyles";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

const {width} = Dimensions.get('window');

class AllUsersReferralProgram extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],

            isLoading: true
        }

        this.title = this.props.navigation.state.params.title;
        this.url = this.props.navigation.state.params.url;
        this.urls = this.props.navigation.state.params.urls;
        this.itemsClickable = this.props.navigation.state.params.itemsClickable;
    }

    componentDidMount = () => {
        if (this.url) {
            this.getList();
        }

        if (this.urls) {
            (async () => {
                await this.getListMultiples();
            })();
        }
    }

    getList = () => {
        axios('get', this.url).then((response) => {
            this.setState({
                items: response.data.data.subscriptions,
                isLoading: false
            })
        })
    }
    getListMultiples = async () => {
        let items = [];

        await Promise.all(this.urls.map(async (url) => {
            const elements = await axios('get', url).then((response) => {
                return response.data.data.subscriptions
            }).catch(() => {
                return []
            })

            items = [...items, ...elements];
        }))

        this.setState({
            items,

            isLoading: false
        })
    }

    _navigatePages = ({organization}, headerTitle) => {
        this.props.navigation.navigate('ReferralNetwork', {
            organization,
            headerTitle
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Page style={styles.page}>
                    <HeaderAccounts
                        title={this.title}

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
                    title={this.title}
                    styleRoot={{marginBottom: 20}}

                    {...this.props}
                />

                <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        contentContainerStyle={[commonStyles.container, {marginLeft: -12}]}

                        data={this.state.items}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}

                        numColumns={2}
                        horizontal={false}

                        renderItem={(item) => {
                            return (
                                <View style={{width: ((width - 12) / 2) - 12, marginLeft: 12, marginBottom: 12}}>
                                    <FounderCard item={item.item}
                                                 onPress={(headerTitle) => this._navigatePages(item.item, headerTitle)}
                                                 notMargin clickable={this.itemsClickable}/>
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
})

export default AllUsersReferralProgram
