import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Dimensions
} from 'react-native';
import {Page} from "../components";
import commonStyles from "../../../theme/variables/commonStyles";
import {LoginHeader, MyConnectionCard, RefreshControl, UserSmallCard, UserSmallCardLoadings} from "../../../components";
import axios from "../../../plugins/axios";

const {width} = Dimensions.get('window');

const widthCard = ((width - 24) / 2) - 6;

class UsersCompanyPages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageColor: this.props.navigation.state.params.color,
            userList: this.props.navigation.state.params.clients,
            companyName: this.props.navigation.state.params.companyName,
            countContacts: this.props.navigation.state.params.countContacts,
            title: this.props.navigation.state.params.title,
            url: this.props.navigation.state.params.url,

            contacts: [],

            isLoading: true,
            isLoadingMore: false,
            isLastPage: false,

            filter: {
                page: 1,
                limit: 20
            }
        }
    }

    componentDidMount = async () => {
        await this.onLoadContacts();
    }

    onLoadContacts = async () => {
        const contacts = await axios('get', `${this.state.url}?page=${this.state.filter.page}&limit=${this.state.filter.limit}`).then((response) => {
            const data = response.data.data;
            const key = Object.keys(data)[0];

            return data[key]
        }).catch((error) => {
            return []
        });

        let totalContacts = [...this.state.contacts, ...contacts];

        this.setState({
            contacts: totalContacts,

            isLoading: false,
            isLoadingMore: false,
            isLastPage: totalContacts.length >= this.state.countContacts
        })
    }
    onLoadMoreContact = async () => {
        if (this.state.countContacts <= this.state.contacts.length || this.state.isLoadingMore) {
            return null
        }

        const filter = {...this.state.filter};
        filter.page++

        this.setState({
            isLoadingMore: true,
            filter
        }, () => {
            this.onLoadContacts();
        })
    }

    toUserPage = (contact) => {
        // this.props.navigation.navigate('CutawayUserInformation', {
        //     id: contact._id
        // });
    }

    render() {
        const title = this.state.title;
        const color = this.state.pageColor;
        const companyName = this.state.companyName;

        return (
            <Page style={styles.page} color={color}>
                <View style={[commonStyles.container, {flex: 1}]}>
                    <LoginHeader
                        title={title}
                        isShowButtonBack {...this.props}

                        styleTitle={{textAlign: 'left', fontSize: 24}}

                        styleRoot={{marginBottom: 20, paddingHorizontal: 0, marginTop: 40}}
                    />


                    {
                        this.state.isLoading && (
                            <View style={styles.containerLoading}>

                                {
                                    [0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                                        <View key={`card-loading-${item}`} style={{
                                            width: widthCard,
                                            marginBottom: 12,
                                            marginLeft: 12,
                                            minHeight: 80
                                        }}>
                                            <UserSmallCardLoadings/>
                                        </View>
                                    ))
                                }

                            </View>
                        )
                    }

                    <SafeAreaView style={{flex: 1}}>
                        <FlatList
                            contentContainerStyle={{
                                marginLeft: -12
                            }}

                            data={this.state.contacts}
                            keyExtractor={(item, idx) => `contact-${item._id}-${idx}`}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}

                            numColumns={2}
                            horizontal={false}
                            bounces={false}

                            onEndReached={this.onLoadMoreContact}
                            onEndReachedThreshold={0.8}

                            renderItem={(item) => {
                                return (
                                    <View style={{width: widthCard, marginBottom: 12, marginLeft: 12}}>
                                        <UserSmallCard
                                            user={item.item}
                                            disabled
                                            onPress={this.toUserPage}
                                        />
                                    </View>
                                )
                            }}
                            ListFooterComponent={() => {
                                if (!this.state.isLastPage) {
                                    return (
                                        <View style={[styles.containerLoading, { marginLeft: 0 }]}>

                                            {
                                                [0, 1].map((item) => (
                                                    <View key={`card-loading-${item}`} style={{
                                                        width: widthCard,
                                                        marginBottom: 12,
                                                        marginLeft: 12,
                                                        minHeight: 80
                                                    }}>
                                                        <UserSmallCardLoadings/>
                                                    </View>
                                                ))
                                            }

                                        </View>
                                    )
                                }

                                return (
                                    <></>
                                )
                            }}
                        />
                    </SafeAreaView>

                </View>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    containerLoading: {
        marginLeft: -12,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})

export default UsersCompanyPages
