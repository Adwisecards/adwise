import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Icon
} from "native-base";
import {
    Page,
    Header,
    ModalLoading, DropDownHolder, RefreshControl
} from "../../../components";
import {
    ExitIcon,
    PersonalBusinessPage
} from "../../../icons";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";
import * as Linking from "expo-linking";
import {deleteItemAsync} from "../../../helper/SecureStore";
import {amplitudeLogEventWithPropertiesAsync} from "../../../helper/Logging";


class ProfileAbout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userCreditCard: null,

            isModalLoading: false,
            isLoadingCreditCard: true,

        };

        this.updateUserCard = null;
    }

    componentDidMount = () => {
        this.onGetUserCard();

        this.onGetUserCard();
    }

    routeEditProfile = () => {
        this.props.navigation.navigate('ProfileAboutEdit');
    }

    onGetUserCard = () => {
        this.setState({ isLoadingCreditCard: true });

        axios('get', urls['get-user-card']).then((response) => {
            this.setState({
                userCreditCard: response.data.data.card,
                isLoadingCreditCard: false
            })
        }).catch((error) => {
            this.setState({ isLoadingCreditCard: false });
        });
    }
    onAddUserCard = () => {
        this.setState({ isModalLoading: true });

        axios('post', urls['add-card-to-user']).then(async (response) => {

            this.setState({ isModalLoading: false });

            Linking.openURL(response.data.data.bankRequest.actionUrl);

            await amplitudeLogEventWithPropertiesAsync("user-card-binding", {})
        }).catch((error) => {
            this.setState({ isModalLoading: false });

            error = error.response;

            const { data } = error;

            DropDownHolder.dropDown.alertWithType('error', "Системное уведмление", data.error.details);
        });
    }
    onDeleteUserCard = () => {
        this.setState({ isModalLoading: true });

        axios('put', urls["remove-card-from-user"]).then((response) => {
            this.setState({ isModalLoading: false });

            this.onGetUserCard();
        }).catch((error) => {
            this.setState({ isModalLoading: false });
        });
    }

    userExit = async () => {
        await deleteItemAsync('jwt');
        this.props.updateAccount(null);
        this.props.setOrganization(null);
    }

    render() {
        const contactWork = (this.props?.app?.account || []).contacts.find((t) => t.type === 'work');
        const organizationName = contactWork?.organization?.name || 'Ошибка получения наименование организации';
        const isCreditCardLinked = Boolean(this.state.userCreditCard);
        const creditCard = this.state.userCreditCard?.Pan;
        const emailUser = this.props.app?.account?.email || '';
        const emailCashier = contactWork?.email?.value || '';

        if (!contactWork) {
            return (
                <Page styleContainer={styles.page}>

                    <Header title={'Подробная информация'} styleContainer={styles.headerContainer} {...this.props}/>

                    <View style={styles.container}>
                        <ScrollView contentContainerStyle={styles.scrollView}  showsVerticalScrollIndicator={false}>

                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>Вы не являетесь кассиром организации.</Text>
                            </View>

                            <View style={styles.separate}/>

                            <View style={styles.item}>
                                <TouchableOpacity style={styles.buttonExit} onPress={this.userExit}>
                                    <View style={styles.buttonExitIcon}>
                                        <ExitIcon/>
                                    </View>
                                    <Text style={styles.buttonExitText}>Выход</Text>
                                </TouchableOpacity>

                            </View>

                        </ScrollView>
                    </View>

                </Page>
            )
        }

        const isImageCard = Boolean(contactWork?.picture?.value);

        return (
            <Page styleContainer={styles.page}>

                <Header title={'Подробная информация'} styleContainer={styles.headerContainer} {...this.props}/>

                <ScrollView
                    style={[styles.container]}
                    contentContainerStyle={[styles.scrollView, { paddingBottom: 100 }]}
                    showsVerticalScrollIndicator={false}

                    refreshControl={
                        <RefreshControl refreshing={this.state.isLoadingCreditCard} onRefresh={this.onGetUserCard} />
                    }
                >
                    <View>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>Изображение</Text>

                            <View style={styles.imageContainer}>
                                {
                                    isImageCard ? (
                                        <Image
                                            source={{ uri: contactWork.picture.value }}
                                            style={{ flex: 1 }}
                                        />
                                    ) : (
                                        <PersonalBusinessPage style={{ marginTop: -50 }} color="#966EEA"/>
                                    )
                                }
                            </View>

                        </View>

                        <View style={styles.separate}/>

                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>Компания</Text>
                            <Text style={[styles.itemValue, {color: '#808080'}]}>{organizationName}</Text>
                        </View>

                        <View style={styles.separate}/>

                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>E-mail</Text>
                            <Text style={styles.itemValue}>{emailCashier || emailUser}</Text>
                        </View>

                        <View style={styles.separate}/>

                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>Комментарий для чаевых</Text>
                            <Text style={styles.itemValue}>{contactWork?.tipsMessage}</Text>
                        </View>

                        <View style={styles.separate}/>

                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>Ваша карта</Text>

                            {
                                this.state.isLoadingCreditCard ? (
                                    <View>
                                        <Text style={styles.itemValue}>Идет загрузка карты...</Text>
                                    </View>
                                ) : (
                                    <View>
                                        {
                                            isCreditCardLinked ? (
                                                <View>

                                                    <Text style={styles.itemValue}>{`•••• •••• •••• ${ creditCard.slice(-4) }`}</Text>

                                                    <TouchableOpacity style={{ marginTop: 8 }} onPress={this.onDeleteUserCard}>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            color: '#8152E4',
                                                            fontFamily: 'AtypDisplay_medium'
                                                        }}>Отвязать</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            ) : (
                                                <View>
                                                    <TouchableOpacity onPress={this.onAddUserCard} style={styles.buttonCreditCardLinked}>
                                                        <Text style={styles.buttonTextCreditCardLinked}>Привязать карту</Text>
                                                    </TouchableOpacity>

                                                    <Text style={styles.hint}>После успешной привязки банковской карты обновите страницу.</Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                )
                            }

                        </View>

                        <View style={styles.separate}/>

                        <View style={styles.item}>
                            <TouchableOpacity style={styles.buttonExit} onPress={this.userExit}>
                                <View style={styles.buttonExitIcon}>
                                    <ExitIcon/>
                                </View>
                                <Text style={styles.buttonExitText}>Выход</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={styles.buttonEdit}
                    onPress={this.routeEditProfile}
                >

                    <Icon name="edit-2" type="Feather" style={{fontSize: 15, color: 'white', marginRight: 8}}/>

                    <Text style={styles.buttonEditText}>Редактировать</Text>
                </TouchableOpacity>

                <ModalLoading
                    isOpen={this.state.isModalLoading}
                />

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingTop: 0
    },

    container: {
        paddingHorizontal: 12,
    },

    scrollView: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#E8E8E8',
        marginVertical: 12
    },

    item: {},
    itemTitle: {
        fontFamily: 'AtypDisplay',
        fontSize: 14,
        lineHeight: 17,
        color: '#808080',

        marginBottom: 8
    },
    itemValue: {
        fontFamily: 'AtypDisplay_medium',
        fontSize: 18,
        lineHeight: 22,
        color: '#000000'
    },

    buttonEdit: {
        position: 'absolute',
        bottom: 24,
        right: 24,

        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 10,
        paddingHorizontal: 16,

        borderRadius: 20,

        backgroundColor: '#8152E4'
    },
    buttonEditText: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 14,
        color: 'white'
    },

    buttonCreditCardLinked: {},
    buttonTextCreditCardLinked: {
        fontFamily: 'AtypText_medium',
        fontSize: 14,
        lineHeight: 18,
        color: '#8152E4'
    },

    imageContainer: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        overflow: 'hidden',

        backgroundColor: '#966EEA'
    },

    hint: {
        fontFamily: 'AtypDisplay',
        fontSize: 10,
        lineHeight: 10,
        color: '#808080',
        opacity: 0.5,

        marginTop: 8
    },

    buttonExit: {
        paddingVertical: 16,

        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonExitIcon: {
        width: 20,
        height: 25,
        marginRight: 16
    },
    buttonExitText: {
        fontFamily: 'AtypText',
        fontSize: 13,
        lineHeight: 14,
        color: '#808080'
    },
})

export default ProfileAbout
