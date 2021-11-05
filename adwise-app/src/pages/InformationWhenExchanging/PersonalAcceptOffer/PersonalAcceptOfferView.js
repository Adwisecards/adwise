import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import {Header} from "./components";
import commonStyles from "../../../theme/variables/commonStyles";
import {
    Icon
} from 'native-base';
import {
    Page,
    ModalLoading, DropDownHolder
} from "../../../components";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import getError from "../../../helper/getErrors";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";


class PersonalExchaner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contactId: '',
            requestId: '',

            contact: {},

            isLoadingPage: true,
            isLoading: false,
            isNotUser: false
        }
    }

    componentDidMount = () => {
        let {contactId, requestId} = this.props.navigation.state.params;

        this.setState({
            contactId,
            requestId
        })

        this.onLoadUser(contactId);
    }

    onLoadUser = (contactId) => {
        axios('get', urls["get-contact"] + contactId).then(response => {
            this.setState({
                isLoadingPage: false,
                contact: response.data.data.contact
            })
        }).catch(error => {
            const errorBody = getError(error.response);
            this.setState({isLoading: false});
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }

    acceptUser = () => {
        this.setState({isLoading: true});
        let {contactId, requestId} = this.props.navigation.state.params;

        axios('delete', urls["accept-request"] + requestId).then(() => {
            this.updateUser()

            DropDownHolder.alert(
                'success',
                allTranslations(localization.notificationTitleSuccess),
                allTranslations(localization.informationWhenExchangingNotificationsAcceptUserMessage)
            );
            this.setState({isLoading: false});

            this.props.navigation.goBack();
        }).catch(error => {
            const errorBody = getError(error.response);
            this.setState({isLoading: false});
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }
    cancelUser = () => {
        this.setState({isLoading: true});

        let {contactId, requestId} = this.props.navigation.state.params;

        axios('delete', urls["cancel-request"] + requestId).then(() => {
            this.updateUser()

            DropDownHolder.alert('success', '', allTranslations(localization.informationWhenExchangingNotificationsCancelUserMessage));
            this.setState({isLoading: false});

            this.props.navigation.goBack();
        }).catch(error => {
            const errorBody = getError(error.response);
            this.setState({isLoading: false});
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        })
    }

    updateUser = () => {
        axios('get', urls["get-me"]).then(res => {
            this.props.updateAccount(res.data.data.user)
        }).catch(error => {
            const errorBody = getError(error.response);
            DropDownHolder.alert('error', errorBody.title, errorBody.message);
        });
    }

    render() {

        if (this.state.isLoadingPage) {
            return (
                <Page style={[styles.page, {paddingHorizontal: 16, paddingVertical: 56}]}>
                    <Text>{allTranslations(localization.commonLoadingMessage)}</Text>
                </Page>
            )
        }

        return (
            <Page style={[styles.page]}>
                <Header url={this.state.contact.picture.value} {...this.props}/>

                <View style={[commonStyles.container]}>
                    <View style={[styles.containerBorder, {marginBottom: 16}]}>
                        <Text
                            style={styles.typographyUserName}>{this.state.contact.firstName.value} {this.state.contact.lastName.value}</Text>
                        {(!!this.state.contact.activity.value) && (
                            <Text style={styles.typographyUserActivity}>{this.state.contact.activity.value}</Text>)}
                    </View>

                    <View style={styles.containerBorder}>
                        <Text style={styles.typographySectionTitle}>{allTranslations(localization.editPersonalBusinessCardPersonalInformation)}</Text>
                        <Text
                            style={styles.typographySectionDescription}>{(this.state.contact.description.value) ? this.state.contact.description.value : allTranslations(localization.companyPagesNotFilled)}</Text>
                    </View>
                </View>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16}}>
                    <TouchableOpacity style={styles.buttonExchaner} onPress={this.acceptUser}>
                        <Icon name={'cached'} type={"MaterialIcons"} style={styles.buttonExchanerIcon}/>
                        <Text style={styles.buttonExchanerText}>{allTranslations(localization.commonExchange)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonExchaner, {marginTop: 16}]} onPress={this.cancelUser}>
                        <Icon name={'cancel'} type={"MaterialIcons"} style={styles.buttonExchanerIcon}/>
                        <Text style={styles.buttonExchanerText}>{allTranslations(localization.commonRefuse)}</Text>
                    </TouchableOpacity>
                </View>

                <ModalLoading
                    isOpen={this.state.isLoading}
                />
            </Page>
        );
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerShow: false,
        };
    };
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    containerBorder: {
        padding: 16,
        borderRadius: 4,
        backgroundColor: 'white'
    },

    typographyUserName: {
        fontSize: 24,
        lineHeight: 26,
        fontFamily: 'AtypText_medium'
    },
    typographyUserActivity: {
        marginTop: 6,

        fontSize: 18,
        lineHeight: 22,
        opacity: 0.6,
        fontFamily: 'AtypText_medium'
    },

    typographySectionTitle: {
        fontFamily: 'AtypText_semibold',
        fontSize: 16,
        lineHeight: 23
    },
    typographySectionDescription: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 19,

        marginTop: 9
    },

    buttonExchaner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 40,

        height: 50,
        width: '100%',
        marginHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#8152E4'
    },
    buttonExchanerIcon: {
        fontSize: 24,
        color: 'white'
    },
    buttonExchanerText: {
        fontSize: 20,
        lineHeight: 22,
        fontFamily: 'AtypText_medium',
        color: 'white',

        marginLeft: 8
    },
})

export default PersonalExchaner
