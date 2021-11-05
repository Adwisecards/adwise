import React, {PureComponent} from "react";
import {
    Text,
    View,
    Image,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import {Modalize} from "react-native-modalize";
import {compose} from "recompose";
import {connect} from "react-redux";
import SchedulerCreateView from "../../pages/SchedulerInformation/SchedulerInformationView";
import axios from "../../plugins/axios";
import urls from "../../constants/urls";
import localization from "../../localization/localization";
import allTranslations from "../../localization/allTranslations";

class ModalSelectFriend extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            contacts: []
        };
    }

    componentDidMount = async () => {
        await this.getListContacts();
    }

    getListContacts = async () => {
        const {account, activeCutaway} = this.props.app;
        let contact = account.contacts[0];

        if (activeCutaway) {
            contact = account.contacts.find((t) => t._id === activeCutaway);
        }

        const contacts = await this.getUsers(contact?.contacts);

        this.setState({
            contacts
        })
    }
    getUsers = async (contacts) => {
        let users = [];

        contacts.map(async (item) => {
            const user = await axios('get', `${urls["get-contact"]}${item}`).then((response) => {
                return response.data.data.contact
            });

            users.push(user);
        });

        return users
    }

    _renderItem = (props) => {
        const { onSend } = this.props;
        const { item } = props;

        return (
            <TouchableOpacity style={styles.cardUser} onPress={() => onSend(item._id)}>
                <Image style={styles.cardUserImage} source={{ uri: item?.picture?.value }}/>
                <Text style={styles.cardUserName}>{`${ item?.firstName?.value } ${ item?.lastName?.value }`}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {contacts} = this.state;
        const {initialRef, onClose} = this.props;

        return (
            <Modalize
                ref={initialRef}
                adjustToContentHeight={true}

                HeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{allTranslations(localization.contactsTitle)}</Text>
                    </View>
                }
            >

                <View style={styles.container}>

                    <SafeAreaView style={{flex: 1}}>
                        <FlatList
                            data={contacts}
                            keyExtractor={({item, idx}) => `${item}-${idx}`}
                            renderItem={this._renderItem}
                        />
                    </SafeAreaView>

                </View>

            </Modalize>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: 'AtypText_medium'
    },

    container: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },

    cardUser: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 12
    },
    cardUserImage: {
        backgroundColor: '#DCDCDC',
        width: 50,
        height: 50,
        borderRadius: 999,
        marginRight: 16
    },
    cardUserName: {
        fontFamily: 'AtypText_medium',
        fontSize: 16,
        lineHeight: 18
    },
});

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({}),
    ),
)(ModalSelectFriend);
