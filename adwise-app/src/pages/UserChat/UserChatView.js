import React, {Component} from 'react';
import {
    View,
    Image,
    Platform,
    StyleSheet
} from 'react-native';
import {
    Page,
    HeaderAccounts
} from "../../components";
import {
    GiftedChat
} from "react-native-gifted-chat";
import {
    PersonalSmallCard as Avatar
} from "../../icons"

import moment from "moment";

class UserChat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [
                {
                    _id: 1,
                    text: 'Здравствуйте, чем вам помочь?',
                    createdAt: new Date(),
                    user: {
                        _id: 0,
                        name: 'S P',
                    },
                }
            ],

            user: {
                _id: '',
                name: '',
                avatar: ''
            }
        }
    }

    componentDidMount = () => {
        this.props.updateKeyboardAvoidingViewEnabled(Platform.OS !== 'ios');

        this.initUser();
    }
    componentWillUnmount = () => {
        this.props.updateKeyboardAvoidingViewEnabled(true);
    }

    initUser = () => {
        const {account} = this.props.app;
        const contact = account.contacts.find((t) => t.type === 'personal');

        let user = {
            _id: account._id,
            name: `${account?.lastName} ${account?.firstName}`,
            avatar: (!!account?.picture) ? (
                <Image
                    source={{uri: account?.picture}}
                    style={{width: 40, height: 40, borderRadius: 999}}
                />
            ) : (
                <Avatar
                    width={40}
                    height={40}
                    color={contact.color}
                />
            )
        };

        this.setState({
            user
        })
    }

    onSensMessage = (messages) => {
        this.setState({
            messages: [...messages, ...this.state.messages]
        })
    }

    _renderUserAvatar = (props) => {
        if (props.currentMessage?.user?._id === 0) {
            return (
                <Avatar
                    width={40}
                    height={40}
                    color="#8152E4"
                />
            )
        }

        const {account} = this.props.app;
        const contact = account.contacts.find((t) => t.type === 'personal');

        if (account?.picture) {
            return (
                <Image
                    source={{uri: account?.picture}}
                    style={{width: 40, height: 40, borderRadius: 999}}
                />
            )
        }

        return (
            <Avatar
                width={40}
                height={40}
                color={contact.color}
            />
        )
    }
    _renderComposer = (props) => {
        return (
            <View style={styles.composer}></View>
        )
    }

    render() {
        const {messages, user} = this.state;

        return (
            <Page style={styles.page}>

                <HeaderAccounts
                    title="Чат"
                    {...this.props}
                />


                <GiftedChat
                    messages={messages}
                    onSend={this.onSensMessage}
                    user={user}

                    placeholder="Сообщение"

                    dateFormat="MM.DD.YYYY"
                    timeFormat="HH:mm:ss"

                    renderAvatar={this._renderUserAvatar}
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    composer: {
        width: '100%',
        backgroundColor: '#8152E4',
        height: 40
    },
})

export default UserChat
