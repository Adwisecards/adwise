import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StatusBar,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {Form} from './components';
import {deleteItemAsync, setItemAsync} from "../../../helper/SecureStore";
import {Page, ModalLoading, DropDownHolder} from "../../../components";
import urls from "../../../constants/urls";
import axios from "../../../plugins/axios";
import getError from "../../../helper/getErrors";
import * as Linking from 'expo-linking';
import getPushToken from "../../../helper/getPushToken";

const headerStatusBar = StatusBar.currentHeight;
const logoImage = require("../../../../assets/images/authorization/logo.png");

class Authorization extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitForm: false
        }
    }

    componentDidMount = () => {}

    onLogin = async (form) => {
        const token = await getPushToken();
        this.setState({isSubmitForm: true});
        form = {
            ...form,
            pushTokenBusiness: token?.pushToken || undefined,
            deviceTokenBusiness: token?.deviceToken || undefined
        }
        const jwt = await axios('post', urls["sign-in"], form).then((response) => {
            return response.data.data.jwt
        }).catch((error) => {
            const errorBody = getError(error.response)
            this.setState({isSubmitForm: false})
            DropDownHolder.dropDown.alertWithType('error', errorBody.title, errorBody.message);

            return null
        });
        if (!jwt) {
            return null
        }
        await setItemAsync('jwt', jwt);
        await this.onUpdateAccount();
    }
    onUpdateAccount = async () => {
        const user = await axios('get', urls["get-me"]).then((response) => {
            return response.data.data.user
        });

        const isWorkCards = Boolean(user.contacts.find(t => t.type === 'work'));
        if (!isWorkCards) {
            DropDownHolder.dropDown.alertWithType(
                'error',
                'Системное уведомление',
                'Вы не являетесь кассиром. Доступ запрещен.'
            );

            await deleteItemAsync('jwt');

            this.setState({isSubmitForm: false});

            return null
        }

        this.props.updateAccount(user);
        this.setState({isSubmitForm: false})
    }
    onOpenPolitics = (url) => {
        Linking.openURL(url);
    }

    render() {
        return (
            <Page style={[styles.page, {paddingTop: headerStatusBar}]}>

                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.logo}>
                        <Image
                            source={logoImage}
                        />
                    </View>

                    <View style={styles.sectionDescription}>

                        <View style={{marginBottom: 16}}>
                            <Text style={styles.sectionDescriptionTitle}>Пользователь Adwise</Text>
                            <Text
                                style={styles.sectionDescriptionDescription}>{`введите номер телефона\nи пароль приложения`}</Text>
                        </View>

                        <View>
                            <Text style={styles.sectionDescriptionTitle}>Пользователь CRM Adwise</Text>
                            <Text style={styles.sectionDescriptionDescription}>введите e-mail и пароль от CRM</Text>
                        </View>

                    </View>


                    <Form
                        onLogin={this.onLogin}
                    />

                    <View style={styles.sectionBottom}>
                        <Text style={styles.sectionBottomText}>
                            {'Продолжая, я подтверждаю, что ознакомлен с '}
                            <Text style={styles.sectionBottomLink}
                                  onPress={() => this.onOpenPolitics('https://adwise.cards/privacy-policy')}>Политикой
                                конфиденциальности</Text>
                            {', '}
                            <Text style={styles.sectionBottomLink}
                                  onPress={() => this.onOpenPolitics('https://adwise.cards/user-agreement')}>Пользовательским
                                соглашением</Text>
                            {' и принимаю их условия'}
                        </Text>
                    </View>

                </ScrollView>

                <ModalLoading
                    isOpen={this.state.isSubmitForm}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {},

    logo: {
        width: "100%",
        alignItems: 'center',

        marginBottom: 48
    },

    sectionDescription: {
        marginBottom: 24,
        paddingHorizontal: 48
    },
    sectionDescriptionTitle: {
        fontSize: 15,
        lineHeight: 19,
        fontFamily: 'AtypDisplay_medium'
    },
    sectionDescriptionDescription: {
        fontSize: 15,
        lineHeight: 19,
        color: '#999cb1',
        fontFamily: 'AtypDisplay'
    },

    container: {
        justifyContent: 'center'
    },

    sectionBottom: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    },
    sectionBottomText: {
        maxWidth: 280,
        fontSize: 13,
        lineHeight: 14,
        textAlign: 'center',
        color: '#beaec0'
    },
    sectionBottomLink: {
        color: '#b2692e'
    }
})

export default Authorization
