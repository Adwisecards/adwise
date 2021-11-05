import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,

    SafeAreaView,
    FlatList,

    Dimensions,

    Platform
} from 'react-native';
import {
    Page,
    HeaderAccounts, MyConnectionCard
} from "../../components";
import allTranslations from "../../localization/allTranslations";
import localization from "../../localization/localization";

const { width } = Dimensions.get('window');

class BusinessCardAllContact extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.contacts = [...this.props.navigation.state.params.contacts];
    }

    _routeToPageUser = (contact) => {
        // this.props.navigation.push('CutawayUserInformation', {
        //     id: contact._id
        // });
    }

    render() {
        return (
            <Page style={styles.page}>
                <HeaderAccounts title={allTranslations(localization.businessCardAllContactTitle)} styleRoot={{ marginBottom: 24 }} {...this.props}/>

                <SafeAreaView style={{ flex: 1, marginLeft: -5 }}>

                    <FlatList
                        data={this.contacts}

                        numColumns={2}

                        renderItem={({ item }) => {
                            return (
                                <View style={styles.card}>
                                    <MyConnectionCard
                                        contactId={item}
                                        onPress={(contact) => this._routeToPageUser(contact)}
                                        disabled
                                        {...this.props}
                                    />
                                </View>
                            )
                        }}
                    />

                </SafeAreaView>

            </Page>
        );
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    card: {
        marginLeft: 5,
        marginBottom: 10,

        width: width / 2 - 10,
    }

})

export default BusinessCardAllContact
