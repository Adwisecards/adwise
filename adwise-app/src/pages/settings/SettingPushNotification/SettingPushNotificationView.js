import React, {Component, useState, useRef, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity, Platform,
} from 'react-native';
import {
    Page,
    Switch,
    ModalLoading,
    HeaderAccounts, DropDownHolder
} from "../../../components";
import * as Permissions from "expo-permissions";
import * as Linking from "expo-linking";
import axios from "../../../plugins/axios";
import urls from "../../../constants/urls";


class SettingPushNotification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notificationSettings: {},
            organizationIds: [],

            isPermission: true,
            isOpenModalLoading: false
        }
    }

    componentDidMount = async () => {
        await this.checkPermission();
        await this.getOrganizations();
    }

    checkPermission = async () => {
        const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        const isPermission = Boolean(existingStatus === 'granted');

        this.setState({isPermission});

        if (isPermission) {
            this.getUserNotificationSettings();
        }
    }

    getUserNotificationSettings = () => {
        axios('get', urls["get-notification-settings"]).then((response) => {
            this.setState({
                notificationSettings: response.data.data.notificationSettings
            })
        })
    }
    getOrganizations = async () => {
        const contacts = this.props?.app?.account?.contacts || {};
        let organizationIds = [];
        contacts.map(contact => {
            organizationIds.push(...contact.subscriptions)
        })

        this.setState({
            organizationIds: organizationIds.filter((id, idx, list) => {
                return idx <= list.indexOf(id);
            })
        })
    }

    onOpenSettingApp = async () => {
        if (Platform.OS === 'ios') {
            await Linking.openURL(`app-settings:`);
        } else {
            await Linking.openSettings();
        }
    }

    onChangeSettings = (value, name) => {
        let notificationSettings = {...this.state.notificationSettings};
        notificationSettings[name] = value;
        this.setState({ notificationSettings })
    }
    onChangeSettingsOrganization = (value) => {
        let notificationSettings = {...this.state.notificationSettings};
        let restrictedOrganizations = notificationSettings.restrictedOrganizations;

        if (restrictedOrganizations.includes(value)) {
            restrictedOrganizations.splice(restrictedOrganizations.findIndex((t) => t === value), 1);
        } else {
            restrictedOrganizations.push(value)
        }

        this.setState({ notificationSettings })
    }

    onSave = () => {
        this.setState({ isOpenModalLoading: true });
        axios('put', urls["update-notification-settings"], this.state.notificationSettings).then((response) => {
            this.setState({ isOpenModalLoading: false });
            DropDownHolder.alert('success', "Систменое уведомление", "Настройки успешно созранены");
        })
    }

    render() {
        const {isPermission, notificationSettings, organizationIds} = this.state;
        const restrictedOrganizations = notificationSettings?.restrictedOrganizations || [];

        return (
            <Page style={styles.page}>

                <HeaderAccounts title="Настройка уведомлений" {...this.props} styleRoot={{marginBottom: 12}}/>

                {
                    isPermission ? (
                        <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollView}>

                            <View style={styles.section}>
                                <View style={styles.row}>
                                    <Text style={styles.sectionTitle}>Визитные карточки</Text>
                                    <Switch value={notificationSettings.contact} onValueChange={(value) => this.onChangeSettings(value, 'contact')}/>
                                </View>
                                <Text style={styles.sectionCaption}>Узнавайте о запросах на обмен визитными карточками</Text>
                            </View>

                            <View style={styles.separate}/>

                            <View style={styles.section}>
                                <View style={styles.row}>
                                    <Text style={styles.sectionTitle}>Купоны</Text>
                                    <Switch value={notificationSettings.coupon} onValueChange={(value) => this.onChangeSettings(value, 'coupon')}/>
                                </View>
                                <Text style={styles.sectionCaption}>Узнавайте о изменениях статусов покупок</Text>

                            </View>

                            <View style={styles.separate}/>

                            <View style={styles.section}>
                                <View style={styles.row}>
                                    <Text style={styles.sectionTitle}>Реферальная сеть</Text>
                                    <Switch value={notificationSettings.ref} onValueChange={(value) => this.onChangeSettings(value, 'ref')}/>
                                </View>
                                <Text style={styles.sectionCaption}>Узнавайте о начислениях бонусных баллов от подписчиков</Text>
                            </View>

                            <View style={styles.separate}/>

                            {
                                false && (
                                    <>
                                        <View style={styles.section}>
                                            <View style={styles.row}>
                                                <Text style={styles.sectionTitle}>Планировщик</Text>
                                                <Switch value={notificationSettings.task} onValueChange={(value) => this.onChangeSettings(value, 'task')}/>
                                            </View>
                                            <Text style={styles.sectionCaption}>Узнавайте о новых задачах от других пользователей</Text>
                                        </View>
                                        <View style={styles.separate}/>
                                    </>
                                )
                            }

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Черный список организаций</Text>
                                <Text style={[styles.sectionCaption, {marginBottom: 24}]}>Добавьте организации в черный список чтобы не получать от них уведомления</Text>

                                {
                                    organizationIds.map((organization, idx) => (
                                        <>
                                            {idx > 0 && (
                                                <View style={styles.separate}/>
                                            )}
                                            <OrganizationSwitch
                                                id={organization}
                                                value={Boolean(restrictedOrganizations.find(t => t === organization))}
                                                onValueChange={this.onChangeSettingsOrganization}
                                            />
                                        </>
                                    ))
                                }

                            </View>

                        </ScrollView>
                    ) : (
                        <View style={[styles.section, styles.scrollView]}>
                            <Text style={styles.sectionTitle}>Разрешение не предоставлено</Text>
                            <Text style={styles.sectionCaption}>Включите уведомления чтобы не пропустить уникальные акции и предложения!</Text>

                            <TouchableOpacity style={styles.buttonFull} onPress={this.onOpenSettingApp}>
                                <Text style={styles.buttonFullText}>Открыть настройки</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

                {
                    isPermission && (
                        <View style={styles.scrollView}>
                            <TouchableOpacity style={styles.buttonFull} onPress={this.onSave}>
                                <Text style={styles.buttonFullText}>Сохранить</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

                <ModalLoading
                    isOpen={this.state.isOpenModalLoading}
                />
            </Page>
        );
    }
}

const OrganizationSwitch = (props) => {
    const { id, value, onChangeSettings, onValueChange } = props;

    const [organization, setOrganization] = useState({});

    useEffect(() => {
        (async () => {
            const organization = await axios('get', `${ urls["get-organization"] }${ id }`).then((response) => {
               return response.data.data.organization;
            });

            setOrganization(organization);
        })();
    }, []);

    return (
        <View style={styles.row}>
            <Text style={styles.rowText}>{ organization?.name || "Идет загрузка..." }</Text>
            <Switch value={value} onValueChange={() => onValueChange(id)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    scrollView: {
        paddingVertical: 12,
        paddingHorizontal: 24
    },

    section: {},
    sectionTitle: {
        fontFamily: 'AtypText_medium',
        fontSize: 18,
        lineHeight: 20,
        color: 'black'
    },
    sectionCaption: {
        fontFamily: 'AtypText',
        fontSize: 16,
        lineHeight: 18,
        opacity: 0.5,
        marginTop: 16
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowText: {
        flex: 1,
        fontFamily: 'AtypText',
        fontSize: 18,
        lineHeight: 20,
        color: 'black',
        marginRight: 16
    },

    separate: {
        width: '100%',
        height: 1,
        backgroundColor: '#000000',
        opacity: 0.1,
        marginVertical: 24
    },

    buttonFull: {
        marginTop: 24,

        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#8152E4',

        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonFullText: {
        fontFamily: 'AtypText_medium',
        fontSize: 20,
        lineHeight: 20,
        color: 'white'
    },
})

export default SettingPushNotification
